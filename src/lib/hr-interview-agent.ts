/**
 * hr-interview-agent.ts
 * Core AI logic for the HR/Behavioral Interview Agent (Phase 6).
 * All functions are pure (no DB / HTTP) — they call Gemini and return structured data.
 */

import { getGeminiModel } from "@/lib/gemini";
import type { DifficultyLevel } from "@/types";

// ─── HR Question Categories ──────────────────────────────────────────────────

export const HR_CATEGORIES = [
  "Conflict Resolution",
  "Leadership",
  "Teamwork",
  "Adaptability",
  "Communication",
  "Work Ethic",
  "Problem Solving",
  "Culture Fit",
] as const;

export type HRCategory = (typeof HR_CATEGORIES)[number];

// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface GeneratedHRQuestion {
  text: string;
  category: HRCategory;
  difficulty: DifficultyLevel;
  timeLimit: number; // seconds
  starPrompt: string; // STAR method guidance specific to this question
}

export interface HRAnswerEvaluation {
  score: number; // 0–100
  feedback: string; // Detailed, constructive
  isAcceptable: boolean; // score >= 50
  strengths: string[];
  improvements: string[];
  confidenceScore: number; // 0–100 (AI-inferred from answer patterns)
  communicationScore: number; // 0–100
}

export interface HRQuestionHistoryItem {
  questionText: string;
  candidateAnswer?: string;
  score?: number;
  category?: string;
}

