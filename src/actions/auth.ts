"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import { sendVerificationOTP } from "@/lib/mail";

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function signUp(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { success: false, error: "Missing required fields" };
    }

    const emailLower = email.toLowerCase();

    await dbConnect();

    // Check if user exists
    const existingUser = await User.findOne({ email: emailLower });
    
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return { success: false, error: "Email already in use" };
      }
      // If user exists but is not verified, we can resend OTP or update password
      // For simplicity, we'll update the password and resend OTP
      const salt = await bcrypt.genSalt(10);
      existingUser.passwordHash = await bcrypt.hash(password, salt);
      existingUser.name = name;
      await existingUser.save();
    } else {
      // Create new user
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      await User.create({
        name,
        email: emailLower,
        passwordHash,
      });
    }

    // Generate and save OTP
    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Remove any existing tokens for this email
    await VerificationToken.deleteMany({ email: emailLower });

    await VerificationToken.create({
      email: emailLower,
      otp,
      expires,
    });

    // Send email
    const mailResult = await sendVerificationOTP(emailLower, otp);
    
    if (!mailResult.success) {
      return { success: false, error: "Failed to send verification email" };
    }

    return { success: true, email: emailLower };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function verifyOTP(email: string, otp: string) {
  try {
    if (!email || !otp) {
      return { success: false, error: "Missing email or OTP" };
    }

    const emailLower = email.toLowerCase();
    
    await dbConnect();

    const token = await VerificationToken.findOne({ email: emailLower, otp });

    if (!token) {
      return { success: false, error: "Invalid or expired OTP" };
    }

    if (token.expires < new Date()) {
      await VerificationToken.deleteOne({ _id: token._id });
      return { success: false, error: "OTP has expired" };
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email: emailLower },
      { isEmailVerified: true },
      { new: true }
    );

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Clean up token
    await VerificationToken.deleteOne({ _id: token._id });

    return { success: true };
  } catch (error) {
    console.error("OTP Verification error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function resendOTP(email: string) {
  try {
    const emailLower = email.toLowerCase();
    
    await dbConnect();
    
    const user = await User.findOne({ email: emailLower });
    
    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.isEmailVerified) {
      return { success: false, error: "Email is already verified" };
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await VerificationToken.deleteMany({ email: emailLower });
    await VerificationToken.create({ email: emailLower, otp, expires });

    const mailResult = await sendVerificationOTP(emailLower, otp);
    
    if (!mailResult.success) {
      return { success: false, error: "Failed to send verification email" };
    }

    return { success: true };
  } catch (error) {
    console.error("Resend OTP error:", error);
    return { success: false, error: "Internal server error" };
  }
}
