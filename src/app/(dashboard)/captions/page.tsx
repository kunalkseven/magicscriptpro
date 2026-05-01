"use client";

import { useState } from "react";
import { trpc } from "@/trpc/react";
import {
  Sparkles, Video, Camera, Briefcase, Hash, Copy, Check, Save,
  MessageSquareText, Bolt, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const platforms = [
  { id: "Instagram Reels", icon: Camera, color: "#E1306C" },
  { id: "YouTube Shorts", icon: Video, color: "#FF0000" },
  { id: "LinkedIn Post", icon: Briefcase, color: "#0077B5" },
  { id: "Twitter/X", icon: MessageSquareText, color: "#1DA1F2" },
];

const tones = ["Engaging", "Educational", "Controversial", "Storytelling", "Humorous", "Motivational"];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

type CaptionVariant = {
  content: string;
  hashtags: string[];
  variant: number;
  style: string;
};

export default function CaptionGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram Reels");
  const [tone, setTone] = useState("Engaging");
  const [scriptContent, setScriptContent] = useState("");
  const [captions, setCaptions] = useState<CaptionVariant[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const { data: user } = trpc.user.getCurrentUser.useQuery();

  const saveCaptions = trpc.caption.saveCaptions.useMutation({
    onSuccess: () => {},
  });

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setCaptions([]);
    try {
      const res = await fetch("/api/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone, scriptContent: scriptContent || undefined, count: 3 }),
      });
      if (!res.ok) throw new Error("Failed to generate captions");
      const data = await res.json();
      setCaptions(data.captions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, hashtags: string[], idx: number) => {
    const fullText = `${text}\n\n${hashtags.map((h) => `#${h}`).join(" ")}`;
    navigator.clipboard.writeText(fullText);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSaveAll = () => {
    saveCaptions.mutate({
      platform,
      captions: captions.map((c) => ({ content: c.content, hashtags: c.hashtags, variant: c.variant })),
    });
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <div className="badge mb-4 border-[var(--accent)]/30 text-[var(--accent-light)] bg-[var(--accent)]/10">
          <Hash size={14} />
          Hook Generator
        </div>
        <h1 className="heading-lg text-white mb-2">
          AI <span className="text-gradient-accent">Captions</span>
        </h1>
        <p className="body-md">Generate scroll-stopping hooks and curated hashtags for every platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Config */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
          <div className="card" style={{ padding: '24px' }}>
            <h2 className="heading-sm text-white mb-6 flex items-center gap-2">
              <Bolt className="text-[var(--accent)]" size={20} />
              Settings
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Topic</label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="E.g. 5 productivity secrets..."
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-3.5 text-sm text-white placeholder:text-[var(--text-disabled)] focus:outline-none focus:border-[var(--accent)]/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Context (Optional)</label>
                <textarea
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  placeholder="Paste script for context-aware hooks..."
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-3.5 text-sm text-white placeholder:text-[var(--text-disabled)] focus:outline-none focus:border-[var(--accent)]/50 transition-all resize-none h-24 custom-scrollbar"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Platform</label>
                <div className="space-y-2">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`flex items-center justify-between w-full p-3.5 rounded-xl text-sm font-semibold transition-all border ${
                        platform === p.id 
                          ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" 
                          : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-default)]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${platform === p.id ? "bg-white/20" : "bg-white/5"}`}>
                          <p.icon size={16} />
                        </div>
                        {p.id}
                      </div>
                      <ChevronRight size={16} className={platform === p.id ? "opacity-100" : "opacity-0"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {tones.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
                        tone === t
                          ? "bg-[var(--accent)]/15 border-[var(--accent)]/40 text-white"
                          : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-default)]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || isGenerating}
                className="btn btn-accent w-full mt-4 flex items-center justify-center"
              >
                {isGenerating ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Generating...</>
                ) : (
                  <><Sparkles size={18} /> Generate Captions</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          <AnimatePresence mode="wait">
            {captions.length > 0 ? (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="heading-sm text-white flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[var(--accent)] rounded-full" />
                    Generated Captions
                  </h2>
                  <button onClick={handleSaveAll} disabled={saveCaptions.isPending}
                    className="btn btn-secondary btn-sm">
                    <Save size={14} className="text-[var(--accent)] mr-1" />
                    {saveCaptions.isPending ? "Saving..." : "Save All"}
                  </button>
                </div>

                {captions.map((caption, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, duration: 0.5, ease }}
                    className="card" style={{ padding: '24px' }}>
                    <div className="flex items-center justify-between mb-5">
                      <span className="badge border-[var(--accent)]/30 text-[var(--accent-light)] bg-[var(--accent)]/10">{caption.style}</span>
                      <span className="text-[10px] font-bold text-[var(--text-disabled)] uppercase tracking-wider">Variant {caption.variant}</span>
                    </div>
                    <p className="body-md text-white/90 mb-6 whitespace-pre-wrap">{caption.content}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {caption.hashtags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-xs font-semibold px-3 py-1 rounded-md bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-white hover:border-[var(--border-default)] cursor-pointer transition-colors">#{tag}</span>
                      ))}
                    </div>
                    <button onClick={() => handleCopy(caption.content, caption.hashtags, idx)}
                      className="btn btn-secondary w-full flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5">
                      {copiedIdx === idx ? (<><Check size={18} className="text-[var(--success)]" /><span className="text-[var(--success)]">Copied!</span></>) : (<><Copy size={18} className="text-[var(--accent)]" /> Copy Caption</>)}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-28 text-center card bg-transparent border-dashed">
                <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mb-6">
                  <Hash size={32} className="text-[var(--accent)]" />
                </div>
                <h3 className="heading-sm text-white mb-2">Ready to generate</h3>
                <p className="body-md max-w-sm">Enter a topic and pick a platform to generate scroll-stopping captions with curated hashtags.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
