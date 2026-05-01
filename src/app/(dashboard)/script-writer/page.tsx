"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { trpc } from "@/trpc/react";
import { ScriptEditor } from "@/components/editor/ScriptEditor";
import { Sparkles, Video, Camera, Briefcase, Send, LayoutTemplate, Zap, Bolt, Wand2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const platforms = [
  { id: "YouTube Shorts", icon: Video, color: "#FF0000" },
  { id: "Instagram Reels", icon: Camera, color: "#E1306C" },
  { id: "LinkedIn Post", icon: Briefcase, color: "#0077B5" },
];

const tones = ["Engaging", "Educational", "Controversial", "Storytelling", "Humorous"];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ScriptWriterPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram Reels");
  const [tone, setTone] = useState("Engaging");

  const { data: user } = trpc.user.getCurrentUser.useQuery();
  
  const saveScript = trpc.script.saveScript.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const { messages, sendMessage, status, regenerate } = useChat();

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    sendMessage({
      text: `Write a script about: ${topic}`,
    }, {
      body: {
        topic,
        platform,
        tone,
        language: user?.creatorProfile?.languagePref || "Hinglish",
      }
    });
  };

  const handleSave = (content: string) => {
    saveScript.mutate({
      topic,
      platform,
      tone,
      content,
    });
  };

  const lastMessage = messages.filter(m => m.role === "assistant").pop();
  const latestAssistantMessage = lastMessage?.parts
    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
    ?.map(p => p.text)
    ?.join("") || "";

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="badge mb-4">
            <Wand2 size={14} />
            Creative Engine
          </div>
          <h1 className="heading-lg text-white mb-2">
            Script <span className="text-gradient">Architect</span>
          </h1>
          <p className="body-md">
            Translate your vision into a viral narrative with our fine-tuned AI model.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
          <div className="card" style={{ padding: '24px' }}>
            <h2 className="heading-sm text-white mb-6 flex items-center gap-2.5">
              <LayoutTemplate className="text-[var(--primary)]" size={20} />
              Configuration
            </h2>
            
            <div className="space-y-6">
              {/* Topic Input */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">The Core Idea</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="E.g. 3 secret AI tools for creators..."
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-4 text-sm text-white placeholder:text-[var(--text-disabled)] focus:outline-none focus:border-[var(--primary)]/50 transition-all resize-none h-28 custom-scrollbar"
                />
              </div>

              {/* Platform Selection */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Platform</label>
                <div className="space-y-2">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`flex items-center justify-between w-full p-3.5 rounded-xl text-sm font-bold transition-all border ${
                        platform === p.id 
                          ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20" 
                          : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-default)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${platform === p.id ? "bg-white/20" : "bg-white/5"}`}>
                          <p.icon size={16} />
                        </div>
                        {p.id}
                      </div>
                      <ChevronRight size={16} className={`transition-all ${platform === p.id ? "opacity-100" : "opacity-0"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Selection */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Voice & Tone</label>
                <div className="relative">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-4 text-sm font-bold text-white focus:outline-none focus:border-[var(--primary)]/50 transition-all appearance-none cursor-pointer"
                  >
                    {tones.map((t) => (
                      <option key={t} value={t} className="bg-[var(--bg-card)]">{t}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                    <ChevronRight size={18} className="rotate-90" />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || isLoading}
                className="btn btn-primary w-full mt-4 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Bolt size={18} />
                    <span>Generate Script</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tips Card */}
          <div className="card" style={{ padding: '20px', background: 'var(--bg-elevated)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <Sparkles className="text-[var(--accent)]" size={18} />
              <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Pro Tip</h3>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              For better results, include your target audience and a specific "hook" idea in the topic input.
            </p>
          </div>
        </div>

        {/* Right: Editor */}
        <div className="lg:col-span-8 min-h-[600px] min-w-0">
          <ScriptEditor 
            content={latestAssistantMessage} 
            isGenerating={isLoading} 
            onSave={handleSave}
            onRegenerate={() => regenerate()}
          />
        </div>
      </div>
    </div>
  );
}
