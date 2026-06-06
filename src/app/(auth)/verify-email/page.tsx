"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOTP, resendOTP } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { Mail, ArrowRight, Loader2, RefreshCcw } from "lucide-react";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await verifyOTP(email, otp);
      if (res.success) {
        setMessage("Email verified successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(res.error || "Verification failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const res = await resendOTP(email);
      if (res.success) {
        setMessage("A new OTP has been sent to your email.");
      } else {
        setError(res.error || "Failed to resend OTP");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Invalid verification link. Please sign up or log in.</p>
        <Button onClick={() => router.push("/login")} className="mt-4">Go to Login</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card z-10 w-full max-w-md rounded-2xl p-8"
    >
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-primary/20">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <h1 className="mb-2 text-2xl font-bold font-heading text-foreground">
          Verify your email
        </h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-md bg-success/10 p-3 text-sm text-success border border-success/20 text-center">
            {message}
          </div>
        )}

        <div className="space-y-2">
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
            className="text-center text-lg tracking-widest bg-background/50 border-border/50 h-12"
            required
            maxLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-6 gradient-bg"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><ArrowRight className="mr-2 h-4 w-4" /> Verify</>}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Didn&apos;t receive the code?{" "}
        <button
          onClick={handleResend}
          disabled={isResending}
          className="font-medium text-primary hover:underline disabled:opacity-50 inline-flex items-center"
        >
          {isResending ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <RefreshCcw className="mr-1 h-3 w-3" />}
          Resend OTP
        </button>
      </div>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]" />
      <Suspense fallback={<div className="glass-card p-8 rounded-2xl"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
