"use client";

import { useState } from "react";
import { trpc } from "@/trpc/react";
import {
  MessageSquare,
  Zap,
  CheckCircle2,
  XCircle,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Link2,
  Send,
  Loader2,
  AlertCircle,
  ExternalLink,
  Activity,
  Target,
  TrendingUp,
} from "lucide-react";

// Custom Instagram icon (not available in lucide-react)
function InstagramIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// ===============================================
// AUTO DM DASHBOARD PAGE
// ===============================================
export default function AutoDMPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const connectionQuery = trpc.autoDm.getConnection.useQuery();
  const rulesQuery = trpc.autoDm.getRules.useQuery();
  const metricsQuery = trpc.autoDm.getMetrics.useQuery();
  const logsQuery = trpc.autoDm.getLogs.useQuery({ limit: 10 });

  const toggleRule = trpc.autoDm.toggleRule.useMutation({
    onSuccess: () => rulesQuery.refetch(),
  });

  const deleteRule = trpc.autoDm.deleteRule.useMutation({
    onSuccess: () => {
      rulesQuery.refetch();
      metricsQuery.refetch();
    },
  });

  const disconnect = trpc.autoDm.disconnect.useMutation({
    onSuccess: () => {
      connectionQuery.refetch();
      rulesQuery.refetch();
    },
  });

  const connection = connectionQuery.data;
  const rules = rulesQuery.data || [];
  const metrics = metricsQuery.data;
  const logs = logsQuery.data || [];
  const isConnected = !!connection?.isActive;

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E1306C, #F77737)' }}>
              <MessageSquare size={20} className="text-white" />
            </div>
            Instagram Auto DM
          </h1>
          <p className="text-[var(--text-muted)] mt-2 text-sm">
            Automatically DM users who comment specific keywords on your posts.
          </p>
        </div>
        {isConnected && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-[var(--primary)]/25 hover:shadow-[var(--primary)]/40 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            <Plus size={16} />
            New Rule
          </button>
        )}
      </div>

      {/* Instagram Connection Card */}
      <div className="card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E1306C]/5 via-transparent to-[#F77737]/5" />
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)' }}>
                <InstagramIcon size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isConnected ? "Instagram Connected" : "Connect Instagram"}
                </h3>
                {isConnected ? (
                  <p className="text-sm text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                    <CheckCircle2 size={14} className="text-[var(--success)]" />
                    @{connection.igUsername}
                    <span className="text-[var(--text-disabled)]">•</span>
                    <span className="text-[var(--text-disabled)]">
                      Token expires {connection.tokenExpiresAt ? new Date(connection.tokenExpiresAt).toLocaleDateString() : "N/A"}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    Connect your Instagram Business/Creator account to enable Auto DM.
                  </p>
                )}
              </div>
            </div>
            <div>
              {isConnected ? (
                <button
                  onClick={() => {
                    if (confirm("Disconnect Instagram? All Auto DM rules will stop.")) {
                      disconnect.mutate();
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[var(--error)] bg-[var(--error)]/10 border border-[var(--error)]/20 hover:bg-[var(--error)]/20 transition-all"
                >
                  Disconnect
                </button>
              ) : (
                <a
                  href="/api/auth/instagram"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)' }}
                >
                  <InstagramIcon size={16} />
                  Connect Instagram
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>

          {!isConnected && (
            <div className="mt-4 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <div className="flex gap-3">
                <AlertCircle size={18} className="text-[var(--warning)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[var(--text-secondary)] font-semibold">Requirements</p>
                  <ul className="mt-1 space-y-1 text-xs text-[var(--text-muted)]">
                    <li>• Instagram Business or Creator account</li>
                    <li>• Connected to a Facebook Page</li>
                    <li>• Meta Developer App configured</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Overview */}
      {isConnected && metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Rules"
            value={metrics.ruleCount}
            icon={Target}
            color="var(--primary)"
          />
          <MetricCard
            title="Total Triggered"
            value={metrics.totalTriggered}
            icon={Activity}
            color="var(--accent)"
          />
          <MetricCard
            title="DMs Sent"
            value={metrics.totalSent}
            icon={Send}
            color="var(--success)"
          />
          <MetricCard
            title="Failed"
            value={metrics.totalFailed}
            icon={XCircle}
            color="var(--error)"
          />
        </div>
      )}

      {/* Rules List */}
      {isConnected && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap size={18} className="text-[var(--primary)]" />
            Auto DM Rules
          </h2>

          {rules.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-[var(--primary)]/10">
                <MessageSquare size={28} className="text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Rules Yet</h3>
              <p className="text-sm text-[var(--text-muted)] mb-5 max-w-sm mx-auto">
                Create your first Auto DM rule to start automatically sending messages when users comment keywords on your posts.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                <Plus size={16} className="inline mr-2" />
                Create First Rule
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rules.map((rule: any) => (
                <div key={rule.id} className="card p-5 relative group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white text-sm">{rule.name}</h3>
                      <p className="text-xs text-[var(--text-disabled)] mt-0.5 capitalize">
                        {rule.triggerType} • {rule.matchType} match
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          toggleRule.mutate({
                            ruleId: rule.id,
                            isActive: !rule.isActive,
                          })
                        }
                        className="transition-all"
                        title={rule.isActive ? "Pause rule" : "Activate rule"}
                      >
                        {rule.isActive ? (
                          <ToggleRight size={28} className="text-[var(--success)]" />
                        ) : (
                          <ToggleLeft size={28} className="text-[var(--text-disabled)]" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this rule?")) {
                            deleteRule.mutate({ ruleId: rule.id });
                          }
                        }}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[var(--error)]/10 text-[var(--text-disabled)] hover:text-[var(--error)] transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Keyword badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      #{rule.triggerKeyword}
                    </span>
                    {rule.linkUrl && (
                      <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                        <Link2 size={12} />
                        Link attached
                      </span>
                    )}
                  </div>

                  {/* Response preview */}
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">
                    {rule.responseMessage}
                  </p>

                  {/* Metrics */}
                  {rule.metrics && (
                    <div className="flex items-center gap-4 pt-3 border-t border-[var(--border-subtle)]">
                      <span className="text-xs text-[var(--text-disabled)]">
                        <TrendingUp size={12} className="inline mr-1" />
                        {rule.metrics.timesTriggered} triggered
                      </span>
                      <span className="text-xs text-[var(--success)]">
                        <CheckCircle2 size={12} className="inline mr-1" />
                        {rule.metrics.successfulSends} sent
                      </span>
                      {rule.metrics.failedSends > 0 && (
                        <span className="text-xs text-[var(--error)]">
                          <XCircle size={12} className="inline mr-1" />
                          {rule.metrics.failedSends} failed
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Activity Log */}
      {isConnected && logs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity size={18} className="text-[var(--accent)]" />
            Recent Activity
          </h2>
          <div className="card overflow-hidden">
            <div className="divide-y divide-[var(--border-subtle)]">
              {logs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      log.status === "sent" ? "bg-[var(--success)]" : "bg-[var(--error)]"
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {log.commenterUsername ? `@${log.commenterUsername}` : "Unknown"}
                        <span className="text-[var(--text-disabled)] font-normal"> commented </span>
                        <span className="text-[var(--text-muted)]">&quot;{log.commentText.slice(0, 40)}{log.commentText.length > 40 ? "..." : ""}&quot;</span>
                      </p>
                      <p className="text-xs text-[var(--text-disabled)] mt-0.5">
                        Rule: {log.rule?.name} • {new Date(log.sentAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 ${
                    log.status === "sent"
                      ? "bg-[var(--success)]/10 text-[var(--success)]"
                      : "bg-[var(--error)]/10 text-[var(--error)]"
                  }`}>
                    {log.status === "sent" ? "Sent" : "Failed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Rule Modal */}
      {showCreateModal && (
        <CreateRuleModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            rulesQuery.refetch();
            metricsQuery.refetch();
          }}
        />
      )}
    </div>
  );
}

// ===============================================
// METRIC CARD COMPONENT
// ===============================================
function MetricCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}) {
  return (
    <div className="card p-5 relative overflow-hidden group hover:border-[var(--border-default)] transition-all">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${color}05, transparent)` }} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color }}>
            {title}
          </p>
          <span style={{ color }}>
            <Icon size={16} />
          </span>
        </div>
        <p className="text-2xl font-extrabold text-white tracking-tight">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ===============================================
// CREATE RULE MODAL
// ===============================================
function CreateRuleModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [matchType, setMatchType] = useState<"contains" | "exact">("contains");
  const [message, setMessage] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const createRule = trpc.autoDm.createRule.useMutation({
    onSuccess: () => onCreated(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRule.mutate({
      name,
      triggerKeyword: keyword,
      matchType,
      responseMessage: message,
      linkUrl: linkUrl || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-lg card p-0 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[var(--border-subtle)]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus size={18} className="text-[var(--primary)]" />
            Create Auto DM Rule
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            When someone comments a keyword, they&apos;ll receive your DM automatically.
          </p>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Rule Name */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
              Rule Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g., "Free Guide Offer"'
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-white text-sm placeholder:text-[var(--text-disabled)] focus:border-[var(--primary)]/50 focus:outline-none transition-all"
              required
            />
          </div>

          {/* Trigger Keyword */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
              Trigger Keyword
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--primary)] font-bold text-sm">#</span>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="GUIDE"
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-white text-sm placeholder:text-[var(--text-disabled)] focus:border-[var(--primary)]/50 focus:outline-none transition-all"
                  required
                />
              </div>
              <select
                value={matchType}
                onChange={(e) => setMatchType(e.target.value as "contains" | "exact")}
                className="px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-white text-sm focus:border-[var(--primary)]/50 focus:outline-none transition-all"
              >
                <option value="contains">Contains</option>
                <option value="exact">Exact Match</option>
              </select>
            </div>
          </div>

          {/* Response Message */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
              DM Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hey! Thanks for your interest. Here's your free guide..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-white text-sm placeholder:text-[var(--text-disabled)] focus:border-[var(--primary)]/50 focus:outline-none transition-all resize-none"
              required
            />
            <p className="text-[10px] text-[var(--text-disabled)] mt-1">{message.length}/1000 characters</p>
          </div>

          {/* Link URL (optional) */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
              Link URL <span className="text-[var(--text-disabled)] normal-case">(optional)</span>
            </label>
            <div className="relative">
              <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-disabled)]" />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://your-link.com/guide"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-white text-sm placeholder:text-[var(--text-disabled)] focus:border-[var(--primary)]/50 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-muted)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:text-white hover:bg-[var(--bg-card-hover)] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createRule.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-[var(--primary)]/25 hover:shadow-[var(--primary)]/40 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              {createRule.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Zap size={16} />
              )}
              Create Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
