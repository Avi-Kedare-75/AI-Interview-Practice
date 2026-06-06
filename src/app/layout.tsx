import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireMind AI - Multi-Agent AI Interview & Assessment Ecosystem",
  description:
    "Prepare for your dream job with AI-powered multi-agent interviews, voice assessments, coding challenges, group discussions, and recruiter-grade performance reports.",
  keywords: [
    "AI interview",
    "mock interview",
    "coding assessment",
    "interview preparation",
    "multi-agent",
    "group discussion",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className="h-full"
    >
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <Navbar />
              <main className="flex-1 pt-[73px]">{children}</main>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
