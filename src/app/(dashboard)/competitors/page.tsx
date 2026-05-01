"use client";

import { useState } from "react";
import { trpc } from "@/trpc/react";
import {
  Search, Eye, BarChart3, MessageSquare, Loader2,
  Video, Camera, Briefcase, Users, ExternalLink,
  ChevronRight, Target, Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const platforms = [
  { id: "Instagram", icon: Camera, color: "#E1306C" },
  { id: "YouTube", icon: Video, color: "#FF0000" },
  { id: "LinkedIn", icon: Briefcase, color: "#0077B5" },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
};

const item = {
  hidden: { y: 14, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease } }
};

export default function CompetitorAnalyzerPage() {
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [searchedHandle, setSearchedHandle] = useState("");

  const requestScrape = trpc.competitor.requestScrape.useMutation({
    onSuccess: () => {
      setSearchedHandle(handle);
      setTimeout(() => { competitorData.refetch(); }, 3000);
    },
  });

  const competitorData = trpc.competitor.getCompetitorData.useQuery(
    searchedHandle ? { handle: searchedHandle, platform, limit: 20 } : undefined,
    { enabled: !!searchedHandle }
  );

  const handleAnalyze = () => {
    if (!handle.trim()) return;
    requestScrape.mutate({ handle: handle.trim(), platform });
  };

  const formatViews = (views: number): string => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <div className="badge mb-4 border-[var(--info)]/30 text-[var(--info)] bg-[var(--info)]/10">
          <Target size={14} />
          Intel Gathering
        </div>
        <h1 className="heading-lg text-white mb-2">
          Competitor <span className="text-gradient">Analyzer</span>
        </h1>
        <p className="body-md">Deconstruct top-performing hooks and engagement patterns from your niche rivals.</p>
      </div>

      {/* Search Console */}
      <div className="card" style={{ padding: '24px' }}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Handle Input */}
          <div className="flex-1 space-y-3">
            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Creator Handle</label>
            <div className="relative">
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@username or channel name"
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-3.5 text-sm text-white placeholder:text-[var(--text-disabled)] focus:outline-none focus:border-[var(--info)]/50 transition-all pr-10"
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
              <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
          </div>

          {/* Platform Selector */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Platform</label>
            <div className="flex gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all border ${
                    platform === p.id
                      ? "bg-[var(--info)] text-white border-[var(--info)] shadow-lg shadow-[var(--info)]/20"
                      : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-default)]"
                  }`}
                >
                  <p.icon size={16} />
                  {p.id}
                </button>
              ))}
            </div>
          </div>

          {/* Analyze Button */}
          <div className="flex items-end">
            <button
              onClick={handleAnalyze}
              disabled={!handle.trim() || requestScrape.isPending}
              className="btn btn-primary w-full lg:w-auto h-[50px] shadow-[var(--info)]/30 border-[var(--info)]/50"
              style={{ background: 'linear-gradient(135deg, var(--info) 0%, var(--primary) 100%)' }}
            >
              {requestScrape.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <BarChart3 size={18} />
              )}
              <span>Analyze</span>
            </button>
          </div>
        </div>
      </div>

      {/* Queued Message */}
      <AnimatePresence>
        {requestScrape.isPending && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 bg-[var(--info)]/10 border border-[var(--info)]/20 rounded-xl p-4">
            <Loader2 size={18} className="animate-spin text-[var(--info)] flex-shrink-0" />
            <p className="body-md text-sm">Scrape job queued for <span className="text-white font-semibold">@{handle}</span>. Results syncing shortly...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence mode="wait">
        {competitorData.data && competitorData.data.length > 0 ? (
          <motion.div key="results" variants={container} initial="hidden" animate="show" className="space-y-5">
            <h2 className="heading-sm text-white flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[var(--info)] rounded-full" />
              Results: <span className="text-[var(--info)]">@{searchedHandle}</span>
            </h2>

            <div className="space-y-4">
              {competitorData.data.map((post) => (
                <motion.div key={post.id} variants={item}
                  className="card group hover:border-[var(--border-default)] transition-all" style={{ padding: '24px' }}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <p className="body-md text-white/90 leading-relaxed mb-3">&ldquo;{post.hookText}&rdquo;</p>
                      <a href={post.postUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[var(--info)] uppercase tracking-widest hover:text-white transition-colors">
                        View Post <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="flex gap-8 lg:border-l lg:border-[var(--border-subtle)] lg:pl-8 flex-shrink-0">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">
                          <Eye size={14} /> Views
                        </div>
                        <p className="text-2xl font-extrabold text-white tracking-tight">{formatViews(post.views)}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">
                          <Zap size={14} /> Eng. Rate
                        </div>
                        <p className="text-2xl font-extrabold tracking-tight"
                          style={{ color: post.engagementRate > 5 ? "var(--success)" : post.engagementRate > 2 ? "var(--warning)" : "var(--text-muted)" }}>
                          {post.engagementRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : !requestScrape.isPending && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-28 text-center card bg-transparent border-dashed">
            <div className="w-20 h-20 rounded-2xl bg-[var(--info)]/10 border border-[var(--info)]/20 flex items-center justify-center mb-6">
              <Users size={32} className="text-[var(--info)]" />
            </div>
            <h3 className="heading-sm text-white mb-2">Ready to analyze</h3>
            <p className="body-md max-w-sm">Enter a creator handle to scan their performance metrics and hook strategies.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
