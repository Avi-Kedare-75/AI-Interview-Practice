import SetupForm from "@/components/interview/SetupForm";

export default function InterviewSetupPage() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Configure Session</h1>
        <p className="text-muted-foreground mt-2">
          Customize your AI interview experience to match your preparation goals.
        </p>
      </div>

      <div className="mt-4">
        <SetupForm />
      </div>
    </div>
  );
}
