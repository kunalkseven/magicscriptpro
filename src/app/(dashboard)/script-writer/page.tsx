"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { trpc } from "@/trpc/react";
import { ScriptEditor } from "@/components/editor/ScriptEditor";
import { Sparkles, Video, Camera, Briefcase, Send, LayoutTemplate } from "lucide-react";
import { useRouter } from "next/navigation";

const platforms = [
  { id: "YouTube Shorts", icon: Video },
  { id: "Instagram Reels", icon: Camera },
  { id: "LinkedIn Post", icon: Briefcase },
];

const tones = ["Engaging", "Educational", "Controversial", "Storytelling", "Humorous"];

export default function ScriptWriterPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram Reels");
  const [tone, setTone] = useState("Engaging");

  // Fetch user profile to get language preference
  const { data: user } = trpc.user.getCurrentUser.useQuery();
  
  // tRPC mutation to save the final script
  const saveScript = trpc.script.saveScript.useMutation({
    onSuccess: () => {
      alert("Script saved successfully!");
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

  // Get the latest AI response content
  const lastMessage = messages.filter(m => m.role === "assistant").pop();
  const latestAssistantMessage = lastMessage?.parts
    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
    ?.map(p => p.text)
    ?.join("") || "";

  return (
    <div className="min-h-screen bg-[#06070B] text-white">
      {/* Top Navbar */}
      <header className="border-b border-[var(--border-subtle)] bg-[rgba(6,7,11,0.8)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--gradient-primary)] flex items-center justify-center">
            <Sparkles size={16} color="white" />
          </div>
          <span className="font-bold text-lg">AI Script Writer</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar: Configuration */}
        <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-lg">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-5">
              <LayoutTemplate size={18} className="text-[var(--primary-light)]" />
              Script Settings
            </h2>

            {/* Topic Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Topic / Idea</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g. 3 secret AI tools nobody is talking about..."
                className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--primary-light)] transition-colors resize-none h-24"
              />
            </div>

            {/* Platform Selection */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Platform</label>
              <div className="flex flex-col gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-colors border ${
                      platform === p.id 
                        ? "bg-[rgba(108,71,255,0.1)] border-[var(--primary-light)] text-white" 
                        : "bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
                    }`}
                  >
                    <p.icon size={16} />
                    {p.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--primary-light)] appearance-none"
              >
                {tones.map((t) => (
                  <option key={t} value={t} className="bg-[#111218]">{t}</option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || isLoading}
              className="w-full btn btn-primary py-3 rounded-lg flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Sparkles size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Write Script
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Area: Editor */}
        <div className="flex-1 h-full min-h-[500px]">
          <ScriptEditor 
            content={latestAssistantMessage} 
            isGenerating={isLoading} 
            onSave={handleSave}
            onRegenerate={() => regenerate()}
          />
        </div>

      </main>
    </div>
  );
}
