import TechnicalInterviewClient from "@/components/interview/TechnicalInterviewClient";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ sessionId?: string }>;
};

export default async function TechnicalInterviewPage({ searchParams }: PageProps) {
  const { sessionId } = await searchParams;

  if (!sessionId) {
    redirect("/interview/setup");
  }

  return <TechnicalInterviewClient sessionId={sessionId} />;
}
