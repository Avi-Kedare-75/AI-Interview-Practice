import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash";

let geminiInstance: GoogleGenerativeAI | null = null;

export function hasGeminiApiKey(): boolean {
  return Boolean(GEMINI_API_KEY);
}

function getGeminiClient(): GoogleGenerativeAI {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  if (!geminiInstance) {
    geminiInstance = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return geminiInstance;
}

export function getGeminiModel(modelName = DEFAULT_GEMINI_MODEL): GenerativeModel {
  const client = getGeminiClient();
  return client.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });
}
