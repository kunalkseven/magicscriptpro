"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { trpc } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Video, Briefcase, Camera, Mic, CheckCircle2, MonitorPlay } from "lucide-react";

const niches = [
  "Tech & Gadgets", "Finance & Crypto", "Comedy & Skits", 
  "Education", "Lifestyle & Vlogs", "Fitness & Health", 
  "Business & Motivation", "Other"
];

const platforms = [
  { id: "youtube", label: "YouTube", icon: Video, color: "#FF0000" },
  { id: "instagram", label: "Instagram", icon: Camera, color: "#E4405F" },
  { id: "linkedin", label: "LinkedIn", icon: Briefcase, color: "#0A66C2" },
  { id: "twitter", label: "Twitter/X", icon: MonitorPlay, color: "#1DA1F2" }, // Using MonitorPlay as generic
];

const languages = [
  { id: "Hinglish", label: "Hinglish", desc: "Mix of Hindi & English (Most Viral)" },
  { id: "Hindi", label: "Pure Hindi", desc: "Regional audience focus" },
  { id: "English", label: "English", desc: "Global audience focus" },
];

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
      
      // Submit the data
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
    return <div className="min-h-screen flex items-center justify-center bg-[#06070B] text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#06070B] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--primary)] blur-[120px] opacity-20" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--accent)] blur-[120px] opacity-20" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-[var(--text-muted)] mb-3 font-medium">
            <span>Step {step} of 3</span>
            <span>{step === 1 ? "Your Niche" : step === 2 ? "Platforms" : "Language"}</span>
          </div>
          <div className="h-1.5 w-full bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[var(--primary-light)] to-[var(--accent)]"
              initial={{ width: "33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[24px] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl relative overflow-hidden">
          
          {completeOnboarding.isPending && (
            <div className="absolute inset-0 bg-[#06070B]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <Sparkles className="w-10 h-10 text-[var(--primary-light)] animate-spin mb-4" />
              <h3 className="text-xl font-bold">Building your AI Brain...</h3>
              <p className="text-[var(--text-muted)] mt-2">Setting up your custom voice DNA.</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[rgba(108,71,255,0.1)] text-[var(--primary-light)] mb-6">
                  <Mic size={24} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">What's your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-light)] to-[var(--accent)]">niche?</span></h1>
                <p className="text-[var(--text-secondary)] mb-8 text-lg">Help us train the AI to understand your content category and industry trends.</p>

                <div className="grid grid-cols-2 gap-3 mb-10">
                  {niches.map((n) => (
                    <button
                      key={n}
                      onClick={() => setNiche(n)}
                      className={`py-4 px-4 rounded-xl text-sm font-medium transition-all duration-200 border text-left ${
                        niche === n 
                          ? "bg-[rgba(108,71,255,0.15)] border-[var(--primary-light)] text-white shadow-[0_0_15px_rgba(108,71,255,0.2)]" 
                          : "bg-[rgba(255,255,255,0.03)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[var(--border-default)]"
                      }`}
                    >
                      {n}
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
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[rgba(255,107,53,0.1)] text-[var(--accent)] mb-6">
                  <Sparkles size={24} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Where do you <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-light)] to-[var(--accent)]">post?</span></h1>
                <p className="text-[var(--text-secondary)] mb-8 text-lg">Select all the platforms you create content for. We'll format scripts accordingly.</p>

                <div className="space-y-3 mb-10">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 border ${
                        selectedPlatforms.includes(p.id)
                          ? "bg-[rgba(255,107,53,0.1)] border-[var(--accent)] shadow-[0_0_15px_rgba(255,107,53,0.15)]"
                          : "bg-[rgba(255,255,255,0.03)] border-[var(--border-subtle)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[var(--border-default)]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(255,255,255,0.05)]`}>
                          <p.icon size={20} color={p.color} />
                        </div>
                        <span className={`text-lg font-medium ${selectedPlatforms.includes(p.id) ? "text-white" : "text-[var(--text-secondary)]"}`}>
                          {p.label}
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                        selectedPlatforms.includes(p.id) ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border-subtle)]"
                      }`}>
                        {selectedPlatforms.includes(p.id) && <CheckCircle2 size={14} color="#000" className="opacity-100" />}
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
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[rgba(34,197,94,0.1)] text-[var(--success)] mb-6">
                  <MonitorPlay size={24} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-light)] to-[var(--accent)]">language</span></h1>
                <p className="text-[var(--text-secondary)] mb-8 text-lg">Our AI is specially trained for the Indian creator economy. Pick your vibe.</p>

                <div className="space-y-4 mb-10">
                  {languages.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLanguage(l.id)}
                      className={`w-full text-left p-5 rounded-xl transition-all duration-200 border ${
                        language === l.id
                          ? "bg-[rgba(34,197,94,0.1)] border-[var(--success)] shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                          : "bg-[rgba(255,255,255,0.03)] border-[var(--border-subtle)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[var(--border-default)]"
                      }`}
                    >
                      <div className={`text-xl font-bold mb-1 ${language === l.id ? "text-white" : "text-[var(--text-secondary)]"}`}>
                        {l.label}
                      </div>
                      <div className={language === l.id ? "text-[rgba(255,255,255,0.8)]" : "text-[var(--text-muted)]"}>
                        {l.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4">
            <button 
              onClick={() => setStep(s => Math.max(1, s - 1))}
              className={`px-6 py-3 text-[var(--text-muted)] hover:text-white transition-colors font-medium ${step === 1 ? 'invisible' : ''}`}
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              disabled={
                (step === 1 && !niche) || 
                (step === 2 && selectedPlatforms.length === 0) || 
                (step === 3 && !language) ||
                completeOnboarding.isPending
              }
              className="btn btn-primary flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ padding: "14px 28px", borderRadius: "12px", fontSize: "1rem" }}
            >
              {step === 3 ? "Complete Setup" : "Continue"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
