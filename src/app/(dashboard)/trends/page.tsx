"use client";

import { useState } from "react";
import { trpc } from "@/trpc/react";
import {
  TrendingUp, TrendingDown, Flame, Zap, Filter, RefreshCw,
  ArrowUpRight, Sparkles, ChevronRight, BarChart3, Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const niches = ["All", "Tech", "Finance", "Fitness", "Education", "Entertainment", "Lifestyle", "Business", "Food"];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
};

const item = {
  hidden: { y: 14, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease } }
};

function getScoreColor(score: number): string {
  if (score >= 80) return "var(--error)";
  if (score >= 60) return "var(--primary)";
  if (score >= 40) return "var(--warning)";
  return "var(--text-disabled)";
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
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="badge mb-4">
            <Globe size={14} />
            Market Pulse
          </div>
          <h1 className="heading-lg text-white mb-2">
            Trend <span className="text-gradient">Intelligence</span>
          </h1>
          <p className="body-md">Real-time signals from global networks, synthesized into actionable hooks.</p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn btn-secondary flex-shrink-0 group"
        >
          <RefreshCw size={18} className="text-[var(--primary)] group-active:rotate-180 transition-transform duration-500" />
          Refresh
        </button>
      </div>

      {/* Niche Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex items-center gap-2 px-3.5 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-muted)] mr-2 flex-shrink-0">
          <Filter size={14} />
          <span className="text-xs font-bold uppercase tracking-widest">Sector</span>
        </div>
        {niches.map((niche) => (
          <button
            key={niche}
            onClick={() => setSelectedNiche(niche)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border whitespace-nowrap ${
              selectedNiche === niche
                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20"
                : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-default)] hover:bg-[var(--bg-card-hover)]"
            }`}
          >
            {niche}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-28 card bg-transparent border-dashed">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-[var(--primary)]/20 rounded-full animate-[spin_3s_linear_infinite]" />
              <div className="absolute inset-0 w-16 h-16 border-t-2 border-[var(--primary)] rounded-full animate-spin" />
              <BarChart3 className="absolute inset-0 m-auto text-[var(--primary)] animate-pulse" size={24} />
            </div>
            <p className="mt-6 text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest">Analyzing signals...</p>
          </motion.div>
        ) : !trends || trends.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-28 text-center card bg-transparent border-dashed">
            <div className="w-20 h-20 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center mb-6">
              <Sparkles size={32} className="text-[var(--text-muted)]" />
            </div>
            <h3 className="heading-sm text-white mb-2">No trends found</h3>
            <p className="body-md max-w-sm">No signals detected in this sector yet. Scanning runs every 4 hours.</p>
          </motion.div>
        ) : (
          <motion.div key="grid" variants={container} initial="hidden" animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trends.map((trend) => (
              <motion.div key={trend.id} variants={item}
                className="card group relative overflow-hidden" style={{ padding: '24px' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 blur-[50px] pointer-events-none group-hover:bg-[var(--primary)]/10 transition-all" />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <span className="badge">{trend.niche}</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {getVelocityIcon(trend.velocity)}
                    <span className={trend.velocity > 0 ? "text-[var(--success)]" : trend.velocity < 0 ? "text-[var(--error)]" : "text-[var(--text-muted)]"}>
                      {trend.velocity > 0 ? "+" : ""}{trend.velocity.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Topic */}
                <h3 className="heading-sm text-white leading-snug mb-6 line-clamp-2 min-h-[3.5rem]">{trend.topic}</h3>

                {/* Score Bar */}
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                    <span>Intensity</span>
                    <span className="text-white">{trend.score.toFixed(0)} / 100</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${trend.score}%` }} transition={{ duration: 1.2, ease }}
                        className="h-full rounded-full" style={{ backgroundColor: getScoreColor(trend.score) }} />
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${getScoreColor(trend.score)}15`, color: getScoreColor(trend.score), border: `1px solid ${getScoreColor(trend.score)}30` }}>
                      <Zap size={14} className={trend.score > 70 ? "animate-pulse" : ""} />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                    <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Active</span>
                  </div>
                  <ChevronRight size={18} className="text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
