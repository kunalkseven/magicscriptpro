import { SignUp } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#06070B] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Mesh Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#6C47FF]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#EC4899]/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Logo Section */}
      <div className="mb-12 relative z-10 flex flex-col items-center gap-4">
        <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C47FF] to-[#EC4899] flex items-center justify-center shadow-2xl shadow-[#6C47FF]/20">
            <Sparkles size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            Creator<span className="text-[#6C47FF]">AI</span> Pro
          </span>
        </Link>
        <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">Initialize Content Engine</p>
      </div>

      {/* Clerk Component Wrapper */}
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent blur-2xl rounded-[2.5rem] -z-10" />
        <SignUp appearance={{
          elements: {
            card: "bg-[#0D0E14] border border-white/10 shadow-2xl rounded-[2rem]",
            headerTitle: "text-white font-black tracking-tight",
            headerSubtitle: "text-white/40 font-bold",
            socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold transition-all",
            formButtonPrimary: "bg-gradient-to-r from-[#6C47FF] to-[#EC4899] hover:opacity-90 transition-all font-black uppercase tracking-widest text-xs py-3",
            formFieldLabel: "text-white/40 font-black uppercase tracking-widest text-[10px]",
            formFieldInput: "bg-white/5 border-white/10 text-white focus:border-[#6C47FF]/40 transition-all",
            footerActionText: "text-white/40",
            footerActionLink: "text-[#6C47FF] hover:text-[#8B6FFF] transition-colors font-bold",
            dividerLine: "bg-white/5",
            dividerText: "text-white/20 font-bold text-[10px] uppercase tracking-widest"
          }
        }} />
      </div>
    </div>
  );
}
