"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Users, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import DiscussionArena, { Participant } from "./DiscussionArena";
import ParticipationMeter from "./ParticipationMeter";
import ChatPanel from "@/components/interview/ChatPanel";
import VoicePanel from "@/components/interview/VoicePanel";
import type { ChatMessage } from "@/types";

interface GDClientProps {
  sessionId: string;
}

const INITIAL_TIME_LEFT = 15 * 60;

export default function GDClient({ sessionId }: GDClientProps) {
  const router = useRouter();

  const [topic, setTopic] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "user", name: "You", isAI: false, isSpeaking: false, contributions: 0, participationScore: 0 }
  ]);
  const [speakingAgentId, setSpeakingAgentId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [chatInputValue, setChatInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_LEFT);

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

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

  const pickVoiceForSpeaker = useCallback((voices: SpeechSynthesisVoice[], agentName: string) => {
    const preferFemale = /sarah|lisa/i.test(agentName);
    const preferMale = /mike|david|alex/i.test(agentName);

    const matchedVoice =
      (preferFemale && voices.find((voice) => /female|jenny|samantha|zira/i.test(voice.name))) ||
      (preferMale && voices.find((voice) => /male|daniel|guy/i.test(voice.name))) ||
      null;

    return (
      matchedVoice ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ||
      voices[0] ||
      null
    );
  }, []);

  const speakText = useCallback(
    async (text: string, agentName: string) => {
      if (!speechSupported || typeof window === "undefined") {
        setSpeakingAgentId(null);
        return;
      }

      const trimmed = text.trim();
      if (!trimmed) {
        setSpeakingAgentId(null);
        return;
      }

      const synth = window.speechSynthesis;
      synth.cancel();
      synth.resume();

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 50);
      });

      try {
        const voices = await loadAvailableVoices();
        const utterance = new SpeechSynthesisUtterance(trimmed);
        const selectedVoice = pickVoiceForSpeaker(voices, agentName);

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        } else {
          utterance.lang = "en-US";
        }

        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        let resolved = false;
        const safeResolve = () => {
          if (resolved) {
            return;
          }

          resolved = true;
          setSpeakingAgentId(null);
          speechUtteranceRef.current = null;
        };

        utterance.onend = safeResolve;
        utterance.onerror = safeResolve;

        speechUtteranceRef.current = utterance;
        synth.resume();
        synth.speak(utterance);

        window.setTimeout(safeResolve, Math.max(trimmed.length * 60, 3000));
      } catch (speechError) {
        console.error("Failed to speak text:", speechError);
        setSpeakingAgentId(null);
      }
    },
    [loadAvailableVoices, pickVoiceForSpeaker, speechSupported]
  );

  const displayedParticipants = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalWords = 0;

    messages.forEach((message) => {
      const words = message.content.trim().split(/\s+/).filter(Boolean).length;
      totalWords += words;

      const speakerName = message.agentName || (message.sender === "user" ? "You" : "AI");
      const participant =
        participants.find((item) => item.name === speakerName) ||
        participants.find((item) => item.id === "user");

      if (!participant || (speakerName !== "You" && speakerName !== participant.name)) {
        return;
      }

      counts[participant.id] = (counts[participant.id] || 0) + words;
    });

    return participants.map((participant) => ({
      ...participant,
      contributions: counts[participant.id] || 0,
      participationScore:
        totalWords > 0 ? Math.round(((counts[participant.id] || 0) / totalWords) * 100) : 0,
      isSpeaking: participant.id === speakingAgentId,
    }));
  }, [messages, participants, speakingAgentId]);

  // Initial load
  useEffect(() => {
    const initGD = async () => {
      try {
        const res = await fetch(`/api/v1/sessions/${sessionId}/gd/init`, { method: "POST" });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        setTopic(data.data.topic);

        const initialParticipants = data.data.participants.map((participant: Participant) => ({
          id: participant.id,
          name: participant.name,
          isAI: true,
          isSpeaking: false,
          contributions: 0,
          participationScore: 0,
        }));

        setParticipants((prev) => [...prev.filter((participant) => !participant.isAI), ...initialParticipants]);

        const initMessages: ChatMessage[] = data.data.responses.map((response: { id: string; senderName: string; text: string }) => ({
          id: response.id,
          sender: "ai",
          content: response.text,
          agentName: response.senderName,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));

        setMessages(initMessages);

        const lastMsg = initMessages[initMessages.length - 1];
        const activeAgent = initialParticipants.find((participant) => participant.name === lastMsg?.agentName);

        if (activeAgent && lastMsg) {
          setSpeakingAgentId(activeAgent.id);
          void speakText(lastMsg.content, activeAgent.name);
        }

        setIsLoading(false);
      } catch (initError: unknown) {
        const message = initError instanceof Error ? initError.message : "Failed to initialize discussion";
        setError(message);
        setIsLoading(false);
      }
    };

    if (sessionId) {
      void initGD();
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [sessionId, speakText]);

  const handleUserMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      content: trimmed,
      agentName: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setSpeakingAgentId("user");
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);

    window.setTimeout(() => setSpeakingAgentId(null), 1500);

    setIsThinking(true);
    try {
      const res = await fetch(`/api/v1/sessions/${sessionId}/gd/next`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatHistory: newHistory.map((message) => ({
            senderName: message.agentName || (message.sender === "user" ? "You" : "AI"),
            text: message.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      let currentMsgs = [...newHistory];
      for (const response of data.data.responses) {
        const aiMsg: ChatMessage = {
          id: response.id,
          sender: "ai",
          content: response.text,
          agentName: response.senderName,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        currentMsgs = [...currentMsgs, aiMsg];
        setMessages(currentMsgs);
        setSpeakingAgentId(response.agentId);

        await speakText(response.text, response.senderName);
      }
    } catch (messageError) {
      console.error(messageError);
    } finally {
      setIsThinking(false);
    }
  };

  const handleComplete = async () => {
    try {
      await fetch(`/api/v1/sessions/${sessionId}/complete`, { method: "POST" });
      router.push(`/report?sessionId=${sessionId}`);
    } catch (completeError) {
      console.error(completeError);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
        {error ? (
          <div className="text-center space-y-4 max-w-md">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h3 className="text-lg font-semibold">Error Loading Discussion</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Initializing group discussion...</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-130px)] flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between glass-card rounded-xl p-4 shrink-0 border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-heading tracking-tight truncate max-w-xl">{topic}</h1>
            <p className="text-xs text-muted-foreground">Strategy Discussion - 15 Minutes</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 shrink-0">
          <Button variant="outline" size="sm" onClick={handleComplete}>
            Finish Discussion
          </Button>
          <Link href="/dashboard">
            <Button variant="destructive" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" /> End Session
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12 min-h-0 overflow-y-auto lg:overflow-hidden pr-2 lg:pr-0">
        <div className="flex flex-col gap-6 lg:col-span-8 min-h-0">
          <div className="flex-1 min-h-[400px]">
            <DiscussionArena participants={displayedParticipants} timeLeft={formatTime(timeLeft)} />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4 min-h-[800px] lg:min-h-0">
          <div className="shrink-0">
            <ParticipationMeter participants={displayedParticipants} />
          </div>
          <div className="flex-1 min-h-0 flex flex-col">
            <ChatPanel
              messages={messages}
              interviewerName="AI Participants"
              isInteractive={true}
              onSendMessage={(text) => {
                setChatInputValue("");
                void handleUserMessage(text);
              }}
              isInterviewerTyping={isThinking}
              inputValue={chatInputValue}
              onInputChange={setChatInputValue}
            />
          </div>
          <div className="shrink-0">
            <VoicePanel
              onTranscriptUpdate={(transcript) => {
                setSpeakingAgentId("user");
                setChatInputValue((prev) => {
                  const trimmed = prev.trim();
                  return trimmed ? `${trimmed} ${transcript}` : transcript;
                });
              }}
              isListening={isListening}
              onListeningChange={(listening) => {
                setIsListening(listening);
                if (listening) {
                  setSpeakingAgentId("user");
                  return;
                }

                const spokenText = chatInputValue.trim();
                if (spokenText) {
                  setChatInputValue("");
                  void handleUserMessage(spokenText);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
