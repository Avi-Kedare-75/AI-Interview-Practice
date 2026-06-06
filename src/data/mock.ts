// ============================================================================
// HireMind AI — Mock Data
// Phase 1: UI Foundation
// ============================================================================

import type {
  Feature,
  Statistic,
  Testimonial,
  PricingPlan,
  FAQItem,
  HowItWorksStep,
  CandidateProfile,
  RecentInterview,
  DomainProgress,
  SkillScore,
  UpcomingSession,
  LearningRecommendation,
  InterviewDomain,
  VoicePreference,
  ChatMessage,
  InterviewQuestion,
  InterviewAgent,
  DiscussionParticipant,
  DiscussionTopic,
  CandidateReport,
  AdminStats,
  TimeSeriesData,
  DomainDistribution,
  LeaderboardEntry,
  AdminReport,
} from "@/types";

// ─── Landing Page ────────────────────────────────────────────────────────────

export const features: Feature[] = [
  {
    id: "f1",
    title: "Multi-Agent Interviews",
    description:
      "Experience realistic interviews with AI agents playing different roles — Technical Lead, HR, Team Lead, and Hiring Manager.",
    icon: "Users",
  },
  {
    id: "f2",
    title: "Voice-Powered Conversations",
    description:
      "Speak naturally with our AI interviewers using advanced voice synthesis for the most authentic practice experience.",
    icon: "Mic",
  },
  {
    id: "f3",
    title: "Real-Time Code Assessment",
    description:
      "Write, run, and debug code in our built-in editor with live AI analysis of your problem-solving approach.",
    icon: "Code",
  },
  {
    id: "f4",
    title: "AI Group Discussions",
    description:
      "Participate in simulated group discussions with 5 AI participants to sharpen your communication and leadership skills.",
    icon: "MessageSquare",
  },
  {
    id: "f5",
    title: "Smart Resume Analysis",
    description:
      "Upload your resume and get instant AI-powered feedback on skills, gaps, and interview readiness.",
    icon: "FileText",
  },
  {
    id: "f6",
    title: "Recruiter-Grade Reports",
    description:
      "Receive detailed performance reports with scores, analysis, and personalized improvement roadmaps.",
    icon: "BarChart3",
  },
];

export const statistics: Statistic[] = [
  { id: "s1", label: "Interviews Conducted", value: 125000, suffix: "+" },
  { id: "s2", label: "Candidates Placed", value: 8500, suffix: "+" },
  { id: "s3", label: "Success Rate", value: 94, suffix: "%" },
  { id: "s4", label: "AI Agents Active", value: 25, suffix: "+" },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    role: "Software Engineer",
    company: "Google",
    content:
      "HireMind AI's multi-agent interview system is the closest thing to a real interview I've experienced. The adaptive difficulty kept me on my toes.",
    avatar: "/avatars/avatar-1.png",
    rating: 5,
  },
  {
    id: "t2",
    name: "James Chen",
    role: "Full Stack Developer",
    company: "Meta",
    content:
      "The group discussion feature is incredible. Practicing with AI participants helped me nail my actual panel interview.",
    avatar: "/avatars/avatar-2.png",
    rating: 5,
  },
  {
    id: "t3",
    name: "Sarah Williams",
    role: "Product Manager",
    company: "Amazon",
    content:
      "The detailed reports and learning roadmaps helped me identify exactly where I needed to improve. Landed my dream job within 2 months.",
    avatar: "/avatars/avatar-3.png",
    rating: 5,
  },
  {
    id: "t4",
    name: "Raj Patel",
    role: "Data Scientist",
    company: "Microsoft",
    content:
      "Voice interviews felt incredibly natural. The AI adapted to my responses and asked follow-up questions just like a real interviewer.",
    avatar: "/avatars/avatar-4.png",
    rating: 4,
  },
  {
    id: "t5",
    name: "Emily Rodriguez",
    role: "DevOps Engineer",
    company: "Netflix",
    content:
      "From resume analysis to mock interviews, HireMind AI covered every aspect of my preparation. Absolutely worth it.",
    avatar: "/avatars/avatar-5.png",
    rating: 5,
  },
  {
    id: "t6",
    name: "Alex Kim",
    role: "Frontend Engineer",
    company: "Stripe",
    content:
      "The coding assessment engine with real-time AI review of my approach taught me more than months of LeetCode grinding.",
    avatar: "/avatars/avatar-6.png",
    rating: 5,
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "p1",
    name: "Starter",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with AI interviews",
    features: [
      "3 AI interviews per month",
      "Basic performance reports",
      "Text-based interviews",
      "1 domain access",
      "Community support",
    ],
    cta: "Get Started Free",
  },
  {
    id: "p2",
    name: "Professional",
    price: 29,
    period: "month",
    description: "For serious candidates preparing for top companies",
    features: [
      "Unlimited AI interviews",
      "Detailed analytics & reports",
      "Voice-powered interviews",
      "All domains unlocked",
      "Multi-agent interviews",
      "Group discussion access",
      "Resume intelligence",
      "Priority support",
    ],
    popular: true,
    cta: "Start Pro Trial",
  },
  {
    id: "p3",
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For teams and organizations hiring at scale",
    features: [
      "Everything in Professional",
      "Recruiter dashboard",
      "Candidate comparison tools",
      "Custom AI agents",
      "API access",
      "White-label options",
      "Dedicated account manager",
      "SSO & compliance",
    ],
    cta: "Contact Sales",
  },
];

