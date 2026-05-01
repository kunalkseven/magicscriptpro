"use client";

import { trpc } from "@/trpc/react";
import { 
  BarChart, 
  Bar, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { 
  FileText, 
  Hash, 
  Calendar, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  ArrowUpRight,
  Plus,
  Bolt,
  Target,
  PenTool,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function DashboardPage() {
  const { data: stats } = trpc.dashboard.getStats.useQuery();
  const { data: activity, isLoading: activityLoading } = trpc.dashboard.getRecentActivity.useQuery();
  const { data: chartData } = trpc.dashboard.getEngagementData.useQuery();

  const statCards = [
    { label: "Scripts Created", value: stats?.scriptsCount ?? 0, icon: FileText, color: "#6C47FF", trend: "+12%" },
    { label: "AI Captions", value: stats?.captionsCount ?? 0, icon: Hash, color: "#FF6B35", trend: "+5%" },
    { label: "Scheduled Posts", value: stats?.scheduledPostsCount ?? 0, icon: Calendar, color: "#3B82F6", trend: "0%" },
    { label: "Avg Engagement", value: `${stats?.avgEngagement ?? 0}%`, icon: TrendingUp, color: "#22C55E", trend: "+0.4%" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
  };

  const item = {
    hidden: { y: 16, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease } }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="min-w-0">
          <div className="badge mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-light)] animate-pulse" />
            Dashboard
          </div>
          <h1 className="heading-lg text-white mb-2">
            Creator <span className="text-gradient">Intelligence</span>
          </h1>
          <p className="body-md">
            Welcome back, Kunal. Your reach is up <span className="text-[var(--success)] font-semibold">+12.4%</span> this week.
          </p>
        </div>
        <Link 
          href="/script-writer" 
          className="btn btn-primary flex-shrink-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Craft New Script</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx} 
            variants={item}
            className="card group relative overflow-hidden"
            style={{ padding: '24px' }}
          >
            <div className="flex justify-between items-start mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center relative z-10"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color, border: `1px solid ${stat.color}20` }}
              >
                <stat.icon size={20} strokeWidth={2} />
              </div>
              <span className="text-[11px] font-bold text-[var(--success)] flex items-center gap-0.5 bg-[var(--success)]/10 px-2 py-1 rounded-md relative z-10">
                {stat.trend}
                <ArrowUpRight size={12} strokeWidth={2.5} />
              </span>
            </div>
            <p className="body-sm text-[11px] uppercase tracking-[0.1em] font-semibold mb-1 relative z-10">{stat.label}</p>
            <p className="text-3xl font-extrabold text-white tracking-tight relative z-10">{stat.value}</p>
            
            <div 
              className="absolute -right-6 -bottom-6 w-24 h-24 blur-[50px] opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: stat.color }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - Chart + Activity */}
        <div className="xl:col-span-8 space-y-6 min-w-0">
          {/* Growth Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="card"
            style={{ padding: '24px' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="heading-sm text-white mb-1 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full" />
                  Growth Matrix
                </h2>
                <p className="body-sm ml-4">Engagement velocity across platforms</p>
              </div>
              <div className="flex items-center gap-1 bg-[var(--bg-elevated)] rounded-lg p-1 border border-[var(--border-subtle)]">
                {['7D', '30D', '90D'].map((t) => (
                  <button key={t} className={`px-4 py-1.5 text-[11px] font-bold rounded-md transition-all ${t === '7D' ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-white hover:bg-white/[0.05]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--text-muted)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ dy: 10, fill: 'var(--text-muted)', fontWeight: 500 }}
                  />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
                    tick={{ fill: 'var(--text-muted)', fontWeight: 500 }}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--bg-surface)", 
                      border: "1px solid var(--border-default)",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      boxShadow: "var(--shadow-lg)"
                    }}
                    itemStyle={{ color: "var(--primary-light)", fontWeight: 600, fontSize: "13px" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="var(--primary)" 
                    fillOpacity={1} 
                    fill="url(#colorViews)" 
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="card p-0 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h2 className="heading-sm text-white flex items-center gap-3">
                <Clock className="text-[var(--accent)]" size={20} />
                Recent Masterpieces
              </h2>
              <Link href="/script-writer" className="group text-[11px] font-bold text-[var(--primary-light)] hover:text-white flex items-center gap-1 transition-colors uppercase tracking-widest">
                View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {activityLoading ? (
                <div className="px-6 py-14 text-center text-[var(--text-muted)] text-sm font-medium animate-pulse">Loading...</div>
              ) : !activity || activity.length === 0 ? (
                <div className="px-6 py-16 text-center flex flex-col items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    <PenTool size={28} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg mb-1">No scripts yet</p>
                    <p className="body-md mb-6">Create your first viral script to get started.</p>
                    <Link href="/script-writer" className="btn btn-primary">
                      Create Script
                    </Link>
                  </div>
                </div>
              ) : (
                activity.map((actItem) => (
                  <div key={actItem.id} className="px-6 py-5 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors group">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary-light)] border border-[var(--primary)]/20 flex-shrink-0 group-hover:scale-105 transition-transform">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-base truncate group-hover:text-[var(--primary-light)] transition-colors">{actItem.title}</p>
                        <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] mt-1 font-medium">
                          <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(actItem.date).toLocaleDateString()}</span>
                          <span className="text-[var(--primary-light)]">Draft</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`hidden sm:inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                        actItem.status === 'completed' ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20' : 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20'
                      }`}>
                        {actItem.status}
                      </span>
                      <button className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-[var(--primary)] transition-all border border-[var(--border-subtle)]">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-4 space-y-6 min-w-0">
          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.35 }}
            className="card"
            style={{ padding: '24px' }}
          >
            <h2 className="heading-sm text-white mb-5 flex items-center gap-2.5">
              <Bolt className="text-[var(--accent)]" size={20} />
              Quick Pulse
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Write Script', desc: 'Hinglish AI', icon: FileText, color: 'var(--primary)', href: '/script-writer' },
                { name: 'AI Captions', desc: 'Hook Generator', icon: Hash, color: 'var(--accent)', href: '/captions' },
                { name: 'Trend Scout', desc: "What's Viral", icon: TrendingUp, color: 'var(--error)', href: '/trends' }
              ].map((action) => (
                <Link 
                  key={action.name}
                  href={action.href} 
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] hover:bg-[var(--bg-card-hover)] transition-all group"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform shadow-md"
                    style={{ backgroundColor: action.color }}
                  >
                    <action.icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[15px] text-white leading-tight mb-0.5">{action.name}</p>
                    <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">{action.desc}</p>
                  </div>
                  <ArrowUpRight size={16} className="text-[var(--text-muted)] group-hover:text-white transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Platform Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.4 }}
            className="card"
            style={{ padding: '24px' }}
          >
            <div className="mb-6">
              <h2 className="heading-sm text-white mb-1 flex items-center gap-2.5">
                <Target className="text-[var(--success)]" size={20} />
                Platform Alpha
              </h2>
              <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.15em] ml-[30px]">Engagement Distribution</p>
            </div>
            
            <div className="h-[200px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'IG', value: 45 },
                  { name: 'YT', value: 30 },
                  { name: 'LI', value: 20 },
                  { name: 'TW', value: 5 },
                ]} barSize={40}>
                  <CartesianGrid strokeDasharray="8 8" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} tick={{ dy: 8, fill: 'var(--text-muted)', fontWeight: 600 }} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'var(--bg-elevated)' }}
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '12px', padding: '10px 14px' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {[
                      { color: 'var(--primary)' },
                      { color: '#A855F7' },
                      { color: 'var(--accent)' },
                      { color: 'var(--info)' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mt-4">
              {[
                { name: 'Instagram', val: '45.2%', color: 'var(--primary)' },
                { name: 'YouTube', val: '29.8%', color: '#A855F7' },
                { name: 'LinkedIn', val: '18.4%', color: 'var(--accent)' }
              ].map(p => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="body-md text-sm">{p.name}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{p.val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
