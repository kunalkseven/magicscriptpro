"use client";

import { useState } from "react";
import { trpc } from "@/trpc/react";
import {
  Search,
  Eye,
  BarChart3,
  MessageSquare,
  Loader2,
  Video,
  Camera,
  Briefcase,
  Users,
  ExternalLink,
} from "lucide-react";

const platforms = [
  { id: "Instagram", icon: Camera },
  { id: "YouTube", icon: Video },
  { id: "LinkedIn", icon: Briefcase },
];

export default function CompetitorAnalyzerPage() {
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [searchedHandle, setSearchedHandle] = useState("");

  const requestScrape = trpc.competitor.requestScrape.useMutation({
    onSuccess: () => {
      setSearchedHandle(handle);
      // Refetch data after a short delay to allow background job to process
      setTimeout(() => {
        competitorData.refetch();
      }, 3000);
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
    <div className="min-h-screen bg-[#06070B] text-white">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] bg-[rgba(6,7,11,0.8)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--info)] to-[var(--primary)] flex items-center justify-center">
            <Users size={16} color="white" />
          </div>
          <span className="font-bold text-lg">Competitor Analyzer</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-lg mb-8">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-5">
            <Search size={18} className="text-[var(--info)]" />
            Analyze a Competitor
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Handle Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Creator Handle
              </label>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@username or channel name"
                className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--primary-light)] transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
            </div>

            {/* Platform Selector */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Platform
              </label>
              <div className="flex gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-colors border ${
                      platform === p.id
                        ? "bg-[rgba(108,71,255,0.1)] border-[var(--primary-light)] text-white"
                        : "bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)]"
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
                className="btn btn-primary py-3 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                {requestScrape.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <BarChart3 size={16} />
                )}
                Analyze
              </button>
            </div>
          </div>
        </div>

        {/* Queued Message */}
        {requestScrape.isPending && (
          <div className="flex items-center gap-3 bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.2)] rounded-xl p-4 mb-6">
            <Loader2 size={18} className="animate-spin text-[var(--info)]" />
            <p className="text-sm text-[var(--text-secondary)]">
              Scrape job queued for <strong>@{handle}</strong> on {platform}. Results will appear shortly...
            </p>
          </div>
        )}

        {/* Results */}
        {competitorData.data && competitorData.data.length > 0 && (
          <div>
            <h2 className="heading-sm mb-6">
              Results for{" "}
              <span className="text-gradient">@{searchedHandle}</span>
            </h2>

            <div className="space-y-4">
              {competitorData.data.map((post) => (
                <div
                  key={post.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-5 hover:border-[var(--border-default)] transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Hook Text */}
                    <div className="flex-1">
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                        &ldquo;{post.hookText}&rdquo;
                      </p>
                      <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--primary-light)] hover:underline flex items-center gap-1"
                      >
                        View Post <ExternalLink size={10} />
                      </a>
                    </div>

                    {/* Metrics */}
                    <div className="flex gap-6 flex-shrink-0">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-[var(--text-muted)] mb-1">
                          <Eye size={12} />
                          <span className="text-xs">Views</span>
                        </div>
                        <span className="font-bold text-sm">{formatViews(post.views)}</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-[var(--text-muted)] mb-1">
                          <MessageSquare size={12} />
                          <span className="text-xs">Engagement</span>
                        </div>
                        <span
                          className="font-bold text-sm"
                          style={{
                            color:
                              post.engagementRate > 5
                                ? "var(--success)"
                                : post.engagementRate > 2
                                ? "var(--warning)"
                                : "var(--text-secondary)",
                          }}
                        >
                          {post.engagementRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!requestScrape.isPending &&
          (!competitorData.data || competitorData.data.length === 0) &&
          !searchedHandle && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center mb-4">
                <Users size={28} className="text-[var(--info)]" />
              </div>
              <h3 className="heading-sm mb-2">Spy on the competition</h3>
              <p className="text-[var(--text-muted)] text-sm max-w-md">
                Enter a creator&apos;s handle to analyze their top-performing content, hooks, and
                engagement patterns. Learn what works in your niche.
              </p>
            </div>
          )}
      </main>
    </div>
  );
}
