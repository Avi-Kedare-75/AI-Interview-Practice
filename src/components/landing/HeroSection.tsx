"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-36">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-violet/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-accent/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/10 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Powered by Claude, GPT & Gemini</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold leading-tight tracking-tight font-heading sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Ace Every Interview with{" "}
            <span className="gradient-text">Multi-Agent AI</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Practice with AI interviewers that simulate real hiring panels.
            Get evaluated by Technical Leads, HR Experts, Team Leads, and
            Hiring Managers — all powered by cutting-edge AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="gradient-bg text-white border-0 gap-2 px-8 text-base group glow-violet"
              >
                Start Free Interview
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-8 text-base"
              >
                <Play className="h-4 w-4" />
                See How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />
              3 free interviews
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />
              Instant AI feedback
            </span>
          </motion.div>
        </div>

        {/* Floating illustration */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="glass-card rounded-2xl p-2 glow-violet">
            <div className="rounded-xl bg-card overflow-hidden">
              {/* Mock dashboard preview */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-4 text-xs text-muted-foreground">
                  HireMind AI — Interview Session
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 p-6">
                <div className="col-span-2 space-y-4">
                  <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                  <div className="mt-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-lg border border-border p-3"
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/20 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-2/3 rounded bg-muted" />
                          <div className="h-3 w-full rounded bg-muted/50" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border p-4">
                    <div className="h-3 w-1/2 rounded bg-primary/30 mb-3" />
                    <div className="flex items-center justify-center">
                      <div className="h-20 w-20 rounded-full border-4 border-primary/30 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">85</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-4 space-y-2">
                    <div className="h-3 w-2/3 rounded bg-muted" />
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-4/5 rounded-full gradient-bg" />
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-3/5 rounded-full gradient-bg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 animate-float">
            <div className="glass-card rounded-lg px-3 py-2 text-xs font-medium text-primary">
              🤖 AI Agent Active
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 animate-float" style={{ animationDelay: "2s" }}>
            <div className="glass-card rounded-lg px-3 py-2 text-xs font-medium text-success">
              ✅ Score: 92/100
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