export const faqItems: FAQItem[] = [
  {
    id: "faq1",
    question: "How realistic are the AI interviews?",
    answer:
      "Our multi-agent system uses advanced language models (Claude, GPT, Gemini) fine-tuned on thousands of real interview transcripts. Each AI agent has a distinct personality and interviewing style, making the experience remarkably close to real interviews.",
  },
  {
    id: "faq2",
    question: "What domains and roles are supported?",
    answer:
      "We support 15+ technical domains including Frontend, Backend, Full Stack, Data Science, DevOps, Mobile, System Design, and more. Non-technical roles like Product Management and Business Analysis are also covered.",
  },
  {
    id: "faq3",
    question: "How does the voice interview feature work?",
    answer:
      "We use ElevenLabs for natural AI voice synthesis and Web Speech API for speech recognition. You can choose from multiple voice profiles with different accents and speaking styles for a personalized experience.",
  },
  {
    id: "faq4",
    question: "Can I use HireMind AI for team hiring?",
    answer:
      "Yes! Our Enterprise plan includes a recruiter dashboard where you can create custom interview flows, compare candidates side-by-side, and generate hiring recommendations powered by AI analysis.",
  },
  {
    id: "faq5",
    question: "How is my data protected?",
    answer:
      "All data is encrypted at rest and in transit. Interview recordings are stored securely on Cloudinary with access controls. We are SOC 2 compliant and never share your data with third parties.",
  },
  {
    id: "faq6",
    question: "What makes the group discussion feature unique?",
    answer:
      "Our AI group discussion arena features 5 AI participants with diverse perspectives and communication styles. The system evaluates your leadership, communication, and collaboration skills in real-time.",
  },
  {
    id: "faq7",
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied with your experience, contact our support team for a full refund.",
  },
  {
    id: "faq8",
    question: "How accurate are the performance reports?",
    answer:
      "Our reports are calibrated against real recruiter evaluations with 92% accuracy. Each report includes technical depth, communication quality, problem-solving approach, and a personalized learning roadmap.",
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: "step1",
    step: 1,
    title: "Upload Your Resume",
    description:
      "Our AI analyzes your resume to identify skills, experience, and areas for improvement.",
    icon: "Upload",
  },
  {
    id: "step2",
    step: 2,
    title: "Choose Your Interview",
    description:
      "Select your domain, difficulty level, and preferred interview type to get started.",
    icon: "Settings",
  },
  {
    id: "step3",
    step: 3,
    title: "Practice with AI Agents",
    description:
      "Experience multi-round interviews with AI agents that adapt to your responses in real-time.",
    icon: "Bot",
  },
  {
    id: "step4",
    step: 4,
    title: "Get Your Report",
    description:
      "Receive a comprehensive performance report with scores, analysis, and a personalized learning roadmap.",
    icon: "FileCheck",
  },
];

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const candidateProfile: CandidateProfile = {
  id: "c1",
  name: "Avi Kedare",
  email: "avi@example.com",
  avatar: "/avatars/avatar-1.png",
  readinessScore: 78,
  interviewsCompleted: 12,
  joinedAt: "2025-11-15",
};

