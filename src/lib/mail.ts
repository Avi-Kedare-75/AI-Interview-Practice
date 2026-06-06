import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationOTP = async (email: string, otp: string) => {
  // In development, if no SMTP user is configured, just log to console
  if (!process.env.SMTP_USER || process.env.SMTP_USER === "your-email@gmail.com") {
    console.log("===============================");
    console.log(`[MOCK EMAIL] OTP for ${email} is: ${otp}`);
    console.log("===============================");
    return { success: true, message: "Mock email sent (logged to console)" };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "HireMind AI <noreply@hiremind.ai>",
      to: email,
      subject: "Your HireMind AI Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #6d28d9; text-align: center;">HireMind AI</h2>
          <p style="font-size: 16px; color: #334155;">Hello,</p>
          <p style="font-size: 16px; color: #334155;">Please use the following OTP to verify your email address. This code will expire in 10 minutes.</p>
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #0f172a;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #64748b; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, error: "Failed to send email" };
  }
};
