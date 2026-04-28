"use client";

import { useState } from "react";
import { trpc } from "@/trpc/react";
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Zap,
  Filter,
  RefreshCw,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const niches = [
  "All",
  "Tech",
  "Finance",
  "Fitness",
  "Education",
  "Entertainment",
  "Lifestyle",
  "Business",
  "Food",
];

function getScoreColor(score: number): string {
  if (score >= 80) return "var(--error)";
  if (score >= 60) return "var(--accent)";
  if (score >= 40) return "var(--warning)";
  return "var(--text-muted)";
}

function getVelocityIcon(velocity: number) {
  if (velocity > 10) return <TrendingUp size={14} className="text-[var(--success)]" />;
  if (velocity < -10) return <TrendingDown size={14} className="text-[var(--error)]" />;
  return <ArrowUpRight size={14} className="text-[var(--text-muted)]" />;
}

export default function TrendsPage() {
  const [selectedNiche, setSelectedNiche] = useState("All");

  const { data: trends, isLoading, refetch } = trpc.trend.getTrends.useQuery(
    selectedNiche === "All" ? { limit: 30 } : { niche: selectedNiche, limit: 30 }
  );

  return (
    <div className="min-h-screen bg-[#06070B] text-white">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] bg-[rgba(6,7,11,0.8)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--error)] flex items-center justify-center">
              <Flame size={16} color="white" />
            </div>
            <span className="font-bold text-lg">Trend Intelligence</span>
          </div>
          <button
            onClick={() => refetch()}
            className="btn btn-ghost btn-sm flex items-center gap-2 text-sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Niche Filter */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <Filter size={16} className="text-[var(--text-muted)] flex-shrink-0" />
          {niches.map((niche) => (
            <button
              key={niche}
              onClick={() => setSelectedNiche(niche)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                selectedNiche === niche
                  ? "bg-[rgba(108,71,255,0.15)] border-[var(--primary-light)] text-white"
                  : "bg-transparent border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border-default)]"
              }`}
            >
              {niche}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 border-4 border-[rgba(108,71,255,0.2)] border-t-[var(--primary)] rounded-full animate-spin mb-4" />
            <p className="text-[var(--text-muted)]">Loading trends...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!trends || trends.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(108,71,255,0.1)] border border-[rgba(108,71,255,0.2)] flex items-center justify-center mb-4">
              <Sparkles size={28} className="text-[var(--primary-light)]" />
            </div>
            <h3 className="heading-sm mb-2">No trends yet</h3>
            <p className="text-[var(--text-muted)] text-sm max-w-md">
              Trends are scraped automatically every 4 hours by Inngest. Once the first scrape completes,
              trending topics will appear here.
            </p>
          </div>
        )}

        {/* Trends Grid */}
        {trends && trends.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trends.map((trend) => (
              <div
                key={trend.id}
                className="group bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-5 hover:border-[var(--border-default)] transition-all hover:shadow-lg cursor-pointer"
              >
                {/* Top Row: Niche badge + Velocity */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-[rgba(108,71,255,0.08)] text-[var(--primary-light)] border border-[rgba(108,71,255,0.15)] font-medium">
                    {trend.niche}
                  </span>
                  <div className="flex items-center gap-1 text-xs">
                    {getVelocityIcon(trend.velocity)}
                    <span
                      className={
                        trend.velocity > 0
                          ? "text-[var(--success)]"
                          : trend.velocity < 0
                          ? "text-[var(--error)]"
                          : "text-[var(--text-muted)]"
                      }
                    >
                      {trend.velocity > 0 ? "+" : ""}
                      {trend.velocity.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Topic */}
                <h3 className="font-semibold text-sm leading-snug mb-3 group-hover:text-white transition-colors">
                  {trend.topic}
                </h3>

                {/* Score Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${trend.score}%`,
                        backgroundColor: getScoreColor(trend.score),
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={12} style={{ color: getScoreColor(trend.score) }} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: getScoreColor(trend.score) }}
                    >
                      {trend.score.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
