import { adminNavItems } from "@/lib/constants";
import Sidebar from "@/components/layout/Sidebar";
import PageTransition from "@/components/layout/PageTransition";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      <Sidebar items={adminNavItems} title="Admin" />
      <main className="flex-1 overflow-x-hidden bg-muted/20">
        <PageTransition>
          <div className="mx-auto max-w-7xl p-6 md:p-8">
            {children}
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
