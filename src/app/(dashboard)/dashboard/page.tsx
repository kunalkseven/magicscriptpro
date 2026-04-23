"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { trpc } from "@/trpc/react";
import { Sparkles, Activity, PlusCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const { data: dbUser, isLoading: dbUserLoading } = trpc.user.getCurrentUser.useQuery(undefined, {
    enabled: isLoaded && !!user,
  });

  // Redirect to onboarding if they haven't completed it
  useEffect(() => {
    if (!dbUserLoading && dbUser && !dbUser.creatorProfile?.onboardingComplete) {
      router.push("/onboarding");
    }
  }, [dbUser, dbUserLoading, router]);

  if (!isLoaded || dbUserLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#06070B] text-white">
      {/* Top Navbar */}
      <header className="border-b border-[var(--border-subtle)] bg-[rgba(6,7,11,0.8)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--gradient-primary)] flex items-center justify-center shadow-[0_0_15px_rgba(108,71,255,0.3)]">
              <Sparkles size={16} color="white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Creator<span className="text-[var(--primary-light)]">AI</span> Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-lg" } }} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName} 👋</h1>
            <p className="text-[var(--text-secondary)]">Your voice DNA is active and analyzing new trends.</p>
          </div>
          <button className="btn btn-primary flex items-center gap-2 whitespace-nowrap">
            <PlusCircle size={18} />
            New Script
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[rgba(108,71,255,0.1)] flex items-center justify-center text-[var(--primary-light)]">
                <Activity size={20} />
              </div>
              <h2 className="font-semibold text-lg">Trend Velocity</h2>
            </div>
            <div className="text-3xl font-bold text-white mb-1">94.2</div>
            <div className="text-sm text-[var(--success)]">+12.5% this week</div>
          </div>

          {/* Card 2 */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[rgba(34,197,94,0.1)] flex items-center justify-center text-[var(--success)]">
                <CheckCircle size={20} />
              </div>
              <h2 className="font-semibold text-lg">Scripts Ready</h2>
            </div>
            <div className="text-3xl font-bold text-white mb-1">12</div>
            <div className="text-sm text-[var(--text-secondary)]">Awaiting your review</div>
          </div>

          {/* Profile Setup Box */}
          <div className="bg-[rgba(108,71,255,0.05)] border border-[rgba(108,71,255,0.15)] rounded-2xl p-6 shadow-[0_0_30px_rgba(108,71,255,0.05)]">
            <h3 className="font-bold text-lg mb-2 text-[var(--primary-light)]">Voice DNA Status</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Niche: <strong className="text-white">{dbUser?.creatorProfile?.niche || "Not set"}</strong><br/>
              Language: <strong className="text-white">{dbUser?.creatorProfile?.languagePref || "Not set"}</strong>
            </p>
            <div className="h-2 w-full bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--primary-light)] w-[100%]" />
            </div>
            <p className="text-xs mt-2 text-[var(--success)] font-medium">100% Trained</p>
          </div>
        </div>
      </main>
    </div>
  );
}
