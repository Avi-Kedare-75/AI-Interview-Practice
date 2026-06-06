/**
 * interview-agent.ts
 * Core AI logic for the Technical Interview Agent (Phase 5).
 * All functions are pure (no DB / HTTP) — they call Gemini and return structured data.
 */

import { getGeminiModel } from "@/lib/gemini";
import type { DifficultyLevel } from "@/types";

// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface GeneratedQuestion {
  text: string;
  topic: string;
  difficulty: DifficultyLevel;
  timeLimit: number; // seconds
  hints?: string[];
}

export interface AnswerEvaluation {
  score: number;       // 0–100
  feedback: string;    // Detailed, constructive
  isAcceptable: boolean; // score >= 50
  strengths: string[];
  improvements: string[];
}

export interface QuestionHistoryItem {
  questionText: string;
  candidateAnswer?: string;
  score?: number;
  topic?: string;
}

export interface SessionReportData {
  overallScore: number;
  letterGrade: string;
  scores: {
    technical: number;
    communication: number;
    problemSolving: number;
    hr: number;
    leadership: number;
    teamwork: number;
  };
  strengths: string[];
  weaknesses: string[];
  roadmap: Array<{
    title: string;
    description: string;
    week: number;
    category: string;
    completed: boolean;
  }>;
}

// ─── Difficulty Mapping ────────────────────────────────────────────────────────

function getDifficultyFromScore(score: number): DifficultyLevel {
  if (score >= 80) return "expert";
  if (score >= 60) return "advanced";
  if (score >= 40) return "intermediate";
  return "beginner";
}

function getDifficultyLabel(difficultyValue: number): DifficultyLevel {
  if (difficultyValue <= 25) return "beginner";
  if (difficultyValue <= 50) return "intermediate";
  if (difficultyValue <= 75) return "advanced";
  return "expert";
}

function buildFallbackTopic(domain: string, existingTopics: string[]): string {
  const topicBank: Record<string, string[]> = {
    frontend: ["React Hooks", "State Management", "Rendering Performance", "Accessibility"],
    backend: ["API Design", "Database Modeling", "Caching", "Error Handling"],
    fullstack: ["System Design", "API Integration", "Authentication", "Scalability"],
    devops: ["CI/CD", "Containerization", "Observability", "Cloud Deployment"],
    data: ["ETL Pipelines", "Query Optimization", "Data Modeling", "Batch Processing"],
    default: ["Problem Solving", "System Design", "Debugging", "Scalability"],
  };

  const normalized = domain.toLowerCase();
  const options = topicBank[normalized] ?? topicBank.default;
  return options.find((topic) => !existingTopics.includes(topic)) ?? options[0];
}

function buildFallbackQuestion(
  domain: string,
  difficulty: DifficultyLevel,
  usedTopics: string[],
  resumeText?: string,
  isFirst = true
): GeneratedQuestion {
  const topic = buildFallbackTopic(domain, usedTopics);
  const intro = isFirst
    ? "Thanks for sharing your time today."
    : "Let's build on the last answer and go a bit deeper.";
  const resumeHint = resumeText
    ? ` Based on your resume, I’d also like to hear how you approached ${topic.toLowerCase()}.`
    : "";

  return {
    text: `${intro} Can you walk me through how you would approach ${topic.toLowerCase()} in a ${domain} interview?${resumeHint}`,
    topic,
    difficulty,
    timeLimit: difficulty === "expert" ? 150 : difficulty === "advanced" ? 135 : 120,
    hints: [
      `Start with the core idea behind ${topic}.`,
      "Then explain trade-offs, edge cases, and how you would apply it in practice.",
    ],
  };
}