export const recentInterviews: RecentInterview[] = [
  {
    id: "ri1",
    title: "React & Next.js Deep Dive",
    domain: "Frontend",
    type: "technical",
    status: "completed",
    score: 85,
    date: "2026-06-05",
    duration: "45 min",
  },
  {
    id: "ri2",
    title: "System Design Interview",
    domain: "System Design",
    type: "technical",
    status: "completed",
    score: 72,
    date: "2026-06-03",
    duration: "60 min",
  },
  {
    id: "ri3",
    title: "Behavioral Interview",
    domain: "General",
    type: "hr",
    status: "completed",
    score: 90,
    date: "2026-06-01",
    duration: "30 min",
  },
  {
    id: "ri4",
    title: "Full Stack Assessment",
    domain: "Full Stack",
    type: "multi-agent",
    status: "in-progress",
    score: null,
    date: "2026-06-06",
    duration: "90 min",
  },
  {
    id: "ri5",
    title: "Node.js & Express",
    domain: "Backend",
    type: "technical",
    status: "scheduled",
    score: null,
    date: "2026-06-08",
    duration: "45 min",
  },
];

export const domainProgressData: DomainProgress[] = [
  { id: "dp1", domain: "Frontend", progress: 82, totalQuestions: 50, completedQuestions: 41 },
  { id: "dp2", domain: "Backend", progress: 65, totalQuestions: 50, completedQuestions: 33 },
  { id: "dp3", domain: "System Design", progress: 45, totalQuestions: 30, completedQuestions: 14 },
  { id: "dp4", domain: "Data Structures", progress: 70, totalQuestions: 60, completedQuestions: 42 },
  { id: "dp5", domain: "DevOps", progress: 30, totalQuestions: 25, completedQuestions: 8 },
  { id: "dp6", domain: "Database", progress: 55, totalQuestions: 35, completedQuestions: 19 },
];

export const skillScores: SkillScore[] = [
  { skill: "Problem Solving", score: 85, fullMark: 100 },
  { skill: "Communication", score: 78, fullMark: 100 },
  { skill: "Technical Depth", score: 82, fullMark: 100 },
  { skill: "System Design", score: 65, fullMark: 100 },
  { skill: "Code Quality", score: 90, fullMark: 100 },
  { skill: "Leadership", score: 60, fullMark: 100 },
  { skill: "Adaptability", score: 75, fullMark: 100 },
  { skill: "Time Mgmt", score: 88, fullMark: 100 },
];

export const upcomingSessions: UpcomingSession[] = [
  {
    id: "us1",
    title: "Node.js Backend Interview",
    type: "technical",
    date: "2026-06-08",
    time: "10:00 AM",
    domain: "Backend",
  },
  {
    id: "us2",
    title: "Leadership & Teamwork GD",
    type: "group-discussion",
    date: "2026-06-10",
    time: "2:00 PM",
    domain: "General",
  },
  {
    id: "us3",
    title: "Full Stack Multi-Agent",
    type: "multi-agent",
    date: "2026-06-12",
    time: "11:00 AM",
    domain: "Full Stack",
  },
];

export const learningRecommendations: LearningRecommendation[] = [
  {
    id: "lr1",
    title: "Master System Design Patterns",
    description: "Focus on scalability patterns, load balancing, and distributed systems.",
    category: "System Design",
    priority: "high",
    estimatedTime: "2 weeks",
  },
  {
    id: "lr2",
    title: "Improve Leadership Communication",
    description: "Practice STAR method responses and conflict resolution scenarios.",
    category: "Soft Skills",
    priority: "medium",
    estimatedTime: "1 week",
  },
  {
    id: "lr3",
    title: "DevOps Fundamentals",
    description: "Learn CI/CD pipelines, Docker, Kubernetes basics, and cloud deployment.",
    category: "DevOps",
    priority: "high",
    estimatedTime: "3 weeks",
  },
  {
    id: "lr4",
    title: "Advanced TypeScript",
    description: "Deep dive into generics, utility types, and advanced patterns.",
    category: "Frontend",
    priority: "low",
    estimatedTime: "1 week",
  },
];