export interface HRSessionReportData {
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

// ─── STAR Method Prompts ──────────────────────────────────────────────────────

const STAR_PROMPTS: Record<string, string> = {
  "Conflict Resolution":
    "Situation: Describe the conflict context. Task: What was your role? Action: How did you mediate or resolve it? Result: What was the outcome and what did you learn?",
  Leadership:
    "Situation: Describe the leadership challenge. Task: What were you responsible for? Action: How did you lead the team? Result: What impact did your leadership have?",
  Teamwork:
    "Situation: Describe the team project or collaboration. Task: What was your specific contribution? Action: How did you work with others? Result: What did the team achieve together?",
  Adaptability:
    "Situation: Describe the change or unexpected challenge. Task: What was expected of you? Action: How did you adapt? Result: How did it turn out?",
  Communication:
    "Situation: Describe the communication challenge. Task: What message needed to be conveyed? Action: How did you ensure clarity? Result: Was the communication successful?",
  "Work Ethic":
    "Situation: Describe the demanding situation. Task: What were the expectations? Action: How did you go above and beyond? Result: What was achieved?",
  "Problem Solving":
    "Situation: Describe the complex problem. Task: What needed to be solved? Action: What approach did you take? Result: What was the solution and its impact?",
  "Culture Fit":
    "Situation: Describe the workplace values scenario. Task: What cultural challenge arose? Action: How did you navigate it? Result: How did it reinforce your fit?",
};

function getStarPromptForCategory(category: string): string {
  return (
    STAR_PROMPTS[category] ||
    "Situation: Set the scene. Task: Explain your role. Action: Describe what you did. Result: Share the outcome."
  );
}

// ─── Fallback Builders ────────────────────────────────────────────────────────

function getNextCategory(usedCategories: string[]): HRCategory {
  const available = HR_CATEGORIES.filter((c) => !usedCategories.includes(c));
  return available.length > 0 ? available[0] : HR_CATEGORIES[0];
}

function buildFallbackHRQuestion(
  difficulty: DifficultyLevel,
  usedCategories: string[],
  resumeText?: string,
  isFirst = true
): GeneratedHRQuestion {
  const category = getNextCategory(usedCategories);
  const intro = isFirst
    ? "Thank you for joining us today. I'd like to get to know you better through some behavioral questions."
    : "Great, let's move on to the next area.";
  const resumeHint = resumeText
    ? " Drawing from your professional background,"
    : "";

  const questionBank: Record<string, string> = {
    "Conflict Resolution":
      "Tell me about a time when you had a significant disagreement with a colleague about a project direction. How did you handle it, and what was the outcome?",
    Leadership:
      "Describe a situation where you had to lead a team through a challenging project or period. What approach did you take?",
    Teamwork:
      "Give me an example of a time when you had to work closely with someone whose personality or working style was very different from yours.",
    Adaptability:
      "Tell me about a time when you had to quickly adapt to a significant change at work. How did you handle the transition?",
    Communication:
      "Describe a situation where you had to explain a complex concept to someone who had no background in the subject.",
    "Work Ethic":
      "Tell me about a time when you went above and beyond what was expected of you at work.",
    "Problem Solving":
      "Describe a situation where you faced a problem that had no obvious solution. How did you approach it?",
    "Culture Fit":
      "What kind of work environment do you thrive in, and can you give an example from a past role that illustrates this?",
  };

  const baseQuestion =
    questionBank[category] || questionBank["Conflict Resolution"];

  return {
    text: `${intro}${resumeHint} ${baseQuestion}`,
    category,
    difficulty,
    timeLimit: difficulty === "expert" ? 180 : difficulty === "advanced" ? 150 : 120,
    starPrompt: getStarPromptForCategory(category),
  };
}

function buildFallbackHREvaluation(
  candidateAnswer: string,
  difficulty: DifficultyLevel
): HRAnswerEvaluation {
  const words = candidateAnswer.trim().split(/\s+/).filter(Boolean).length;
  const hasStarStructure =
    /situation|task|action|result|because|for example|first|then|finally/i.test(
      candidateAnswer
    );
  const hasEmotionalIntelligence =
    /feel|understood|empathy|perspective|appreciate|collaborate/i.test(
      candidateAnswer
    );

  const baseScore =
    words === 0
      ? 0
      : Math.min(
          85,
          20 +
            Math.min(words * 1.5, 35) +
            (hasStarStructure ? 15 : 0) +
            (hasEmotionalIntelligence ? 10 : 0)
        );

  const difficultyBonus =
    difficulty === "expert"
      ? -5
      : difficulty === "advanced"
        ? 0
        : difficulty === "intermediate"
          ? 5
          : 10;
  const score = Math.max(0, Math.min(100, Math.round(baseScore + difficultyBonus)));

  const confidenceScore = Math.max(
    30,
    Math.min(95, score + (words > 50 ? 10 : -5))
  );
  const communicationScore = Math.max(
    25,
    Math.min(95, score + (hasStarStructure ? 8 : -8))
  );

  return {
    score,
    feedback:
      score === 0
        ? "No answer was provided, so I could not evaluate the response."
        : `Your answer shows a ${score >= 70 ? "strong" : "developing"} grasp of the behavioral competency. ${hasStarStructure ? "Good use of structured storytelling." : "Try using the STAR method to structure your response more clearly."}`,
    isAcceptable: score >= 50,
    strengths:
      score >= 50
        ? [
            "Addressed the behavioral scenario",
            "Showed relevant interpersonal awareness",
          ]
        : ["Attempted to respond"],
    improvements:
      score >= 50
        ? [
            "Add more specific examples with measurable outcomes",
            "Structure using the STAR method more explicitly",
          ]
        : [
            "Provide a detailed, specific example from experience",
            "Use the STAR method: Situation, Task, Action, Result",
          ],
    confidenceScore,
    communicationScore,
  };
}

function buildFallbackHRReport(
  domain: string,
  questions: HRQuestionHistoryItem[],
  overallScore: number
): HRSessionReportData {
  const categories = questions
    .map((q) => q.category)
    .filter(Boolean) as string[];
  const uniqueCategories = [...new Set(categories)];
  const topCategory =
    uniqueCategories[0] || "Behavioral Skills";

  const letterGrade =
    overallScore >= 90
      ? "A+"
      : overallScore >= 85
        ? "A"
        : overallScore >= 80
          ? "A-"
          : overallScore >= 75
            ? "B+"
            : overallScore >= 70
              ? "B"
              : overallScore >= 65
                ? "B-"
                : overallScore >= 60
                  ? "C+"
                  : overallScore >= 55
                    ? "C"
                    : overallScore >= 50
                      ? "C-"
                      : "F";

  return {
    overallScore,
    letterGrade,
    scores: {
      technical: Math.max(35, overallScore - 15),
      communication: Math.max(40, overallScore + 5),
      problemSolving: Math.max(35, overallScore - 5),
      hr: overallScore,
      leadership: Math.max(40, overallScore - 8),
      teamwork: Math.max(40, overallScore - 3),
    },
    strengths: [
      topCategory,
      "Demonstrated willingness to reflect on past experiences",
    ],
    weaknesses: [
      "Could provide more structured responses using the STAR method",
    ],
    roadmap: [
      {
        title: "Practice STAR Method Responses",
        description:
          "Record yourself answering behavioral questions using the STAR method. Review for clarity and conciseness.",
        week: 1,
        category: "Communication",
        completed: false,
      },
      {
        title: `Deep Dive: ${topCategory}`,
        description: `Prepare 3–5 detailed stories that showcase your ${topCategory.toLowerCase()} abilities.`,
        week: 2,
        category: "Behavioral",
        completed: false,
      },
      {
        title: "Emotional Intelligence Workshop",
        description:
          "Study active listening techniques and practice demonstrating empathy in your responses.",
        week: 3,
        category: "Soft Skills",
        completed: false,
      },
      {
        title: "Mock Behavioral Interviews",
        description:
          "Conduct 2 mock behavioral interviews with a peer or mentor, focusing on confidence and storytelling.",
        week: 4,
        category: "Practice",
        completed: false,
      },
      {
        title: "Self-Assessment Journal",
        description:
          "Write reflections on 5 key career moments that demonstrate leadership, teamwork, and adaptability.",
        week: 5,
        category: "Reflection",
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
      console.warn(`[Gemini HR] Request failed for model "${modelName}":`, getErrorMessage(error));
    }
  }

  return null;
}

// ─── Generate First HR Question ───────────────────────────────────────────────

export async function generateFirstHRQuestion(
  domain: string,
  difficultyValue: number,
  resumeText?: string
): Promise<GeneratedHRQuestion> {
  const difficulty = getDifficultyLabel(difficultyValue);
  if (!process.env.GEMINI_API_KEY) {
    return buildFallbackHRQuestion(difficulty, [], resumeText, true);
  }

  const resumeContext = resumeText
    ? `\nCandidate Resume Snippet (use to personalize the question):\n"""\n${resumeText.slice(0, 800)}\n"""`
    : "";

  const category = HR_CATEGORIES[0]; // Start with Conflict Resolution

  const prompt = `You are an experienced HR interviewer conducting a behavioral interview for a ${domain} role.
Generate the FIRST behavioral interview question.
Difficulty Level: ${difficulty}
Domain: ${domain}
Category: ${category}${resumeContext}

Rules:
- The question must be a behavioral/situational question about ${category}
- Match the difficulty: ${difficulty}
- For "beginner": straightforward scenarios, common workplace situations
- For "intermediate": more nuanced situations requiring reflection
- For "advanced": complex interpersonal dynamics, high-stakes scenarios
- For "expert": strategic leadership challenges, cross-functional conflict
- Start with a warm, professional greeting to make the candidate comfortable
- The question should be open-ended and invite storytelling
- Encourage the candidate to use a real example from their experience

Respond ONLY with valid JSON matching this exact schema:
{
  "text": "Full question text including a brief warm intro (2-3 sentences max)",
  "category": "${category}",
  "difficulty": "${difficulty}",
  "timeLimit": ${difficulty === "expert" ? 180 : difficulty === "advanced" ? 150 : 120},
  "starPrompt": "Tailored STAR method guidance for this specific question (1-2 sentences)"
}`;

  const generated = await callGemini<GeneratedHRQuestion>(prompt);
  if (generated) {
    return {
      ...generated,
      starPrompt: generated.starPrompt || getStarPromptForCategory(category),
    };
  }

  return buildFallbackHRQuestion(difficulty, [], resumeText, true);
}

// ─── Generate Next HR Question (Adaptive) ────────────────────────────────────

export async function generateNextHRQuestion(
  domain: string,
  baseDifficultyValue: number,
  history: HRQuestionHistoryItem[],
  runningScore: number
): Promise<GeneratedHRQuestion> {
  const adaptedDifficulty = getDifficultyFromScore(runningScore);
  const usedCategories = history
    .map((h) => h.category || "")
    .filter(Boolean);

  if (!process.env.GEMINI_API_KEY) {
    return buildFallbackHRQuestion(adaptedDifficulty, usedCategories, undefined, false);
  }

  const nextCategory = getNextCategory(usedCategories);

  const historyContext = history
    .slice(-3)
    .map(
      (h, i) =>
        `Q${i + 1} [${h.category}]: ${h.questionText}\nAnswer: ${h.candidateAnswer?.slice(0, 200) || "(no answer)"}\nScore: ${h.score ?? "N/A"}/100`
    )
    .join("\n\n");

  const prompt = `You are an experienced HR interviewer conducting a behavioral interview for a ${domain} role.
Generate the NEXT adaptive behavioral question.

Candidate's Running Score: ${runningScore}/100
Adapted Difficulty: ${adaptedDifficulty}
Domain: ${domain}
Category for this question: ${nextCategory}
Categories Already Covered: ${usedCategories.join(", ") || "none yet"}

Recent Interview Context:
${historyContext}

Rules:
- This question MUST be about ${nextCategory}
- DO NOT repeat any previously covered category topic
- Adapt to the candidate's performance: score ${runningScore} means use "${adaptedDifficulty}" difficulty
- If score > 75: ask deeper, more challenging behavioral scenarios
- If score < 40: simplify, ask about more common workplace situations
- No greetings needed since the interview is already in progress
- The question should invite the candidate to share a specific experience
- Focus on behavioral competencies, not technical knowledge

Respond ONLY with valid JSON matching this exact schema:
{
  "text": "Full question text (no greeting needed)",
  "category": "${nextCategory}",
  "difficulty": "${adaptedDifficulty}",
  "timeLimit": ${adaptedDifficulty === "expert" ? 180 : adaptedDifficulty === "advanced" ? 150 : 120},
  "starPrompt": "Tailored STAR method guidance for this specific question (1-2 sentences)"
}`;

  const generated = await callGemini<GeneratedHRQuestion>(prompt);
  if (generated) {
    return {
      ...generated,
      starPrompt: generated.starPrompt || getStarPromptForCategory(nextCategory),
    };
  }

  return buildFallbackHRQuestion(adaptedDifficulty, usedCategories, undefined, false);
}

// ─── Evaluate HR Answer ──────────────────────────────────────────────────────

export async function evaluateHRAnswer(
  questionText: string,
  candidateAnswer: string,
  category: string,
  difficulty: DifficultyLevel
): Promise<HRAnswerEvaluation> {
  const hasAnswer = candidateAnswer.trim().length > 10;

  if (!hasAnswer) {
    return {
      score: 0,
      feedback: "No answer was provided for this question.",
      isAcceptable: false,
      strengths: [],
      improvements: [
        "Provide a detailed answer with a real example",
        "Use the STAR method to structure your response",
      ],
      confidenceScore: 0,
      communicationScore: 0,
    };
  }

  if (!process.env.GEMINI_API_KEY) {
    return buildFallbackHREvaluation(candidateAnswer, difficulty);
  }

  const prompt = `You are an expert HR interviewer evaluating a candidate's behavioral answer.

Category: ${category}
Question (${difficulty} level):
"${questionText}"

Candidate's Answer:
"${candidateAnswer}"

Evaluate this answer as an HR professional. Consider:
1. STAR Method adherence — Did they describe a clear Situation, Task, Action, and Result?
2. Emotional intelligence — Do they show empathy, self-awareness, and interpersonal skills?
3. Communication clarity — Is the answer well-structured, concise, and articulate?
4. Confidence — Does the tone suggest self-assurance and conviction?
5. Authenticity — Does the example feel genuine and specific (not generic)?
6. Relevance — Does the answer directly address the ${category} competency?

Scoring guide for ${difficulty} level:
- 90-100: Exceptional — vivid STAR story, strong EQ, compelling narrative
- 75-89: Good — solid example with minor structural gaps
- 50-74: Acceptable — understood the question but answer lacks depth
- 25-49: Weak — generic or vague, missing key STAR elements
- 0-24: Insufficient — off-topic or nearly empty

Respond ONLY with valid JSON matching this exact schema:
{
  "score": <integer 0-100>,
  "feedback": "<2-3 sentences of constructive, specific HR feedback>",
  "isAcceptable": <boolean, true if score >= 50>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "confidenceScore": <integer 0-100, inferred from answer tone and assertiveness>,
  "communicationScore": <integer 0-100, based on clarity, structure, and articulation>
}`;

  const evaluation = await callGemini<HRAnswerEvaluation>(prompt);
  if (evaluation) {
    return evaluation;
  }

  return buildFallbackHREvaluation(candidateAnswer, difficulty);
}

// ─── Generate HR Session Report ──────────────────────────────────────────────

export async function generateHRSessionReport(
  domain: string,
  questions: HRQuestionHistoryItem[],
  overallScore: number
): Promise<HRSessionReportData> {
  if (!process.env.GEMINI_API_KEY) {
    return buildFallbackHRReport(domain, questions, overallScore);
  }

  const questionSummary = questions
    .map(
      (q, i) =>
        `Q${i + 1} [${q.category}] Score: ${q.score ?? 0}/100\nQ: ${q.questionText}\nA: ${q.candidateAnswer?.slice(0, 300) || "(no answer)"}`
    )
    .join("\n\n");

  const letterGrade =
    overallScore >= 90
      ? "A+"
      : overallScore >= 85
        ? "A"
        : overallScore >= 80
          ? "A-"
          : overallScore >= 75
            ? "B+"
            : overallScore >= 70
              ? "B"
              : overallScore >= 65
                ? "B-"
                : overallScore >= 60
                  ? "C+"
                  : overallScore >= 55
                    ? "C"
                    : overallScore >= 50
                      ? "C-"
                      : "F";

  const prompt = `You are a senior HR manager writing a final behavioral evaluation report for a ${domain} role candidate.

Domain: ${domain}
Overall Score: ${overallScore}/100
Letter Grade: ${letterGrade}

Behavioral Interview Q&A Summary:
${questionSummary}

Write a comprehensive, actionable HR evaluation report. Focus on behavioral competencies, communication skills, emotional intelligence, and cultural fit. Be specific to their actual answers.

Respond ONLY with valid JSON matching this exact schema:
{
  "overallScore": ${overallScore},
  "letterGrade": "${letterGrade}",
  "scores": {
    "technical": <integer 0-100, inferred technical aptitude from behavioral answers>,
    "communication": <integer 0-100, primary HR metric based on clarity and articulation>,
    "problemSolving": <integer 0-100, based on approach and reasoning in scenarios>,
    "hr": <integer 0-100, overall behavioral competency score>,
    "leadership": <integer 0-100, based on leadership-related answers>,
    "teamwork": <integer 0-100, based on collaboration-related answers>
  },
  "strengths": ["specific behavioral strength 1", "specific strength 2", "specific strength 3"],
  "weaknesses": ["specific behavioral gap 1", "specific gap 2", "specific gap 3"],
  "roadmap": [
    { "title": "Action Item Title", "description": "Specific learning action for behavioral improvement", "week": 1, "category": "Communication", "completed": false },
    { "title": "Action Item Title", "description": "Specific learning action", "week": 2, "category": "Behavioral", "completed": false },
    { "title": "Action Item Title", "description": "Specific learning action", "week": 3, "category": "Soft Skills", "completed": false },
    { "title": "Action Item Title", "description": "Specific learning action", "week": 4, "category": "Practice", "completed": false },
    { "title": "Action Item Title", "description": "Specific learning action", "week": 5, "category": "Reflection", "completed": false }
  ]
}`;

  const report = await callGemini<HRSessionReportData>(prompt);
  if (report) {
    return report;
  }

  return buildFallbackHRReport(domain, questions, overallScore);
}
