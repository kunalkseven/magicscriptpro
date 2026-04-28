"use client";

import { trpc } from "@/trpc/react";
import { 
  Hash, 
  Copy, 
  Check, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  ExternalLink,
  Loader2,
  Sparkles
} from "lucide-react";
import { useState } from "react";

export default function SavedCaptionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const { data: captions, isLoading, refetch } = trpc.caption.getCaptions.useQuery();

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
    <div className="min-h-screen bg-[#06070B] text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Saved Captions</h1>
            <p className="text-[var(--text-muted)]">Your library of AI-generated hooks and captions.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search captions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[var(--primary)] transition-all w-full md:w-64"
              />
            </div>
            <button className="btn btn-secondary flex items-center gap-2">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[var(--primary)] mb-4" size={40} />
            <p className="text-[var(--text-muted)]">Loading your library...</p>
          </div>
        ) : filteredCaptions?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-[rgba(108,71,255,0.05)] border border-[var(--border-subtle)] flex items-center justify-center mb-6">
              <Hash size={40} className="text-[var(--text-muted)]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No captions saved yet</h2>
            <p className="text-[var(--text-muted)] max-w-md mb-8">Generate high-converting captions with AI and they will appear here for easy access.</p>
            <a href="/captions" className="btn btn-primary flex items-center gap-2">
              <Sparkles size={18} />
              Generate Captions
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaptions?.map((caption) => (
              <div key={caption.id} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 flex flex-col h-full group hover:border-[var(--primary-subtle)] transition-all shadow-lg hover:shadow-[var(--primary-subtle)]/5">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    caption.platform === 'Instagram Reels' ? 'bg-pink-500/10 text-pink-500' :
                    caption.platform === 'YouTube Shorts' ? 'bg-red-500/10 text-red-500' :
                    caption.platform === 'LinkedIn Post' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-slate-500/10 text-slate-500'
                  }`}>
                    {caption.platform}
                  </span>
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <Calendar size={14} />
                    <span className="text-xs">{new Date(caption.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-6 flex-grow whitespace-pre-wrap line-clamp-6 group-hover:line-clamp-none transition-all duration-300">
                  {caption.content}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {caption.hashtags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] px-2 py-0.5 rounded-md text-[var(--text-muted)]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-[var(--border-subtle)]">
                  <button 
                    onClick={() => handleCopy(caption.content, caption.hashtags, caption.id)}
                    className="flex-1 btn btn-secondary flex items-center justify-center gap-2 text-xs"
                  >
                    {copiedId === caption.id ? (
                      <>
                        <Check size={14} className="text-[var(--success)]" />
                        <span className="text-[var(--success)]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                  <button className="p-2.5 rounded-xl border border-[var(--border-subtle)] hover:bg-red-500/10 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
