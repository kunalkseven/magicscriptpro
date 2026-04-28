"use client";

import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[rgba(108,71,255,0.1)] border-t-[var(--primary)] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[var(--primary)] animate-pulse opacity-50" />
        </div>
      </div>
      <p className="text-[var(--text-muted)] font-medium animate-pulse">Loading dashboard...</p>
    </div>
  );
}