// ─── Interview Setup ─────────────────────────────────────────────────────────

export const interviewDomains: InterviewDomain[] = [
  { id: "d1", name: "Frontend", icon: "Monitor", description: "React, Angular, Vue, CSS, HTML, JavaScript", questionsCount: 150 },
  { id: "d2", name: "Backend", icon: "Server", description: "Node.js, Python, Java, Go, APIs, Microservices", questionsCount: 180 },
  { id: "d3", name: "Full Stack", icon: "Layers", description: "End-to-end development with modern tech stacks", questionsCount: 200 },
  { id: "d4", name: "Data Science", icon: "Brain", description: "ML, AI, Statistics, Python, TensorFlow, PyTorch", questionsCount: 120 },
  { id: "d5", name: "DevOps", icon: "Cloud", description: "AWS, Docker, Kubernetes, CI/CD, Infrastructure", questionsCount: 100 },
  { id: "d6", name: "System Design", icon: "Network", description: "Architecture, Scalability, Distributed Systems", questionsCount: 80 },
  { id: "d7", name: "Mobile", icon: "Smartphone", description: "React Native, Flutter, iOS, Android", questionsCount: 110 },
  { id: "d8", name: "Database", icon: "Database", description: "SQL, NoSQL, PostgreSQL, MongoDB, Redis", questionsCount: 90 },
];

export const voicePreferences: VoicePreference[] = [
  { id: "v1", name: "Professional Sarah", accent: "American", gender: "Female", preview: "Calm and professional tone" },
  { id: "v2", name: "Technical James", accent: "British", gender: "Male", preview: "Technical and precise delivery" },
  { id: "v3", name: "Friendly Priya", accent: "Indian", gender: "Female", preview: "Warm and encouraging" },
  { id: "v4", name: "Direct Alex", accent: "Australian", gender: "Male", preview: "Direct and fast-paced" },
];

// ─── Interview Screen ────────────────────────────────────────────────────────

export const mockChatMessages: ChatMessage[] = [
  {
    id: "cm1",
    sender: "ai",
    content: "Welcome to your technical interview! I'm Dr. Sarah, your AI interviewer. Today we'll be discussing React and frontend architecture. Are you ready to begin?",
    timestamp: "10:00 AM",
    agentName: "Dr. Sarah",
    agentRole: "Technical Lead",
  },
  {
    id: "cm2",
    sender: "user",
    content: "Yes, I'm ready! Looking forward to it.",
    timestamp: "10:01 AM",
  },
  {
    id: "cm3",
    sender: "ai",
    content: "Great! Let's start with a fundamental question. Can you explain the difference between server-side rendering and client-side rendering in Next.js? When would you choose one over the other?",
    timestamp: "10:01 AM",
    agentName: "Dr. Sarah",
    agentRole: "Technical Lead",
  },
  {
    id: "cm4",
    sender: "user",
    content: "SSR renders pages on the server for each request, which is great for SEO and initial load performance. CSR renders in the browser, which is better for highly interactive apps. In Next.js, I'd use SSR for content-heavy pages and CSR for dashboards.",
    timestamp: "10:03 AM",
  },
  {
    id: "cm5",
    sender: "ai",
    content: "Excellent explanation! You've covered the key trade-offs well. Now, let's go deeper. How does React Server Components change this paradigm? Can you walk me through a practical example?",
    timestamp: "10:03 AM",
    agentName: "Dr. Sarah",
    agentRole: "Technical Lead",
  },
];

export const mockInterviewQuestion: InterviewQuestion = {
  id: "q1",
  question: "Explain the Virtual DOM reconciliation process in React. How does React determine the minimal set of changes needed to update the real DOM?",
  difficulty: "advanced",
  topic: "React Internals",
  domain: "Frontend",
  timeLimit: 600,
};

// ─── Multi-Agent Flow ────────────────────────────────────────────────────────

