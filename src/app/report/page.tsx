"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ScoreOverview from "@/components/report/ScoreOverview";
import CategoryScores from "@/components/report/CategoryScores";
import StrengthWeakness from "@/components/report/StrengthWeakness";
import LearningRoadmap from "@/components/report/LearningRoadmap";
import { Button } from "@/components/ui/button";
import { Download, Share2, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function ReportContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/reports/${sessionId}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch report data");
        }

        setReportData(data.data);
      } catch (err: any) {
        console.error("Error fetching report:", err);
        setError(err.message || "An unexpected error occurred while loading the report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Analyzing your responses and rendering your profile report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-lg font-semibold">Error Loading Report</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">{error}</p>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">
            {sessionId ? "Live Interview Report" : "Candidate Report (Demo)"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Detailed performance analysis and personalized recommendations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button className="gap-2 gradient-bg text-white border-0">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      <ScoreOverview report={reportData} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryScores scores={reportData?.scores} />
        <div className="flex flex-col gap-6">
          <StrengthWeakness 
            strengths={reportData?.strengths} 
            weaknesses={reportData?.weaknesses} 
          />
        </div>
      </div>

      <LearningRoadmap roadmap={reportData?.roadmap} />
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading report view...</p>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
