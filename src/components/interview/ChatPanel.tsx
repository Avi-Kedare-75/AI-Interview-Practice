"use client";

import { motion } from "motion/react";
import { Send, Bot, User } from "lucide-react";
import { mockChatMessages } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "@/types";

interface ChatPanelProps {
  messages?: ChatMessage[];
  interviewerName?: string;
  onSendMessage?: (text: string) => void;
  isInteractive?: boolean;
}

export default function ChatPanel({
  messages,
  interviewerName = "Dr. Sarah",
  onSendMessage,
  isInteractive = false,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const displayMessages = messages || mockChatMessages;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage?.(inputValue.trim());
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col glass-card rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border bg-card/50 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-white shadow-md">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold font-heading">{interviewerName}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Active
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {displayMessages.map((msg, index) => {
          const isAi = msg.sender === "ai";
          return (
            <motion.div
              key={msg.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 max-w-[85%] ${isAi ? "self-start" : "self-end ml-auto flex-row-reverse"}`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-auto ${isAi ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={`flex flex-col ${isAi ? "items-start" : "items-end"}`}>
                <div
                  className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    isAi
                      ? "bg-card border border-border rounded-bl-none text-foreground"
                      : "gradient-bg text-white border-0 rounded-br-none"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {isInteractive && (
        <div className="border-t border-border bg-card/50 p-4">
          <div className="relative flex items-center">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your response..."
              className="pr-12 rounded-full border-border bg-background focus-visible:ring-primary/50 h-11"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="absolute right-1 top-1 h-9 w-9 rounded-full gradient-bg border-0 text-white hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
