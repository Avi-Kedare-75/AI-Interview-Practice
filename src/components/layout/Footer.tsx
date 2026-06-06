import Link from "next/link";
import {
  Brain,
  Link as LinkIcon,
  Globe,
  MessageSquare,
  Mail,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Interview Types",
    links: [
      { label: "Technical Interview", href: "/interview/technical" },
      { label: "HR Interview", href: "/interview/hr" },
      { label: "Multi-Agent", href: "/interview/multi-agent" },
      { label: "Group Discussion", href: "/group-discussion" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Community", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

const socialLinks = [
  { icon: Globe, href: "#", label: "Website" },
  { icon: LinkIcon, href: "#", label: "Links" },
  { icon: MessageSquare, href: "#", label: "Social" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold font-heading gradient-text">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Prepare for your dream job with AI-powered multi-agent interviews
              and recruiter-grade assessments.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for candidates worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
