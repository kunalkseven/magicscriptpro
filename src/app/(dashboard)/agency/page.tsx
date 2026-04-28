"use client";

import { trpc } from "@/trpc/react";
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield, 
  ExternalLink,
  Loader2,
  Building2,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { useState } from "react";

export default function AgencyDashboardPage() {
  const { data: agency, isLoading: agencyLoading } = trpc.agency.getAgency.useQuery();
  const { data: pendingScripts, refetch: refetchPending } = trpc.agency.getApprovalPendingScripts.useQuery(
    { agencyId: agency?.id ?? "" },
    { enabled: !!agency?.id }
  );

  const approveMutation = trpc.agency.approveScript.useMutation({
    onSuccess: () => refetchPending(),
  });

  const [activeTab, setActiveTab] = useState<"creators" | "approvals" | "settings">("creators");

  if (agencyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06070B]">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#06070B] p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[rgba(108,71,255,0.05)] border border-[var(--border-subtle)] flex items-center justify-center mb-6">
          <Building2 size={40} className="text-[var(--text-muted)]" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Agency Found</h2>
        <p className="text-[var(--text-muted)] max-w-md mb-8">You haven&apos;t created or joined an agency yet. Upgrade to Agency plan to manage multiple creators.</p>
        <button className="btn btn-primary">Create Agency</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070B] text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Agency Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{agency.name}</h1>
              <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                <Shield size={14} className="text-[var(--primary-light)]" />
                <span>Agency Workspace</span>
                {agency.whiteLabelDomain && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
                    <span className="flex items-center gap-1">
                      {agency.whiteLabelDomain} <ExternalLink size={12} />
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <UserPlus size={18} />
              Add Member
            </button>
            <button className="btn btn-primary">Invite Creator</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] mb-8">
          {[
            { id: "creators", label: "Managed Creators", icon: Users },
            { id: "approvals", label: "Approvals", icon: CheckCircle, badge: pendingScripts?.length },
            { id: "settings", label: "Agency Settings", icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 text-sm font-medium transition-all relative ${
                activeTab === tab.id ? "text-[var(--primary-light)]" : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.badge ? (
                <span className="ml-1 bg-[var(--error)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              ) : null}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary-light)] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "creators" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agency.managedCreators.map((item) => (
                <div key={item.id} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 group hover:border-[var(--primary-subtle)] transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.05)] border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden">
                      {item.creator.user.avatarUrl ? (
                        <img src={item.creator.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Users size={20} className="text-[var(--text-muted)]" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold">{item.creator.user.name ?? "Anonymous Creator"}</p>
                      <p className="text-xs text-[var(--text-muted)]">{item.creator.niche ?? "General Content"}</p>
                    </div>
                    <ChevronRight size={18} className="ml-auto text-[var(--text-muted)]" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[rgba(255,255,255,0.02)] p-3 rounded-xl border border-[var(--border-subtle)]">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-1">Scripts</p>
                      <p className="text-lg font-bold">12</p>
                    </div>
                    <div className="bg-[rgba(255,255,255,0.02)] p-3 rounded-xl border border-[var(--border-subtle)]">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-1">Impact</p>
                      <p className="text-lg font-bold text-[var(--success)]">4.2%</p>
                    </div>
                  </div>

                  <button className="w-full btn btn-secondary text-xs">View Workspace</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "approvals" && (
            <div className="space-y-4">
              {pendingScripts?.length === 0 ? (
                <div className="py-20 text-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] border-dashed rounded-2xl">
                  <CheckCircle size={40} className="mx-auto text-[var(--success)] opacity-20 mb-4" />
                  <h3 className="font-bold">All caught up!</h3>
                  <p className="text-[var(--text-muted)] text-sm">No scripts are currently pending approval.</p>
                </div>
              ) : (
                pendingScripts?.map((wf) => (
                  <div key={wf.id} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[rgba(108,71,255,0.1)] flex items-center justify-center text-[var(--primary-light)] mt-1">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{wf.script.topic}</h3>
                        <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {wf.script.creator.user.name}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
                          <span>{wf.script.platform}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => approveMutation.mutate({ workflowId: wf.id, status: "rejected" })}
                        className="btn btn-secondary border-red-500/20 hover:bg-red-500/10 hover:text-red-500 text-sm flex items-center gap-2"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                      <button 
                        onClick={() => approveMutation.mutate({ workflowId: wf.id, status: "approved" })}
                        className="btn btn-primary text-sm flex items-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button className="p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] hover:border-[var(--primary-light)] transition-all">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Agency Configuration</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Agency Name</label>
                  <input 
                    type="text" 
                    defaultValue={agency.name}
                    className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">White-label Domain</label>
                  <input 
                    type="text" 
                    placeholder="e.g. content.myagency.com"
                    defaultValue={agency.whiteLabelDomain ?? ""}
                    className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] transition-all"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-2 italic">Point your CNAME record to creatorai.pro to enable custom branding.</p>
                </div>
                <div className="pt-4">
                  <button className="btn btn-primary w-full md:w-auto px-10">Save Settings</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