export const interviewAgents: InterviewAgent[] = [
  {
    id: "a1",
    name: "Dr. Sarah Chen",
    role: "Technical Expert",
    avatar: "/avatars/agent-1.png",
    status: "completed",
    score: 85,
    feedback: "Strong technical foundation with excellent problem-solving skills. Could improve on system design.",
    duration: "25 min",
  },
  {
    id: "a2",
    name: "Michael Brooks",
    role: "HR Expert",
    avatar: "/avatars/agent-2.png",
    status: "completed",
    score: 90,
    feedback: "Excellent communication and cultural fit. Shows genuine passion for technology.",
    duration: "20 min",
  },
  {
    id: "a3",
    name: "Lisa Wong",
    role: "Team Lead",
    avatar: "/avatars/agent-3.png",
    status: "active",
    score: null,
    feedback: null,
    duration: null,
  },
  {
    id: "a4",
    name: "David Kumar",
    role: "Hiring Manager",
    avatar: "/avatars/agent-4.png",
    status: "pending",
    score: null,
    feedback: null,
    duration: null,
  },
];

// ─── Group Discussion ────────────────────────────────────────────────────────

export const discussionParticipants: DiscussionParticipant[] = [
  { id: "gp1", name: "You", role: "Candidate", avatar: "/avatars/avatar-1.png", isAI: false, isSpeaking: false, participationScore: 72, contributions: 8 },
  { id: "gp2", name: "AI Aria", role: "Software Engineer", avatar: "/avatars/ai-1.png", isAI: true, isSpeaking: true, participationScore: 85, contributions: 12 },
  { id: "gp3", name: "AI Marcus", role: "Product Manager", avatar: "/avatars/ai-2.png", isAI: true, isSpeaking: false, participationScore: 68, contributions: 7 },
  { id: "gp4", name: "AI Zara", role: "UX Designer", avatar: "/avatars/ai-3.png", isAI: true, isSpeaking: false, participationScore: 78, contributions: 10 },
  { id: "gp5", name: "AI Ethan", role: "Data Scientist", avatar: "/avatars/ai-4.png", isAI: true, isSpeaking: false, participationScore: 62, contributions: 6 },
  { id: "gp6", name: "AI Nora", role: "DevOps Lead", avatar: "/avatars/ai-5.png", isAI: true, isSpeaking: false, participationScore: 70, contributions: 9 },
];

export const discussionTopic: DiscussionTopic = {
  id: "dt1",
  title: "The Future of AI in Software Development",
  description:
    "Discuss how AI will transform software development workflows, including code generation, testing, deployment, and team collaboration. Consider both opportunities and challenges.",
  duration: "30 minutes",
  category: "Technology",
};

// ─── Candidate Report ────────────────────────────────────────────────────────

export const candidateReport: CandidateReport = {
  id: "cr1",
  candidateName: "Avi Kedare",
  date: "2026-06-06",
  overallScore: 82,
  letterGrade: "A-",
  scores: {
    technical: 85,
    hr: 90,
    communication: 78,
    leadership: 65,
    problemSolving: 88,
    teamwork: 82,
  },
  strengths: [
    "Strong problem-solving methodology with structured approach",
    "Excellent technical depth in React and Node.js ecosystem",
    "Clear and articulate communication during technical explanations",
    "Demonstrates genuine passion for continuous learning",
    "Good understanding of scalable architecture patterns",
  ],
  weaknesses: [
    "System design skills need more practice with large-scale systems",
    "Could improve leadership presence during group discussions",
    "Time management under pressure needs refinement",
    "Limited experience with DevOps and infrastructure",
    "Should practice more behavioral STAR-format responses",
  ],
  roadmap: [
    { id: "rm1", title: "System Design Fundamentals", description: "Study load balancers, caching strategies, and database sharding", week: 1, completed: false, category: "System Design" },
    { id: "rm2", title: "Leadership Communication", description: "Practice leading group discussions and presenting ideas", week: 2, completed: false, category: "Soft Skills" },
    { id: "rm3", title: "Advanced React Patterns", description: "Master compound components, render props, and custom hooks", week: 3, completed: false, category: "Technical" },
    { id: "rm4", title: "DevOps Essentials", description: "Learn Docker, basic Kubernetes, and CI/CD pipelines", week: 4, completed: false, category: "DevOps" },
    { id: "rm5", title: "Mock Interview Marathon", description: "Complete 5 full mock interviews across all types", week: 5, completed: false, category: "Practice" },
    { id: "rm6", title: "Final Assessment", description: "Take the comprehensive multi-agent interview assessment", week: 6, completed: false, category: "Assessment" },
  ],
};

