import HRInterviewClient from "@/components/interview/HRInterviewClient";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ sessionId?: string }>;
};

export default async function HRInterviewPage({ searchParams }: PageProps) {
  const { sessionId } = await searchParams;

  if (!sessionId) {
    redirect("/interview/setup");
  }

  return <HRInterviewClient sessionId={sessionId} />;
}
