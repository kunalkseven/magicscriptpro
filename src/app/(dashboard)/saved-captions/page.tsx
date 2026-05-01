"use client";

import { trpc } from "@/trpc/react";
import { 
  Hash, Copy, Check, Trash2, Search, Filter,
  Calendar, Loader2, Sparkles, Bookmark,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
};

const item = {
  hidden: { y: 14, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease } }
};

export default function SavedCaptionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const { data: captions, isLoading } = trpc.caption.getCaptions.useQuery();

  const handleCopy = (content: string, hashtags: string[], id: string) => {
    const fullText = `${content}\n\n${hashtags.map(h => `#${h}`).join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCaptions = captions?.filter(c => 
    c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="badge mb-4 border-[#EC4899]/30 text-[#EC4899] bg-[#EC4899]/10">
            <Bookmark size={14} />
            Archive
          </div>
          <h1 className="heading-lg text-white mb-2">
            Saved <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[var(--primary)]">Captions</span>
          </h1>
          <p className="body-md">Your curated library of scroll-stopping hooks and hashtags.</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#EC4899]/50 transition-all w-48 text-sm text-white placeholder:text-[var(--text-disabled)] shadow-inner shadow-black/20"
            />
          </div>
          <button className="btn btn-secondary h-[46px] px-4">
            <Filter size={16} className="text-[#EC4899]" />
            <span className="text-sm font-semibold ml-1">Filter</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-28 card bg-transparent border-dashed">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-[#EC4899]/20 rounded-full animate-[spin_3s_linear_infinite]" />
              <div className="absolute inset-0 w-16 h-16 border-t-2 border-[#EC4899] rounded-full animate-spin" />
              <Loader2 className="absolute inset-0 m-auto text-[#EC4899] animate-spin" size={24} />
            </div>
            <p className="mt-6 text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest">Loading archive...</p>
          </motion.div>
        ) : filteredCaptions?.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-28 text-center card bg-transparent border-dashed">
            <div className="w-20 h-20 rounded-2xl bg-[#EC4899]/10 border border-[#EC4899]/20 flex items-center justify-center mb-6">
              <Hash size={32} className="text-[#EC4899]" />
            </div>
            <h3 className="heading-sm text-white mb-2">Archive empty</h3>
            <p className="body-md max-w-sm mb-8">
              Generate captions with AI and save them here for quick access.
            </p>
            <Link href="/captions" className="btn btn-primary shadow-[#EC4899]/20" style={{ background: 'linear-gradient(135deg, #EC4899 0%, var(--primary) 100%)' }}>
              <Sparkles size={18} />
              Generate Captions
            </Link>
          </motion.div>
        ) : (
          <motion.div key="grid" variants={container} initial="hidden" animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCaptions?.map((caption) => (
              <motion.div key={caption.id} variants={item}
                className="card flex flex-col h-full hover:border-[var(--border-default)] transition-all p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EC4899]/5 blur-[50px] pointer-events-none group-hover:bg-[#EC4899]/10 transition-all" />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                    caption.platform === 'Instagram Reels' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                    caption.platform === 'YouTube Shorts' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    caption.platform === 'LinkedIn Post' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                  }`}>
                    {caption.platform}
                  </span>
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest">
                    <Calendar size={12} />
                    {new Date(caption.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Content */}
                <p className="body-md text-white/90 leading-relaxed mb-5 flex-grow whitespace-pre-wrap line-clamp-4 transition-all relative z-10">
                  {caption.content}
                </p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                  {caption.hashtags.slice(0, 5).map((tag, idx) => (
                    <span key={idx} className="text-[11px] font-bold uppercase tracking-wider bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-2.5 py-1 rounded-md text-[var(--text-muted)]">
                      #{tag}
                    </span>
                  ))}
                  {caption.hashtags.length > 5 && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-disabled)] px-2 py-1">+{caption.hashtags.length - 5}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-5 border-t border-[var(--border-subtle)] relative z-10">
                  <button 
                    onClick={() => handleCopy(caption.content, caption.hashtags, caption.id)}
                    className="btn btn-secondary flex-1 py-2.5 text-xs bg-[var(--bg-elevated)]"
                  >
                    {copiedId === caption.id ? (
                      <><Check size={16} className="text-[var(--success)]" /><span className="text-[var(--success)] font-bold">Copied!</span></>
                    ) : (
                      <><Copy size={16} className="text-[#EC4899]" /><span className="font-bold">Copy</span></>
                    )}
                  </button>
                  <button className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:bg-[var(--error)]/10 hover:border-[var(--error)]/30 hover:text-[var(--error)] text-[var(--text-muted)] transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
