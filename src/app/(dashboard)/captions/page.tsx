"use client";

import { useState } from "react";
import { trpc } from "@/trpc/react";
import {
  Sparkles,
  Video,
  Camera,
  Briefcase,
  Hash,
  Copy,
  Check,
  Save,
  Zap,
  MessageSquareText,
} from "lucide-react";

const platforms = [
  { id: "Instagram Reels", icon: Camera, color: "rgba(225, 48, 108, 0.15)", borderColor: "rgba(225, 48, 108, 0.3)" },
  { id: "YouTube Shorts", icon: Video, color: "rgba(255, 0, 0, 0.12)", borderColor: "rgba(255, 0, 0, 0.25)" },
  { id: "LinkedIn Post", icon: Briefcase, color: "rgba(0, 119, 181, 0.12)", borderColor: "rgba(0, 119, 181, 0.25)" },
  { id: "Twitter/X", icon: MessageSquareText, color: "rgba(29, 161, 242, 0.12)", borderColor: "rgba(29, 161, 242, 0.25)" },
];

const tones = ["Engaging", "Educational", "Controversial", "Storytelling", "Humorous", "Motivational"];

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
    onSuccess: () => {
      alert("Captions saved!");
    },
  });

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setCaptions([]);

    try {
      const res = await fetch("/api/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          platform,
          tone,
          scriptContent: scriptContent || undefined,
          count: 3,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate captions");

      const data = await res.json();
      setCaptions(data.captions || []);
    } catch (err) {
      console.error(err);
      alert("Failed to generate captions. Check your OpenAI key.");
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
      captions: captions.map((c) => ({
        content: c.content,
        hashtags: c.hashtags,
        variant: c.variant,
      })),
    });
  };

  return (
    <div className="min-h-screen bg-[#06070B] text-white">
      {/* Top Navbar */}
      <header className="border-b border-[var(--border-subtle)] bg-[rgba(6,7,11,0.8)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--gradient-accent)] flex items-center justify-center">
            <Hash size={16} color="white" />
          </div>
          <span className="font-bold text-lg">Caption & Hashtag AI</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Config Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Topic & Script */}
          <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-lg">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-5">
              <Zap size={18} className="text-[var(--accent-light)]" />
              What&apos;s your content about?
            </h2>

            <div className="mb-5">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Topic / Idea
              </label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g. 5 morning habits that changed my life..."
                className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--primary-light)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Script or Context{" "}
                <span className="text-[var(--text-muted)]">(optional — paste your script for better captions)</span>
              </label>
              <textarea
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                placeholder="Paste your video script here for context-aware captions..."
                className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--primary-light)] transition-colors resize-none h-32"
              />
            </div>
          </div>

          {/* Right: Platform & Tone */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-lg">
            <h2 className="font-semibold text-lg mb-5">Settings</h2>

            {/* Platform */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Platform
              </label>
              <div className="flex flex-col gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className="flex items-center gap-3 p-3 rounded-lg text-sm transition-all border"
                    style={{
                      background: platform === p.id ? p.color : "transparent",
                      borderColor: platform === p.id ? p.borderColor : "var(--border-subtle)",
                      color: platform === p.id ? "white" : "var(--text-secondary)",
                    }}
                  >
                    <p.icon size={16} />
                    {p.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Tone
              </label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                      tone === t
                        ? "bg-[rgba(108,71,255,0.15)] border-[var(--primary-light)] text-white"
                        : "bg-transparent border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || isGenerating}
              className="w-full btn btn-accent py-3 rounded-lg flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Sparkles size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Captions
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {captions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-sm text-gradient">
                {captions.length} Caption Variants Generated
              </h2>
              <button
                onClick={handleSaveAll}
                disabled={saveCaptions.isPending}
                className="btn btn-secondary btn-sm flex items-center gap-2"
              >
                <Save size={16} />
                {saveCaptions.isPending ? "Saving..." : "Save All"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {captions.map((caption, idx) => (
                <div
                  key={idx}
                  className="group bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-5 hover:border-[var(--border-default)] transition-all hover:shadow-lg relative"
                >
                  {/* Style Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge text-xs">{caption.style}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      Variant {caption.variant}
                    </span>
                  </div>

                  {/* Caption Content */}
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)] mb-4 whitespace-pre-wrap">
                    {caption.content}
                  </p>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {caption.hashtags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs px-2 py-0.5 rounded-md bg-[rgba(108,71,255,0.08)] text-[var(--primary-light)] border border-[rgba(108,71,255,0.15)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(caption.content, caption.hashtags, idx)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:text-white"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check size={14} className="text-[var(--success)]" />
                        <span className="text-[var(--success)]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy Caption + Hashtags
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isGenerating && captions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(255,107,53,0.1)] border border-[rgba(255,107,53,0.2)] flex items-center justify-center mb-4">
              <Hash size={28} className="text-[var(--accent-light)]" />
            </div>
            <h3 className="heading-sm mb-2">Ready to generate captions</h3>
            <p className="text-[var(--text-muted)] text-sm max-w-md">
              Enter your topic, pick a platform, and let AI generate scroll-stopping captions with
              perfectly curated hashtags.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && captions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 border-4 border-[rgba(255,107,53,0.2)] border-t-[var(--accent)] rounded-full animate-spin mb-4" />
            <p className="text-[var(--text-muted)]">
              Crafting platform-optimized captions...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