// ─── Admin Dashboard ─────────────────────────────────────────────────────────

export const adminStats: AdminStats = {
  totalUsers: 12450,
  totalInterviews: 125000,
  activeUsers: 3200,
  avgScore: 74,
  growthRate: 23.5,
};

export const signupTrend: TimeSeriesData[] = [
  { date: "Jan", value: 1200 },
  { date: "Feb", value: 1450 },
  { date: "Mar", value: 1800 },
  { date: "Apr", value: 2100 },
  { date: "May", value: 2600 },
  { date: "Jun", value: 3200 },
];

export const interviewTrend: TimeSeriesData[] = [
  { date: "Mon", value: 320 },
  { date: "Tue", value: 450 },
  { date: "Wed", value: 380 },
  { date: "Thu", value: 520 },
  { date: "Fri", value: 410 },
  { date: "Sat", value: 280 },
  { date: "Sun", value: 190 },
];

export const domainDistribution: DomainDistribution[] = [
  { domain: "Frontend", count: 3200, percentage: 28, color: "#8b5cf6" },
  { domain: "Backend", count: 2800, percentage: 24, color: "#06b6d4" },
  { domain: "Full Stack", count: 1900, percentage: 16, color: "#10b981" },
  { domain: "Data Science", count: 1400, percentage: 12, color: "#f59e0b" },
  { domain: "DevOps", count: 1100, percentage: 9, color: "#ef4444" },
  { domain: "System Design", count: 800, percentage: 7, color: "#ec4899" },
  { domain: "Other", count: 500, percentage: 4, color: "#6b7280" },
];

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Priya Sharma", avatar: "/avatars/avatar-1.png", score: 96, interviews: 24, domain: "Full Stack", badge: "gold" },
  { rank: 2, name: "James Chen", avatar: "/avatars/avatar-2.png", score: 94, interviews: 20, domain: "Backend", badge: "silver" },
  { rank: 3, name: "Sarah Williams", avatar: "/avatars/avatar-3.png", score: 92, interviews: 22, domain: "Frontend", badge: "bronze" },
  { rank: 4, name: "Raj Patel", avatar: "/avatars/avatar-4.png", score: 89, interviews: 18, domain: "Data Science", badge: null },
  { rank: 5, name: "Emily Rodriguez", avatar: "/avatars/avatar-5.png", score: 87, interviews: 15, domain: "DevOps", badge: null },
  { rank: 6, name: "Alex Kim", avatar: "/avatars/avatar-6.png", score: 85, interviews: 19, domain: "Frontend", badge: null },
  { rank: 7, name: "Maria Garcia", avatar: "/avatars/avatar-1.png", score: 83, interviews: 16, domain: "System Design", badge: null },
  { rank: 8, name: "David Lee", avatar: "/avatars/avatar-2.png", score: 81, interviews: 14, domain: "Backend", badge: null },
];

export const adminReports: AdminReport[] = [
  { id: "ar1", candidateName: "Priya Sharma", date: "2026-06-06", type: "multi-agent", score: 96, status: "reviewed" },
  { id: "ar2", candidateName: "James Chen", date: "2026-06-05", type: "technical", score: 94, status: "reviewed" },
  { id: "ar3", candidateName: "Sarah Williams", date: "2026-06-05", type: "hr", score: 88, status: "pending" },
  { id: "ar4", candidateName: "Raj Patel", date: "2026-06-04", type: "coding", score: 45, status: "flagged" },
  { id: "ar5", candidateName: "Emily Rodriguez", date: "2026-06-04", type: "group-discussion", score: 87, status: "reviewed" },
  { id: "ar6", candidateName: "Alex Kim", date: "2026-06-03", type: "technical", score: 85, status: "pending" },
  { id: "ar7", candidateName: "Maria Garcia", date: "2026-06-03", type: "multi-agent", score: 91, status: "reviewed" },
  { id: "ar8", candidateName: "David Lee", date: "2026-06-02", type: "technical", score: 78, status: "pending" },
];
