"use client";

import { motion } from "motion/react";
import { Mic, MicOff, Volume2, Settings2, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

interface VoicePanelProps {
  onTranscriptUpdate?: (text: string) => void;
  isListening?: boolean;
  onListeningChange?: (listening: boolean) => void;
}

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;

  const win = window as Window &
    typeof globalThis & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };

  return win.SpeechRecognition ?? win.webkitSpeechRecognition;
}

export default function VoicePanel({
  onTranscriptUpdate,
  isListening: externalIsListening,
  onListeningChange,
}: VoicePanelProps) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const recognitionActiveRef = useRef(false);
  const activeListeningRef = useRef(false);

  const SpeechRecognition = getSpeechRecognitionCtor();
  const isSupported = Boolean(SpeechRecognition);
  const activeListening = externalIsListening !== undefined ? externalIsListening : isListening;

  useEffect(() => {
    activeListeningRef.current = activeListening;
  }, [activeListening]);

  const setActiveListening = useCallback(
    (val: boolean) => {
      if (onListeningChange) {
        onListeningChange(val);
      } else {
        setIsListening(val);
      }
    },
    [onListeningChange]
  );

  useEffect(() => {
    if (!SpeechRecognition || recognitionRef.current) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event: SpeechRecognitionEventLike) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += `${result[0].transcript} `;
        }
      }

      const transcript = finalTranscript.trim();
      if (transcript) {
        onTranscriptUpdate?.(transcript);
      }
    };

    rec.onerror = (event: SpeechRecognitionErrorEventLike) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Microphone permission denied. Please allow microphone access and try again.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Try speaking a little louder.");
      } else {
        setError(`Voice input error: ${event.error}`);
      }

      setActiveListening(false);
    };

    rec.onend = () => {
      recognitionActiveRef.current = false;
      // Browsers often stop the recognizer after a short pause.
      // Restart it while the user still has voice input enabled.
      if (activeListeningRef.current) {
        try {
          recognitionActiveRef.current = true;
          rec.start();
        } catch (startError) {
          console.error("Failed to restart speech recognition:", startError);
        }
      }
    };

    recognitionRef.current = rec;

    return () => {
      try {
        rec.onresult = null;
        rec.onerror = null;
        rec.onend = null;
        rec.abort();
      } catch {
        // Ignore cleanup failures from the browser speech engine.
      } finally {
        recognitionRef.current = null;
      }
    };
  }, [SpeechRecognition, onTranscriptUpdate, setActiveListening]);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (activeListening && !recognitionActiveRef.current) {
      try {
        recognition.start();
        recognitionActiveRef.current = true;
      } catch (startError) {
        console.error("Failed to sync speech recognition start:", startError);
      }
      return;
    }

    if (!activeListening && recognitionActiveRef.current) {
      try {
        recognition.stop();
      } catch (stopError) {
        console.error("Failed to sync speech recognition stop:", stopError);
      } finally {
        recognitionActiveRef.current = false;
      }
    }
  }, [activeListening]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Voice input is not supported in this browser. Use Chrome on localhost/HTTPS.");
      return;
    }

    const recognition = recognitionRef.current;
    if (!recognition) {
      setError("Voice input is still initializing. Please try again.");
      return;
    }

    try {
      setError(null);
      setActiveListening(true);
    } catch (startError) {
      console.error("Failed to start speech recognition:", startError);
      setError("Could not start voice input. Please refresh the page and try again.");
      setActiveListening(false);
    }
  }, [isSupported, setActiveListening]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    setActiveListening(false);

    try {
      recognition?.stop();
    } catch (stopError) {
      console.error("Failed to stop speech recognition:", stopError);
    }
  }, [setActiveListening]);

  const toggleListening = useCallback(() => {
    if (activeListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [activeListening, startListening, stopListening]);

  const bars = Array.from({ length: 16 }, (_, index) => ({
    id: index,
    peak: 12 + ((index * 9) % 6) * 5,
    duration: 0.55 + (index % 4) * 0.12,
  }));

  return (
    <div className="glass-card flex flex-col items-center justify-center space-y-6 rounded-2xl p-6 text-center">
      <div className="relative">
        {activeListening && (
          <div className="absolute inset-0 animate-pulse-slow rounded-full bg-primary/20 blur-xl" />
        )}
        <div
          className={`relative flex h-24 w-24 items-center justify-center rounded-full border-4 transition-colors ${
            !activeListening
              ? "border-muted bg-muted/50 text-muted-foreground"
              : "border-primary/50 bg-primary/10 text-primary"
          }`}
        >
          {!activeListening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading font-semibold">Voice Input</h3>
        {error ? (
          <p className="flex items-center justify-center gap-1 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        ) : (
          <p className="h-5 text-sm text-muted-foreground">
            {isSupported
              ? activeListening
                ? "Listening... speak now"
                : "Microphone off"
              : "Voice input is unavailable in this browser"}
          </p>
        )}
      </div>

      <div className="flex h-12 w-full max-w-[200px] items-center justify-center gap-1 overflow-hidden">
        {bars.map((bar) => (
          <motion.div
            key={bar.id}
            className={`w-2 rounded-full ${!activeListening ? "bg-muted" : "gradient-bg"}`}
            animate={{
              height: !activeListening ? 8 : [8, bar.peak, 8],
            }}
            transition={{
              duration: !activeListening ? 0.3 : bar.duration,
              repeat: !activeListening ? 0 : Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="flex w-full items-center justify-center gap-3 border-t border-border pt-4">
        <Button
          variant={activeListening ? "destructive" : "secondary"}
          size="icon"
          className={`h-12 w-12 rounded-full transition-all ${
            activeListening
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-primary/20 text-primary hover:bg-primary/30"
          }`}
          onClick={toggleListening}
          disabled={!isSupported}
          title={
            isSupported
              ? activeListening
                ? "Stop voice input"
                : "Start voice input"
              : "Speech recognition is not supported in this browser"
          }
        >
          {activeListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
          <Settings2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
