"use client";

import { trpc } from "@/trpc/react";
import { 
  Users, UserPlus, CheckCircle, XCircle, Clock, Shield, ExternalLink,
  Loader2, Building2, ChevronRight, MessageSquare, Target, Sparkles, Bolt,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
};

const item = {
  hidden: { y: 14, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease } }
};

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
      <div className="flex flex-col items-center justify-center py-28 card bg-transparent border-dashed">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-[var(--primary)]/20 rounded-full animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-0 w-16 h-16 border-t-2 border-[var(--primary)] rounded-full animate-spin" />
          <Building2 className="absolute inset-0 m-auto text-[var(--primary)] animate-pulse" size={24} />
        </div>
        <p className="mt-6 text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest">Loading agency data...</p>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center card bg-transparent border-dashed">
        <div className="w-20 h-20 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center mb-6">
          <Building2 size={32} className="text-[var(--text-muted)]" />
        </div>
        <h2 className="heading-sm text-white mb-2">No Agency Found</h2>
        <p className="body-md max-w-sm mb-8">You haven&apos;t created an agency yet. Manage multiple creators from one dashboard.</p>
        <button className="btn btn-primary">
          <Sparkles size={18} />
          Create Agency
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 flex-shrink-0">
            <Building2 size={28} className="text-white" />
          </div>
          <div>
            <div className="badge mb-3">
              <Shield size={12} />
              Agency HQ
            </div>
            <h1 className="heading-lg text-white leading-tight">
              {agency.name}
            </h1>
            {agency.whiteLabelDomain && (
              <p className="text-[var(--primary-light)] text-xs font-bold flex items-center gap-1.5 mt-1.5 uppercase tracking-widest">
                {agency.whiteLabelDomain} <ExternalLink size={12} />
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0 mt-4 sm:mt-0">
          <button className="btn btn-secondary px-4">
            <UserPlus size={16} className="text-[var(--primary)]" />
            <span className="ml-1">Add Member</span>
          </button>
          <button className="btn btn-primary px-5">
            <Users size={16} />
            <span className="ml-1">Invite Creator</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-1.5">
        {[
          { id: "creators", label: "Creators", icon: Users },
          { id: "approvals", label: "Approvals", icon: CheckCircle, badge: pendingScripts?.length },
          { id: "settings", label: "Settings", icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2.5 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all rounded-lg flex-1 justify-center ${
              activeTab === tab.id ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-card-hover)]"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.badge ? (
              <span className="bg-[var(--accent)] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">{tab.badge}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} variants={container} initial="hidden" animate="show"
          exit={{ opacity: 0, y: -10 }} className="space-y-5">
          
          {activeTab === "creators" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {agency.managedCreators.map((item_creator) => (
                <motion.div key={item_creator.id} variants={item}
                  className="card group hover:border-[var(--border-default)] transition-all overflow-hidden relative" style={{ padding: '24px' }}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 blur-[50px] pointer-events-none group-hover:bg-[var(--primary)]/10 transition-all" />
                  
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner shadow-black/20">
                      {item_creator.creator.user.avatarUrl ? (
                        <img src={item_creator.creator.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Users size={24} className="text-[var(--text-disabled)]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-extrabold text-white truncate group-hover:text-[var(--primary-light)] transition-colors">{item_creator.creator.user.name ?? "Unknown"}</p>
                      <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest mt-0.5">{item_creator.creator.niche ?? "General"}</p>
                    </div>
                    <ChevronRight size={18} className="text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                    <div className="bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border-subtle)] shadow-inner shadow-black/10">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mb-1.5">Scripts</p>
                      <p className="text-2xl font-extrabold text-white tracking-tight">12</p>
                    </div>
                    <div className="bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border-subtle)] shadow-inner shadow-black/10">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mb-1.5">Engagement</p>
                      <p className="text-2xl font-extrabold text-[var(--success)] tracking-tight">+4.2%</p>
                    </div>
                  </div>

                  <button className="btn btn-secondary w-full py-3 text-xs bg-[var(--bg-elevated)] hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/30 hover:text-[var(--primary-light)] relative z-10">
                    View Profile
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "approvals" && (
            <div className="space-y-4">
              {pendingScripts?.length === 0 ? (
                <div className="py-20 text-center card bg-transparent border-dashed">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--success)]/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-[var(--success)]" />
                  </div>
                  <h3 className="heading-sm text-white mb-2">All clear</h3>
                  <p className="body-md">No pending approvals right now.</p>
                </div>
              ) : (
                pendingScripts?.map((wf) => (
                  <motion.div key={wf.id} variants={item}
                    className="card flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:border-[var(--border-default)] transition-all" style={{ padding: '24px' }}>
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{wf.script.topic}</h3>
                        <div className="flex items-center gap-4 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                          <span className="text-[var(--accent)] flex items-center gap-1.5 bg-[var(--accent)]/10 px-2.5 py-1 rounded-md"><Users size={12} /> {wf.script.creator.user.name}</span>
                          <span className="flex items-center gap-1.5 bg-[var(--bg-elevated)] px-2.5 py-1 rounded-md border border-[var(--border-subtle)]"><Target size={12} /> {wf.script.platform}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-shrink-0 mt-4 lg:mt-0">
                      <button 
                        onClick={() => approveMutation.mutate({ workflowId: wf.id, status: "rejected" })}
                        className="btn btn-secondary px-5 py-3 hover:bg-[var(--error)]/10 hover:border-[var(--error)]/30 hover:text-[var(--error)] text-[var(--error)] transition-all bg-[var(--bg-elevated)]"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => approveMutation.mutate({ workflowId: wf.id, status: "approved" })}
                        className="btn btn-primary px-6 py-3"
                      >
                        Approve
                      </button>
                      <button className="btn btn-secondary p-3 bg-[var(--bg-elevated)]">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <motion.div variants={item} className="max-w-2xl card" style={{ padding: '32px' }}>
              <h3 className="heading-sm text-white mb-8 flex items-center gap-3">
                <Shield className="text-[var(--primary)]" size={20} />
                Agency Settings
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Agency Name</label>
                  <input 
                    type="text" 
                    defaultValue={agency.name}
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3.5 outline-none focus:border-[var(--primary)]/50 text-sm font-bold text-white transition-all shadow-inner shadow-black/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">White-Label Domain</label>
                  <input 
                    type="text" 
                    placeholder="e.g. content.myagency.com"
                    defaultValue={agency.whiteLabelDomain ?? ""}
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-3.5 outline-none focus:border-[var(--primary)]/50 text-sm font-bold text-white transition-all shadow-inner shadow-black/20"
                  />
                  <p className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-2">Point CNAME to <span className="text-[var(--primary-light)] bg-[var(--primary)]/10 px-2 py-0.5 rounded ml-1">nodes.creatorai.pro</span></p>
                </div>
                <div className="pt-4">
                  <button className="btn btn-primary px-6 py-3">
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
