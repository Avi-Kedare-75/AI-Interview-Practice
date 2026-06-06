"use client";

import { useState, useEffect } from "react";
import { PenLine, Save, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  title?: string;
}

export default function NotesSection({
  value,
  onChange,
  placeholder = "Jot down key points, structure your thoughts, or write pseudocode here...",
  title = "Scratchpad",
}: NotesSectionProps) {
  const [internalNotes, setInternalNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const isControlled = value !== undefined && onChange !== undefined;
  const currentNotes = isControlled ? value : internalNotes;

  // Mock auto-save for uncontrolled mode
  useEffect(() => {
    if (isControlled || !internalNotes) return;

    setIsSaving(true);
    const timeout = setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1000);

    return () => clearTimeout(timeout);
  }, [internalNotes, isControlled]);

  const handleChange = (val: string) => {
    if (isControlled) {
      onChange(val);
    } else {
      setInternalNotes(val);
    }
  };

  return (
    <div className="glass-card flex h-full flex-col rounded-2xl p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold font-heading">
          <PenLine className="h-4 w-4 text-muted-foreground" />
          {title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {isSaving ? (
            <>
              <Save className="h-3 w-3 animate-pulse" />
              Saving...
            </>
          ) : lastSaved ? (
            <>
              <Check className="h-3 w-3 text-success" />
              Saved
            </>
          ) : null}
        </div>
      </div>

      <Textarea
        value={currentNotes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 resize-none border-border bg-background/50 focus-visible:ring-primary/30"
      />
    </div>
  );
}