function buildFallbackEvaluation(
  questionText: string,
  candidateAnswer: string,
  difficulty: DifficultyLevel
): AnswerEvaluation {
  const words = candidateAnswer.trim().split(/\s+/).filter(Boolean).length;
  const hasStructure = /because|however|for example|first|second|finally/i.test(candidateAnswer);
  const baseScore = words === 0 ? 0 : Math.min(85, 20 + Math.min(words * 2, 45) + (hasStructure ? 10 : 0));
  const difficultyBonus =
    difficulty === "expert" ? -5 : difficulty === "advanced" ? 0 : difficulty === "intermediate" ? 5 : 10;
  const score = Math.max(0, Math.min(100, Math.round(baseScore + difficultyBonus)));

  return {
    score,
    feedback:
      score === 0
        ? "No answer was provided, so I could not evaluate the response."
        : `Your answer shows a ${score >= 70 ? "solid" : "basic"} understanding of the topic. To improve, connect your explanation more directly to ${questionText.toLowerCase()}.`,
    isAcceptable: score >= 50,
    strengths:
      score >= 50
        ? ["Addressed the question", "Showed some relevant technical knowledge"]
        : ["Attempted to respond"],
    improvements:
      score >= 50
        ? ["Add more concrete examples", "Discuss trade-offs and edge cases"]
        : ["Give a more detailed explanation", "Structure the answer in clear steps"],
  };
}

