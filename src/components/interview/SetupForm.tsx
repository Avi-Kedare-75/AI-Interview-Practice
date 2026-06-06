"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Monitor,
  Server,
  Layers,
  Brain,
  Cloud,
  Network,
  Smartphone,
  Database,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  Play,
  Code,
  Upload,
  FileText,
  X,
  Loader2,
} from "lucide-react";
import { interviewDomains, voicePreferences } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const steps = ["Domain", "Type & Difficulty", "Resume", "Voice & Preferences", "Summary"];

const iconMap: Record<string, React.ElementType> = {
  Monitor,
  Server,
  Layers,
  Brain,
  Cloud,
  Network,
  Smartphone,
  Database,
};

export default function SetupForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selections, setSelections] = useState({
    domain: "",
    type: "technical",
    difficulty: 50,
    voice: "v1",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setParseError("Only PDF files are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setParseError("File size must be under 5MB.");
      return;
    }

    setResumeFile(file);
    setParseError("");
    setIsParsing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/v1/resume/parse", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success && data.text) {
        setResumeText(data.text);
      } else {
        setParseError(data.error || "Failed to parse resume.");
        setResumeFile(null);
      }
    } catch {
      setParseError("Network error while parsing resume.");
      setResumeFile(null);
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const removeResume = useCallback(() => {
    setResumeFile(null);
    setResumeText("");
    setParseError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleStart = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: selections.domain,
          type: selections.type,
          difficulty: selections.difficulty,
          voicePreference: selections.voice,
          resumeText: resumeText || undefined,
        }),
      });
      const data = await res.json();

      if (data.success && data.data._id) {
        const sessionId = data.data._id;
        const query = `?sessionId=${sessionId}`;

        if (selections.type === "multi-agent") {
          router.push(`/interview/multi-agent${query}`);
        } else if (selections.type === "hr") {
          router.push(`/interview/hr${query}`);
        } else if (selections.type === "group-discussion") {
          router.push(`/group-discussion${query}`);
        } else {
          router.push(`/interview/technical${query}`);
        }
      } else {
        console.error("Failed to create session:", data.error);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating session:", error);
      setIsSubmitting(false);
    }
  };

  const selectedDomainData = interviewDomains.find((d) => d.id === selections.domain);
  const getDifficultyLabel = (val: number) => {
    if (val <= 25) return "Beginner";
    if (val <= 50) return "Intermediate";
    if (val <= 75) return "Advanced";
    return "Expert";
  };
  const interviewTypeOptions = [
    {
      id: "technical",
      label: "Technical Expert",
      description: "Deep dive into technical concepts",
    },
    {
      id: "hr",
      label: "HR / Behavioral",
      description: "Focus on soft skills and culture fit",
    },
    {
      id: "multi-agent",
      label: "Multi-Agent Panel",
      description: "Sequential interview with different roles",
    },
    {
      id: "group-discussion",
      label: "Group Discussion",
      description: "Discuss a topic with 5 AI participants",
    },
  ] as const;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  index <= currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {index < currentStep ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
              </div>
              <span
                className={`text-xs font-medium ${
                  index <= currentStep ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-4 h-2 w-full rounded-full bg-secondary">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full gradient-bg"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="glass-card min-h-[400px] rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step-domain"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold font-heading">Choose your domain</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select the technical area you want to practice.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {interviewDomains.map((domain) => {
                  const Icon = iconMap[domain.icon] || Code;
                  const isSelected = selections.domain === domain.id;
                  return (
                    <div
                      key={domain.id}
                      onClick={() => setSelections((prev) => ({ ...prev, domain: domain.id }))}
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`rounded-lg p-2 ${
                            isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium">{domain.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">{domain.description}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-type"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-xl font-semibold font-heading">Interview Type</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  What kind of interview format do you want?
                </p>
              </div>

              <RadioGroup
                value={selections.type}
                onValueChange={(value) =>
                  setSelections((prev) => ({ ...prev, type: value as typeof prev.type }))
                }
                className="grid gap-4 sm:grid-cols-2"
              >
                {interviewTypeOptions.map((option) => {
                  const isSelected = selections.type === option.id;
                  return (
                    <Label
                      key={option.id}
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      }`}
                      onClick={() =>
                        setSelections((prev) => ({ ...prev, type: option.id }))
                      }
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem
                          id={`type-${option.id}`}
                          value={option.id}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <h4 className="font-medium">{option.label}</h4>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>

              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">Difficulty Level</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getDifficultyLabel(selections.difficulty)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-primary">{selections.difficulty}/100</p>
                </div>

                <Slider
                  value={[selections.difficulty]}
                  min={0}
                  max={100}
                  step={25}
                  onValueChange={(value) => {
                    const nextValue = Array.isArray(value) ? value[0] : value;
                    setSelections((prev) => ({ ...prev, difficulty: nextValue ?? 50 }));
                  }}
                />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                  <span>Expert</span>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-resume"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold font-heading">Upload Resume</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your resume so the AI can tailor questions to your experience.{" "}
                  <span className="text-primary font-medium">(Optional)</span>
                </p>
              </div>

              {!resumeFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-300 ${
                    isDragOver
                      ? "border-primary bg-primary/10 scale-[1.02]"
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="resume-upload-input"
                  />
                  <motion.div
                    animate={isDragOver ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                  >
                    <Upload className="h-8 w-8" />
                  </motion.div>
                  <div className="text-center">
                    <p className="font-medium">
                      {isDragOver ? "Drop your resume here!" : "Drag & drop your resume"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or <span className="text-primary underline underline-offset-2">click to browse</span> • PDF only, max 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-background/50 p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
                        isParsing
                          ? "bg-primary/10 text-primary animate-pulse"
                          : resumeText
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {isParsing ? (
                        <Loader2 className="h-7 w-7 animate-spin" />
                      ) : (
                        <FileText className="h-7 w-7" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{resumeFile.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {(resumeFile.size / 1024).toFixed(1)} KB
                        {isParsing && " • Parsing..."}
                        {resumeText && ` • ${resumeText.split(/\s+/).length} words extracted`}
                      </p>
                      {resumeText && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-success font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Resume parsed successfully
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeResume}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {resumeText && (
                    <div className="mt-4 rounded-xl bg-muted/50 p-4 max-h-32 overflow-y-auto">
                      <p className="text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">
                        {resumeText.slice(0, 500)}
                        {resumeText.length > 500 && "..."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {parseError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive font-medium"
                >
                  {parseError}
                </motion.p>
              )}
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-voice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-xl font-semibold font-heading">AI Voice Profile</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select the voice for your AI interviewer.
                </p>
              </div>

              <div className="grid gap-4">
                {voicePreferences.map((voice) => (
                  <div
                    key={voice.id}
                    onClick={() => setSelections((prev) => ({ ...prev, voice: voice.id }))}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                      selections.voice === voice.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          selections.voice === voice.id ? "bg-primary text-white" : "bg-muted"
                        }`}
                      >
                        <Mic className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{voice.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {voice.accent} • {voice.gender}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center text-center space-y-6 py-8"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-bg text-white shadow-xl shadow-primary/20">
                <Brain className="h-10 w-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold font-heading">Ready to Begin?</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Your AI interviewer is preparing the session. Please ensure your microphone is
                  working and you are in a quiet environment.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm text-left bg-muted/30 p-4 rounded-xl border border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Domain</p>
                  <p className="font-medium">{selectedDomainData?.name || "Not selected"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Format</p>
                  <p className="font-medium">
                    {interviewTypeOptions.find((type) => type.id === selections.type)?.label ||
                      "Technical Expert"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Difficulty</p>
                  <p className="font-medium">{getDifficultyLabel(selections.difficulty)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Resume</p>
                  <p className="font-medium">{resumeText ? "✓ Uploaded" : "Not provided"}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={nextStep}
            disabled={currentStep === 0 && !selections.domain}
            className="gap-2"
          >
            {currentStep === 2 && !resumeText ? "Skip" : "Continue"}{" "}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleStart}
            disabled={isSubmitting}
            className="gap-2 gradient-bg text-white border-0 glow-violet"
          >
            {isSubmitting ? "Starting..." : "Start Interview"} <Play className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
