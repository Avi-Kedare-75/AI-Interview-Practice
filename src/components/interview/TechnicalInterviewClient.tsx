"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Flag, LogOut, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { AnimatePresence } from "motion/react";

import ChatPanel from "./ChatPanel";
import VoicePanel from "./VoicePanel";
import QuestionArea from "./QuestionArea";
import InterviewTimer from "./InterviewTimer";
import ProgressBar from "./ProgressBar";
import NotesSection from "./NotesSection";
import FeedbackPanel from "./FeedbackPanel";
import { Button } from "@/components/ui/button";
import type { LiveQuestion, LiveAnswerEvaluation, InterviewState, ChatMessage } from "@/types";

interface TechnicalInterviewClientProps {
  sessionId: string;
}

export default function TechnicalInterviewClient({ sessionId }: TechnicalInterviewClientProps) {
  const router = useRouter();

  // State Machine
  const [state, setState] = useState<InterviewState>("idle");
  const [currentQuestion, setCurrentQuestion] = useState<LiveQuestion | null>(null);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<LiveAnswerEvaluation | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [voicePreference, setVoicePreference] = useState<string>("v1");
  const [sessionSettingsReady, setSessionSettingsReady] = useState(false);

  // Time tracking
  const questionStartTimeRef = useRef<number>(0);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const readJsonSafely = useCallback(async (res: Response) => {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    }

    const text = await res.text();
    return {
      error: text || "Unexpected non-JSON response from the server.",
    };
  }, []);

  const speechSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  const loadAvailableVoices = useCallback(async () => {
    if (!speechSupported || typeof window === "undefined") {
      return [];
    }

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    if (voices.length > 0) {
      return voices;
    }

    return new Promise<SpeechSynthesisVoice[]>((resolve) => {
      const timeout = window.setTimeout(() => {
        synth.removeEventListener("voiceschanged", handleVoicesChanged);
        resolve(synth.getVoices());
      }, 1200);

      const handleVoicesChanged = () => {
        window.clearTimeout(timeout);
        synth.removeEventListener("voiceschanged", handleVoicesChanged);
        resolve(synth.getVoices());
      };

      synth.addEventListener("voiceschanged", handleVoicesChanged, { once: true });
    });
  }, [speechSupported]);

  const pickVoiceForPreference = useCallback(
    (voices: SpeechSynthesisVoice[], preference: string) => {
      const preferenceToLang: Record<string, string> = {
        v1: "en-US",
        v2: "en-GB",
        v3: "en-IN",
        v4: "en-AU",
      };

      const preferredLang = preferenceToLang[preference] ?? "en-US";
      const normalizedLang = preferredLang.toLowerCase();
      const langMatches = voices.filter((voice) =>
        voice.lang.toLowerCase().startsWith(normalizedLang)
      );

      const nameHint =
        preference === "v1"
          ? /jenny|samantha|zira|google us english|female/i
          : preference === "v2"
            ? /daniel|google uk english male|male/i
            : preference === "v3"
              ? /en-in|female|neerja/i
              : /en-au|male/i;

      return (
        langMatches.find((voice) => nameHint.test(voice.name)) ??
        langMatches[0] ??
        voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
        voices[0] ??
        null
      );
    },
    []
  );

  const speakText = useCallback(
    async (text: string) => {
      if (!speechSupported || typeof window === "undefined") {
        return;
      }

      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }

      const synth = window.speechSynthesis;
      synth.cancel();
      setIsListening(false);

      try {
        const voices = await loadAvailableVoices();
        const utterance = new SpeechSynthesisUtterance(trimmed);
        const selectedVoice = pickVoiceForPreference(voices, voicePreference);

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        } else {
          utterance.lang = "en-US";
        }

        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.onend = () => {
          speechUtteranceRef.current = null;
        };
        utterance.onerror = (event) => {
          console.error("TTS error:", event.error);
          speechUtteranceRef.current = null;
        };

        speechUtteranceRef.current = utterance;
        synth.speak(utterance);
      } catch (speechError) {
        console.error("Failed to speak text:", speechError);
      }
    },
    [loadAvailableVoices, pickVoiceForPreference, speechSupported, voicePreference]
  );

  useEffect(() => {
    let cancelled = false;

    const loadSessionSettings = async () => {
      try {
        const res = await fetch(`/api/v1/sessions/${sessionId}`);
        const data = await readJsonSafely(res);

        if (!res.ok) {
          if (!cancelled) {
            setSessionSettingsReady(true);
          }
          return;
        }

        const sessionData = data.data as { voicePreference?: string };
        if (!cancelled) {
          setVoicePreference(sessionData.voicePreference || "v1");
          setSessionSettingsReady(true);
        }
      } catch (fetchError) {
        console.warn("Unable to load session voice preference:", fetchError);
        if (!cancelled) {
          setSessionSettingsReady(true);
        }
      }
    };

    void loadSessionSettings();

    return () => {
      cancelled = true;
    };
  }, [readJsonSafely, sessionId]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 3. Complete the whole session
  const completeSession = useCallback(async () => {
    setIsLoadingNext(true);
    try {
      const res = await fetch(`/api/v1/sessions/${sessionId}/complete`, {
        method: "POST",
      });
      const data = await readJsonSafely(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete session");
      }

      router.push(`/report?sessionId=${sessionId}`);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to complete session.");
      setIsLoadingNext(false);
    }
  }, [readJsonSafely, router, sessionId]);

  // Helper to add chat messages
  const addChatMessage = useCallback((sender: "ai" | "user", content: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        sender,
        content,
        timestamp,
      },
    ]);
  }, []);

  // 1. Fetch next question
  const fetchNextQuestion = useCallback(async () => {
    setState("loading_question");
    setError(null);
    try {
      const res = await fetch(`/api/v1/sessions/${sessionId}/question/next`, {
        method: "POST",
      });
      const data = await readJsonSafely(res);

      if (!res.ok) {
        if (data.sessionComplete) {
          // If session is complete, wrap it up
          await completeSession();
          return;
        }
        throw new Error(data.error || "Failed to fetch question");
      }

      const questionData = data.data as LiveQuestion;
      setCurrentQuestion(questionData);
      setDraftAnswer("");
      setEvaluation(null);
      setState("answering");
      questionStartTimeRef.current = Date.now();
      setTimerResetKey((prev) => prev + 1);

      // Add to conversation log
      addChatMessage("ai", questionData.text);
      void speakText(questionData.text);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong loading the question.");
      setState("idle");
    }
  }, [sessionId, addChatMessage, readJsonSafely, completeSession, speakText]);

  // Load first question on mount
  useEffect(() => {
    if (sessionId && sessionSettingsReady) {
      // Initial interview bootstrap is intentional here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchNextQuestion();
    }
  }, [sessionId, sessionSettingsReady, fetchNextQuestion]);

  // 2. Submit candidate answer
  const submitAnswer = useCallback(
    async (finalText?: string) => {
      if (!currentQuestion) return;

      setState("submitting_answer");
      setIsListening(false); // Stop listening if voice is on

      const answerToSubmit = (finalText !== undefined ? finalText : draftAnswer).trim();

      // Record time elapsed
      const timeTaken = Math.round((Date.now() - questionStartTimeRef.current) / 1000);

      // Post candidate answer to chat
      addChatMessage("user", answerToSubmit || "(No response provided)");

      try {
        const res = await fetch(
          `/api/v1/sessions/${sessionId}/question/${currentQuestion.questionId}/answer`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transcript: answerToSubmit,
              timeTaken,
            }),
          }
        );

        const data = await readJsonSafely(res);
        if (!res.ok) {
          throw new Error(data.error || "Failed to evaluate answer");
        }

        const evalResult = data.data as LiveAnswerEvaluation;

        setEvaluation(evalResult);
        setState("showing_feedback");

        // Post feedback highlights to chat
        addChatMessage(
          "ai",
          `Score: ${evalResult.score}/100\n\nFeedback: ${evalResult.feedback}`
        );
        void speakText(`Score: ${evalResult.score} out of 100. ${evalResult.feedback}`);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to evaluate answer.");
        setState("answering");
      }
    },
    [sessionId, currentQuestion, draftAnswer, addChatMessage, readJsonSafely, speakText]
  );

  // Auto-submit on timeout
  const handleTimeout = useCallback(() => {
    if (state === "answering") {
      submitAnswer();
    }
  }, [state, submitAnswer]);

  // Proceed from feedback to next question or completion
  const handleNext = async () => {
    if (!currentQuestion) return;

    if (currentQuestion.questionNumber >= currentQuestion.totalQuestions) {
      await completeSession();
    } else {
      await fetchNextQuestion();
    }
  };

  // Append transcribed speech text to the draft answer
  const handleTranscriptUpdate = (text: string) => {
    setDraftAnswer((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${text}` : text;
    });
  };

  // Render main loading/error state if no question is loaded yet
  if (state === "idle" || (state === "loading_question" && !currentQuestion)) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
        {error ? (
          <div className="text-center space-y-4 max-w-md">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h3 className="text-lg font-semibold">Error Loading Interview</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={fetchNextQuestion} variant="outline">
              Retry
            </Button>
          </div>
        ) : (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Initializing live interview session...</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-130px)] flex-col gap-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between glass-card rounded-xl p-4 shrink-0">
        <div className="flex w-1/3 items-center">
          <ProgressBar
            current={currentQuestion?.questionNumber ?? 1}
            total={currentQuestion?.totalQuestions ?? 10}
          />
        </div>
        <div className="flex w-1/3 justify-center">
          {currentQuestion && (
            <InterviewTimer
              timeLimit={currentQuestion.timeLimit}
              onTimeout={handleTimeout}
              isPaused={state !== "answering"}
              resetKey={timerResetKey}
            />
          )}
        </div>
        <div className="flex w-1/3 justify-end gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Flag className="h-4 w-4" /> Report Issue
          </Button>
          <Link href="/dashboard">
            <Button variant="destructive" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" /> End Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12 min-h-0">
        {/* Left Column: Chat & Voice */}
        <div className="flex flex-col gap-6 lg:col-span-4 min-h-0">
          <div className="flex-1 min-h-0">
            <ChatPanel
              messages={chatMessages}
              interviewerName="AI Interviewer"
              isInteractive={false}
            />
          </div>
          <div className="shrink-0">
            <VoicePanel
              onTranscriptUpdate={handleTranscriptUpdate}
              isListening={isListening}
              onListeningChange={setIsListening}
            />
          </div>
        </div>

        {/* Right Column: Question/Feedback & Notes */}
        <div className="flex flex-col gap-6 lg:col-span-8 min-h-0 overflow-y-auto pr-1">
          <AnimatePresence mode="wait">
            {state === "showing_feedback" && evaluation ? (
              <FeedbackPanel
                score={evaluation.score}
                feedback={evaluation.feedback}
                isAcceptable={evaluation.isAcceptable}
                strengths={evaluation.strengths}
                improvements={evaluation.improvements}
                onNext={handleNext}
                isLastQuestion={
                  (currentQuestion?.questionNumber ?? 10) >= (currentQuestion?.totalQuestions ?? 10)
                }
                isLoadingNext={isLoadingNext}
              />
            ) : (
              <div className="flex flex-col gap-6 flex-1 min-h-0">
                <div className="shrink-0">
                  <QuestionArea
                    question={currentQuestion?.text}
                    difficulty={currentQuestion?.difficulty}
                    topic={currentQuestion?.topic}
                    domain="Technical"
                    isLoading={state === "loading_question"}
                    hints={currentQuestion?.hints}
                  />
                </div>
                <div className="flex-1 min-h-0 flex flex-col gap-4">
                  <NotesSection
                    value={draftAnswer}
                    onChange={setDraftAnswer}
                    title="Your Answer"
                    placeholder="Type your response here, or use the voice panel on the left to transcribe your speech. Feel free to structure your thoughts, write bullet points, or paste pseudocode..."
                  />
                  <div className="flex justify-end shrink-0">
                    <Button
                      onClick={() => submitAnswer()}
                      disabled={state === "submitting_answer" || !draftAnswer.trim()}
                      className="gradient-bg border-0 text-white font-medium hover:opacity-90 transition-opacity gap-2 min-w-[140px]"
                    >
                      {state === "submitting_answer" ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        "Submit Answer"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
