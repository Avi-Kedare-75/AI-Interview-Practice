import UserAnalytics from "@/components/admin/UserAnalytics";
import InterviewAnalytics from "@/components/admin/InterviewAnalytics";
import DomainStatistics from "@/components/admin/DomainStatistics";
import Leaderboards from "@/components/admin/Leaderboards";
import ReportsTable from "@/components/admin/ReportsTable";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Platform analytics, user activity, and global performance metrics.
        </p>
      </div>

      {/* Top Row: Key Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UserAnalytics />
        <InterviewAnalytics />
      </div>

      {/* Middle Row: Distribution & Leaders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DomainStatistics />
        <Leaderboards />
      </div>

      {/* Bottom Row: Data Table */}
      <div className="grid gap-6 lg:grid-cols-1">
        <ReportsTable />
      </div>
    </div>
  );
}
