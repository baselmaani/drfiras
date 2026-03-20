"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import { DashboardNav } from "./DashboardNav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();

  if (segment === "login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="flex-1 lg:ml-56 p-4 sm:p-6 lg:p-8 min-h-screen pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
