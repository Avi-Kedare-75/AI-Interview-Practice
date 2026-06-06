// ============================================================================
// HireMind AI — Constants
// ============================================================================

import type { NavItem } from "@/types";

export const APP_NAME = "HireMind AI";
export const APP_TAGLINE = "Multi-Agent AI Interview & Assessment Ecosystem";
export const APP_DESCRIPTION =
  "An intelligent hiring preparation platform where multiple AI interviewers conduct sequential interviews, evaluate candidates, and generate recruiter-grade reports.";

export const mainNavItems: NavItem[] = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export const dashboardNavItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Interviews", href: "/interview/setup", icon: "MessageSquare" },
  { label: "Reports", href: "/report", icon: "FileText" },
  { label: "Group Discussion", href: "/group-discussion", icon: "Users" },
  { label: "Settings", href: "/dashboard", icon: "Settings" },
];

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Users", href: "/admin", icon: "Users" },
  { label: "Interviews", href: "/admin", icon: "MessageSquare" },
  { label: "Reports", href: "/admin", icon: "FileText" },
  { label: "Domains", href: "/admin", icon: "BookOpen" },
  { label: "Settings", href: "/admin", icon: "Settings" },
];
