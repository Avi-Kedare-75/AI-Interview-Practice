import { redirect } from "next/navigation";
import GDClient from "@/components/group-discussion/GDClient";

export default async function GroupDiscussionPage({
  searchParams,
}: {
  searchParams: { sessionId?: string };
}) {
  const { sessionId } = await searchParams;

  if (!sessionId) {
    redirect("/interview/setup");
  }

  return <GDClient sessionId={sessionId} />;
}
