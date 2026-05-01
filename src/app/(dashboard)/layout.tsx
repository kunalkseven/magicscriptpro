"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PenTool, 
  Hash, 
  TrendingUp, 
  Users, 
  Settings, 
  Menu,
  X,
  Bell,
  Search,
  Sparkles,
  BarChart3,
  Bookmark,
  Bolt,
  Building2,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton } from "@clerk/nextjs";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Script Writer', href: '/script-writer', icon: PenTool },
  { name: 'AI Captions', href: '/captions', icon: Hash },
  { name: 'Auto DM', href: '/auto-dm', icon: MessageSquare },
  { name: 'Trend Intel', href: '/trends', icon: TrendingUp },
  { name: 'Competitors', href: '/competitors', icon: Users },
  { name: 'Saved Content', href: '/saved-captions', icon: Bookmark },
  { name: 'Agency', href: '/agency', icon: Building2 },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[var(--bg-base)] overflow-hidden w-full selection:bg-[var(--primary)]/30">
      {/* Subtle background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-15%] w-[50%] h-[50%] bg-[var(--primary)]/[0.04] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[50%] h-[50%] bg-[var(--accent)]/[0.03] blur-[150px] rounded-full" />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl" 
              onClick={() => setSidebarOpen(false)} 
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease }}
              className="relative flex w-72 h-full flex-col bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] p-5"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/30" style={{ background: 'linear-gradient(to top right, var(--primary), var(--accent))' }}>
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <span className="text-lg font-black text-white tracking-tight">CreatorAI</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-[var(--text-disabled)] hover:text-white transition-colors">
                  <X size={22} />
                </button>
              </div>
              <nav className="space-y-1.5">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      pathname === item.href 
                        ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30" 
                        : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[260px] lg:flex-shrink-0 bg-[var(--bg-surface)]/95 backdrop-blur-2xl border-r border-[var(--border-subtle)] z-50 relative">
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          {/* Logo */}
          <div className="flex items-center h-[68px] px-6 border-b border-transparent">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/30 group-hover:shadow-[var(--primary)]/50 transition-shadow" style={{ background: 'linear-gradient(to top right, var(--primary), var(--accent))' }}>
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Creator<span className="text-[var(--primary-light)]">AI</span>
              </span>
            </Link>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-[var(--border-subtle)] mb-4" />

          {/* Nav Links */}
          <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3.5 px-4 py-3 text-[13px] font-semibold rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25" 
                      : "text-[var(--text-muted)] hover:text-white/90 hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <item.icon className={`h-[18px] w-[18px] flex-shrink-0 transition-all duration-200 ${
                    isActive ? "text-white" : "text-[var(--text-disabled)] group-hover:text-white/70"
                  }`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto text-white/50" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Credit Meter */}
          <div className="px-4 pb-5 pt-3">
            <div className="card bg-[var(--bg-elevated)] p-4 relative overflow-hidden group hover:border-[var(--border-default)] transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center justify-between mb-3 relative z-10">
                <p className="text-[11px] font-bold text-[var(--primary)] uppercase tracking-[0.12em]">Usage</p>
                <Bolt size={14} className="text-[var(--primary)]" />
              </div>
              <div className="flex items-baseline gap-1.5 mb-2.5 relative z-10">
                <span className="text-xl font-extrabold text-white tracking-tight">42</span>
                <span className="text-xs font-semibold text-[var(--text-disabled)]">/ 50 credits</span>
              </div>
              <div className="w-full bg-[var(--border-subtle)] rounded-full h-1.5 mb-2 overflow-hidden relative z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "84%" }}
                  transition={{ duration: 1.2, ease }}
                  className="h-full rounded-full" 
                  style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))' }}
                />
              </div>
              <p className="text-[10px] text-[var(--text-disabled)] font-medium relative z-10">Resets in 12 days</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        {/* Header */}
        <header className="h-[68px] flex-shrink-0 flex items-center justify-between px-5 lg:px-8 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/70 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden p-2.5 rounded-xl bg-[var(--bg-elevated)] text-white hover:bg-[var(--border-subtle)] transition-all border border-[var(--border-subtle)]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 w-72 lg:w-80 group focus-within:bg-[var(--bg-card-hover)] focus-within:border-[var(--primary)]/50 transition-all">
              <Search size={16} className="text-[var(--text-disabled)] group-focus-within:text-[var(--primary)] flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search scripts, trends, insights..." 
                className="bg-transparent border-none outline-none ml-3 text-sm text-white placeholder:text-[var(--text-disabled)] w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-disabled)] hover:text-white hover:border-[var(--border-default)] transition-all">
                <Bell size={17} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent)] rounded-full ring-2 ring-[var(--bg-base)]" />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-disabled)] hover:text-white hover:border-[var(--border-default)] transition-all">
                <Settings size={17} />
              </button>
            </div>
            <div className="hidden lg:block h-7 w-px bg-[var(--border-subtle)] mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="text-[13px] font-semibold text-white leading-none mb-1">Kunal Kumar</p>
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                  <p className="text-[10px] font-semibold text-[var(--text-disabled)] uppercase tracking-wider">Pro</p>
                </div>
              </div>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 rounded-xl border-2 border-[var(--border-subtle)] hover:border-[var(--primary)]/50 transition-all"
                  }
                }}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-5 lg:px-8 py-6 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border-subtle);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--text-disabled);
        }
      `}</style>
    </div>
  );
}
