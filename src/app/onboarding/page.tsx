"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { trpc } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  Video, 
  Briefcase, 
  Camera, 
  Mic, 
  CheckCircle2, 
  MonitorPlay,
  ChevronLeft,
  Target,
  Globe,
  Zap,
  Building2,
  Cpu
} from "lucide-react";
import Link from "next/link";

const niches = [
  "Tech & Gadgets", "Finance & Crypto", "Comedy & Skits", 
  "Education", "Lifestyle & Vlogs", "Fitness & Health", 
  "Business & Motivation", "Other"
];

const platforms = [
  { id: "youtube", label: "YouTube", icon: Video, color: "#FF0000" },
  { id: "instagram", label: "Instagram", icon: Camera, color: "#E1306C" },
  { id: "linkedin", label: "LinkedIn", icon: Briefcase, color: "#0A66C2" },
  { id: "twitter", label: "Twitter/X", icon: MonitorPlay, color: "#1DA1F2" },
];

const languages = [
  { id: "Hinglish", label: "Hinglish", desc: "Mix of Hindi & English (Most Viral)" },
  { id: "Hindi", label: "Pure Hindi", desc: "Regional audience focus" },
  { id: "English", label: "English", desc: "Global audience focus" },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [language, setLanguage] = useState("");

  const completeOnboarding = trpc.user.completeOnboarding.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const handleNext = () => {
    if (step === 1 && !niche) return;
    if (step === 2 && selectedPlatforms.length === 0) return;
    
    if (step === 3) {
      if (!language || !user) return;
      completeOnboarding.mutate({
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName,
        avatarUrl: user.imageUrl,
        niche,
        platforms: selectedPlatforms,
        languagePref: language,
      });
      return;
    }
    setStep((s) => s + 1);
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-app)] text-white">
         <div className="w-16 h-16 border-2 border-[var(--primary)]/10 rounded-full animate-spin border-t-[var(--primary)]" />
         <p className="mt-6 text-[var(--text-disabled)] text-[10px] font-black uppercase tracking-[0.3em]">Booting Synthesis Core...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background Mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[var(--primary)]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[var(--accent)]/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Brand Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
        className="mb-16 relative z-10 flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl shadow-[var(--primary)]/20" style={{ background: 'linear-gradient(to bottom right, var(--primary), var(--accent))' }}>
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            Creator<span className="text-[var(--primary)]">AI</span> Pro
          </span>
        </div>
        <div className="flex items-center gap-4">
           {[1, 2, 3].map((s) => (
             <div key={s} className="flex items-center gap-2">
                <div className={`h-1.5 transition-all duration-700 rounded-full ${step >= s ? "w-8 bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]" : "w-1.5 bg-white/10"}`} />
             </div>
           ))}
        </div>
      </motion.div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Main Onboarding Console */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {completeOnboarding.isPending ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10"
              >
                <div className="relative mb-10">
                  <div className="w-24 h-24 border-2 border-[var(--primary)]/10 rounded-full animate-[spin_4s_linear_infinite]" />
                  <div className="absolute inset-0 w-24 h-24 border-t-2 border-[var(--primary)] rounded-full animate-spin" />
                  <div className="absolute inset-4 w-16 h-16 border-b-2 border-[var(--accent)] rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                  <Cpu className="absolute inset-0 m-auto text-[var(--primary)] animate-pulse" size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase tracking-[0.1em]">Synthesizing Identity</h3>
                <p className="text-[var(--text-disabled)] text-sm font-bold max-w-xs text-center">Calibrating Voice DNA and platform resonance patterns...</p>
              </motion.div>
            ) : (
              <>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, ease }}
                  >
                    <div className="flex items-center gap-4 mb-10">
                       <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">
                          <Target size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.3em]">Protocol 01</p>
                          <h2 className="text-xl font-black text-white uppercase tracking-tight">Signal Sector</h2>
                       </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white leading-[0.9]">What&apos;s your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">niche?</span></h1>
                    <p className="text-[var(--text-muted)] mb-12 text-lg font-bold">This calibrates the AI signal to your industry trends.</p>

                    <div className="grid grid-cols-2 gap-3 mb-12">
                      {niches.map((n) => (
                        <button
                          key={n}
                          onClick={() => setNiche(n)}
                          className={`group relative overflow-hidden py-5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border text-left ${
                            niche === n 
                              ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-2xl shadow-[var(--primary)]/40" 
                              : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-default)]"
                          }`}
                        >
                          <span className="relative z-10">{n}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, ease }}
                  >
                    <div className="flex items-center gap-4 mb-10">
                       <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
                          <Globe size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.3em]">Protocol 02</p>
                          <h2 className="text-xl font-black text-white uppercase tracking-tight">Network Range</h2>
                       </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white leading-[0.9]">Where do you <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--primary)]">post?</span></h1>
                    <p className="text-[var(--text-muted)] mb-12 text-lg font-bold">Select target networks for optimized content synthesis.</p>

                    <div className="space-y-3 mb-12">
                      {platforms.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => togglePlatform(p.id)}
                          className={`group w-full flex items-center justify-between p-5 rounded-2xl transition-all border ${
                            selectedPlatforms.includes(p.id)
                              ? "bg-[var(--bg-elevated)] border-[var(--accent)] shadow-2xl shadow-[var(--accent)]/10"
                              : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-default)]"
                          }`}
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedPlatforms.includes(p.id) ? "bg-white/10" : "bg-white/5"}`}>
                              <p.icon size={24} color={selectedPlatforms.includes(p.id) ? p.color : "rgba(255,255,255,0.2)"} />
                            </div>
                            <span className={`text-lg font-black uppercase tracking-widest ${selectedPlatforms.includes(p.id) ? "text-white" : "text-[var(--text-disabled)]"}`}>
                              {p.label}
                            </span>
                          </div>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                            selectedPlatforms.includes(p.id) ? "border-[var(--accent)] bg-[var(--accent)] scale-110" : "border-[var(--border-subtle)]"
                          }`}>
                            {selectedPlatforms.includes(p.id) && <CheckCircle2 size={16} className="text-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, ease }}
                  >
                    <div className="flex items-center gap-4 mb-10">
                       <div className="w-12 h-12 rounded-2xl bg-[var(--success)]/10 border border-[var(--success)]/20 flex items-center justify-center text-[var(--success)]">
                          <Mic size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.3em]">Protocol 03</p>
                          <h2 className="text-xl font-black text-white uppercase tracking-tight">Voice Language</h2>
                       </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white leading-[0.9]">Select your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--success)] to-[var(--primary)]">vibe.</span></h1>
                    <p className="text-[var(--text-muted)] mb-12 text-lg font-bold">Natively trained for the Indian creative economy.</p>

                    <div className="space-y-4 mb-12">
                      {languages.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => setLanguage(l.id)}
                          className={`group w-full text-left p-6 rounded-[2rem] transition-all border ${
                            language === l.id
                              ? "bg-[var(--bg-elevated)] border-[var(--success)] shadow-2xl shadow-[var(--success)]/10"
                              : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-default)]"
                          }`}
                        >
                          <div className={`text-xl font-black uppercase tracking-widest mb-2 ${language === l.id ? "text-white" : "text-[var(--text-disabled)]"}`}>
                            {l.label}
                          </div>
                          <div className={`text-xs font-bold ${language === l.id ? "text-white/60" : "text-white/10"}`}>
                            {l.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-10 border-t border-[var(--border-subtle)]">
                  <button 
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-disabled)] hover:text-white transition-all ${step === 1 ? 'invisible' : ''}`}
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={
                      (step === 1 && !niche) || 
                      (step === 2 && selectedPlatforms.length === 0) || 
                      (step === 3 && !language)
                    }
                    className="group relative overflow-hidden px-12 py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-white shadow-2xl shadow-[var(--primary)]/40 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))' }}
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 uppercase tracking-widest text-xs">{step === 3 ? "Complete Synthesis" : "Continue"}</span>
                    <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer info */}
        <p className="mt-10 text-center text-[10px] font-black text-[var(--text-disabled)] uppercase tracking-[0.4em]">Encrypted Session • Neural Bridge v2.4.0</p>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border-subtle);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