function buildFallbackReport(
  domain: string,
  questions: QuestionHistoryItem[],
  overallScore: number
): SessionReportData {
  const topicSet = new Set(questions.map((q) => q.topic).filter(Boolean) as string[]);
  const mainTopic = buildFallbackTopic(domain, Array.from(topicSet));
  const letterGrade =
    overallScore >= 90 ? "A+" :
    overallScore >= 85 ? "A" :
    overallScore >= 80 ? "A-" :
    overallScore >= 75 ? "B+" :
    overallScore >= 70 ? "B" :
    overallScore >= 65 ? "B-" :
    overallScore >= 60 ? "C+" :
    overallScore >= 55 ? "C" :
    overallScore >= 50 ? "C-" : "F";

  return {
    overallScore,
    letterGrade,
    scores: {
      technical: overallScore,
      communication: Math.max(40, overallScore - 5),
      problemSolving: Math.max(35, overallScore - 10),
      hr: Math.max(45, overallScore - 8),
      leadership: Math.max(40, overallScore - 12),
      teamwork: Math.max(40, overallScore - 8),
    },
    strengths: [mainTopic, "Clear attempt to reason through technical problems"],
    weaknesses: ["Could include more depth and concrete examples"],
    roadmap: [
      {
        title: `Review ${mainTopic}`,
        description: `Revisit the core concepts behind ${mainTopic} and practice explaining them aloud.`,
        week: 1,
        category: "Technical",
        completed: false,
      },
      {
        title: "Practice structured answers",
        description: "Use a simple problem-explanation-tradeoff format in mock interviews.",
        week: 2,
        category: "Practice",
        completed: false,
      },
      {
        title: "Build a small project",
        description: `Apply ${mainTopic} in a small hands-on project to make the concept stick.`,
        week: 3,
        category: "Projects",
        completed: false,
      },
      {
        title: "Handle edge cases",
        description: "Practice talking through failure modes, scaling, and implementation details.",
        week: 4,
        category: "Technical",
        completed: false,
      },
      {
        title: "Run one mock interview",
        description: "Simulate a full interview round and focus on clarity under time pressure.",
        week: 5,
        category: "Practice",
        completed: false,
      },
    ],
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown Gemini error";
}

// ─── Parse Gemini JSON Safely ─────────────────────────────────────────────────

async function callGemini<T>(prompt: string): Promise<T | null> {
  const preferredModel = process.env.GEMINI_MODEL?.trim();
  const modelCandidates = Array.from(
    new Set(
      [preferredModel, "gemini-3.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"].filter(
        Boolean
      ) as string[]
    )
  );

  for (const modelName of modelCandidates) {
    try {
      const model = getGeminiModel(modelName);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const firstJson = cleaned.match(/\{[\s\S]*\}/)?.[0] ?? cleaned;
      return JSON.parse(firstJson) as T;
    } catch (error) {
      console.warn(`[Gemini] Request failed for model "${modelName}":`, getErrorMessage(error));
    }
  }

  return null;
}

// ─── Generate First Question ──────────────────────────────────────────────────

export async function generateFirstQuestion(
  domain: string,
  difficultyValue: number,
  resumeText?: string
): Promise<GeneratedQuestion> {
  const difficulty = getDifficultyLabel(difficultyValue);
  if (!process.env.GEMINI_API_KEY) {
    return buildFallbackQuestion(domain, difficulty, [], resumeText, true);
  }
  const resumeContext = resumeText
    ? `\nCandidate Resume Snippet (use to personalize):\n"""\n${resumeText.slice(0, 800)}\n"""`
    : "";

  const prompt = `You are an expert technical interviewer conducting a ${domain} interview.
Generate the FIRST interview question for a candidate.
Difficulty Level: ${difficulty}
Domain: ${domain}${resumeContext}

Rules:
- The question must be specific to ${domain}
- Match the difficulty: ${difficulty}
- For "beginner": fundamentals, definitions, simple concepts
- For "intermediate": practical application, trade-offs, moderate complexity  
- For "advanced": deep architecture, system design considerations, complex scenarios
- For "expert": cutting-edge, edge cases, large-scale systems thinking
- Start with a welcoming opening that makes the candidate feel comfortable
- The question should be open-ended and technical

Respond ONLY with valid JSON matching this exact schema:
{
  "text": "Full question text including a brief warm intro (2-3 sentences max)",
  "topic": "Specific sub-topic (e.g., 'React Hooks', 'Database Indexing')",
  "difficulty": "${difficulty}",
  "timeLimit": 120,
  "hints": ["optional hint 1", "optional hint 2"]
}`;

  const generated = await callGemini<GeneratedQuestion>(prompt);
  if (generated) {
    return generated;
  }

  return buildFallbackQuestion(domain, difficulty, [], resumeText, true);
}

// ─── Generate Next Question (Adaptive) ───────────────────────────────────────

export async function generateNextQuestion(
  domain: string,
  baseDifficultyValue: number,
  history: QuestionHistoryItem[],
  runningScore: number
): Promise<GeneratedQuestion> {
  // Adapt difficulty based on running score
  const adaptedDifficulty = getDifficultyFromScore(runningScore);
  if (!process.env.GEMINI_API_KEY) {
    return buildFallbackQuestion(domain, adaptedDifficulty, history.map((h) => h.topic || "").filter(Boolean), undefined, false);
  }

  const coveredTopics = history.map((h) => h.topic || "").filter(Boolean);
  const historyContext = history
    .slice(-3) // Last 3 questions for context
    .map(
      (h, i) =>
        `Q${i + 1}: ${h.questionText}\nAnswer: ${h.candidateAnswer?.slice(0, 200) || "(no answer)"}\nScore: ${h.score ?? "N/A"}/100`
    )
    .join("\n\n");

  const prompt = `You are an expert technical interviewer for a ${domain} role.
Generate the NEXT adaptive interview question.

Candidate's Running Score: ${runningScore}/100
Adapted Difficulty: ${adaptedDifficulty}
Domain: ${domain}
Topics Already Covered: ${coveredTopics.join(", ") || "none yet"}

Recent Interview Context:
${historyContext}

Rules:
- DO NOT repeat any previously covered topic
- Adapt to the candidate's performance: score ${runningScore} means use "${adaptedDifficulty}" difficulty
- If score > 75: increase challenge, ask deeper follow-up concepts
- If score < 40: simplify slightly, explore adjacent fundamentals
- Each question should explore a DIFFERENT aspect of ${domain}
- No greetings/intros needed since the interview is already in progress

Respond ONLY with valid JSON matching this exact schema:
{
  "text": "Full question text (no greeting needed)",
  "topic": "Specific sub-topic different from: ${coveredTopics.join(", ")}",
  "difficulty": "${adaptedDifficulty}",
  "timeLimit": 120,
  "hints": ["optional hint 1"]
}`;

  const generated = await callGemini<GeneratedQuestion>(prompt);
  if (generated) {
    return generated;
  }

  return buildFallbackQuestion(
    domain,
    adaptedDifficulty,
    history.map((h) => h.topic || "").filter(Boolean),
    undefined,
    false
  );
}

// ─── Evaluate Answer ─────────────────────────────────────────────────────────

export async function evaluateAnswer(
  questionText: string,
  candidateAnswer: string,
  domain: string,
  difficulty: DifficultyLevel
): Promise<AnswerEvaluation> {
  const hasAnswer = candidateAnswer.trim().length > 10;

  if (!hasAnswer) {
    return {
      score: 0,
      feedback: "No answer was provided for this question.",
      isAcceptable: false,
      strengths: [],
      improvements: ["Provide a detailed answer", "Think aloud as you work through the problem"],
    };
  }

  if (!process.env.GEMINI_API_KEY) {
    return buildFallbackEvaluation(questionText, candidateAnswer, difficulty);
  }

  const prompt = `You are an expert technical interviewer evaluating a candidate's answer for a ${domain} role.

Question (${difficulty} level):
"${questionText}"

Candidate's Answer:
"${candidateAnswer}"

Evaluate this answer honestly and constructively. Consider:
1. Technical accuracy and correctness
2. Depth of understanding
3. Communication clarity
4. Practical knowledge
5. Completeness relative to ${difficulty} level expectations

Scoring guide for ${difficulty} level:
- 90-100: Exceptional — covers all aspects, shows deep expertise
- 75-89: Good — solid answer with minor gaps
- 50-74: Acceptable — understands basics but missing key points
- 25-49: Weak — significant gaps or errors
- 0-24: Insufficient — incorrect or nearly empty

Respond ONLY with valid JSON matching this exact schema:
{
  "score": <integer 0-100>,
  "feedback": "<2-3 sentences of constructive, specific feedback mentioning what was good and what was missing>",
  "isAcceptable": <boolean, true if score >= 50>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"]
}`;

  const evaluation = await callGemini<AnswerEvaluation>(prompt);
  if (evaluation) {
    return evaluation;
  }

  return buildFallbackEvaluation(questionText, candidateAnswer, difficulty);
}

// ─── Generate Session Report ─────────────────────────────────────────────────

export async function generateSessionReport(
  domain: string,
  questions: QuestionHistoryItem[],
  overallScore: number
): Promise<SessionReportData> {
  if (!process.env.GEMINI_API_KEY) {
    return buildFallbackReport(domain, questions, overallScore);
  }
  const questionSummary = questions
    .map(
      (q, i) =>
        `Q${i + 1} [${q.topic}] Score: ${q.score ?? 0}/100\nQ: ${q.questionText}\nA: ${q.candidateAnswer?.slice(0, 300) || "(no answer)"}`
    )
    .join("\n\n");

  const letterGrade =
    overallScore >= 90 ? "A+" :
    overallScore >= 85 ? "A" :
    overallScore >= 80 ? "A-" :
    overallScore >= 75 ? "B+" :
    overallScore >= 70 ? "B" :
    overallScore >= 65 ? "B-" :
    overallScore >= 60 ? "C+" :
    overallScore >= 55 ? "C" :
    overallScore >= 50 ? "C-" : "F";

  const prompt = `You are a senior ${domain} hiring manager writing a final evaluation report for a technical interview candidate.

Domain: ${domain}
Overall Score: ${overallScore}/100
Letter Grade: ${letterGrade}

Interview Q&A Summary:
${questionSummary}

Write a comprehensive, actionable report. Be specific to their actual answers.

Respond ONLY with valid JSON matching this exact schema:
{
  "overallScore": ${overallScore},
  "letterGrade": "${letterGrade}",
  "scores": {
    "technical": <integer 0-100, based on technical accuracy across answers>,
    "communication": <integer 0-100, based on clarity of explanations>,
    "problemSolving": <integer 0-100, based on approach and reasoning>,
    "hr": <integer 0-100, infer from professional communication style>,
    "leadership": <integer 0-100, infer from answer confidence and initiative>,
    "teamwork": <integer 0-100, infer from mentions of collaboration>
  },
  "strengths": ["specific strength 1 based on actual answers", "specific strength 2", "specific strength 3"],
  "weaknesses": ["specific gap 1 with topic name", "specific gap 2", "specific gap 3"],
  "roadmap": [
    { "title": "Action Item Title", "description": "Specific learning action", "week": 1, "category": "Technical", "completed": false },
    { "title": "Action Item Title", "description": "Specific learning action", "week": 2, "category": "Practice", "completed": false },
    { "title": "Action Item Title", "description": "Specific learning action", "week": 3, "category": "Projects", "completed": false },
    { "title": "Action Item Title", "description": "Specific learning action", "week": 4, "category": "Technical", "completed": false },
    { "title": "Action Item Title", "description": "Specific learning action", "week": 5, "category": "Practice", "completed": false }
  ]
}`;

  const report = await callGemini<SessionReportData>(prompt);
  if (report) {
    return report;
  }

  return buildFallbackReport(domain, questions, overallScore);
}
