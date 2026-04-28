"use client";

import { trpc } from "@/trpc/react";
import { 
  BarChart, 
  Bar, 
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
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.getStats.useQuery();
  const { data: activity, isLoading: activityLoading } = trpc.dashboard.getRecentActivity.useQuery();
  const { data: chartData } = trpc.dashboard.getEngagementData.useQuery();

  const statCards = [
    { 
      label: "Scripts Created", 
      value: stats?.scriptsCount ?? 0, 
      icon: FileText, 
      color: "var(--primary)",
      trend: "+12%" 
    },
    { 
      label: "AI Captions", 
      value: stats?.captionsCount ?? 0, 
      icon: Hash, 
      color: "var(--accent)",
      trend: "+5%" 
    },
    { 
      label: "Scheduled Posts", 
      value: stats?.scheduledPostsCount ?? 0, 
      icon: Calendar, 
      color: "var(--info)",
      trend: "0%" 
    },
    { 
      label: "Avg Engagement", 
      value: `${stats?.avgEngagement ?? 0}%`, 
      icon: TrendingUp, 
      color: "var(--success)",
      trend: "+0.4%" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#06070B] text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-[var(--text-muted)]">Welcome back! Here&apos;s what&apos;s happening with your content.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  <stat.icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-[var(--success)] text-sm font-medium">
                  {stat.trend}
                  <ArrowUpRight size={14} />
                </div>
              </div>
              <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
              
              {/* Decorative background glow */}
              <div 
                className="absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: stat.color }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold mb-1">Growth Overview</h2>
                  <p className="text-sm text-[var(--text-muted)]">Views and engagement over the last 7 days</p>
                </div>
                <select className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--primary)]">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--bg-surface)", 
                        borderColor: "var(--border-subtle)",
                        borderRadius: "12px",
                        color: "white"
                      }}
                      itemStyle={{ color: "var(--primary)" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="var(--primary)" 
                      fillOpacity={1} 
                      fill="url(#colorViews)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Scripts Section */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center">
                <h2 className="text-xl font-bold">Recent Scripts</h2>
                <Link href="/script-writer" className="text-sm text-[var(--primary-light)] hover:underline flex items-center gap-1">
                  View all <ChevronRight size={14} />
                </Link>
              </div>
              <div className="divide-y divide-[var(--border-subtle)]">
                {activityLoading ? (
                  <div className="p-10 text-center text-[var(--text-muted)]">Loading activity...</div>
                ) : activity?.length === 0 ? (
                  <div className="p-10 text-center text-[var(--text-muted)]">No recent scripts found.</div>
                ) : (
                  activity?.map((item) => (
                    <div key={item.id} className="p-5 flex items-center justify-between hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[rgba(108,71,255,0.1)] flex items-center justify-center text-[var(--primary-light)]">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <Clock size={12} />
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          item.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {item.status}
                        </span>
                        <ChevronRight size={16} className="text-[var(--text-muted)]" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Trending & Quick Actions */}
          <div className="space-y-8">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/script-writer" className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] hover:border-[var(--primary-light)] transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Write Script</p>
                    <p className="text-xs text-[var(--text-muted)]">AI-powered scripting</p>
                  </div>
                  <ChevronRight size={18} className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
                <Link href="/captions" className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] hover:border-[var(--accent-light)] transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white">
                    <Hash size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Generate Captions</p>
                    <p className="text-xs text-[var(--text-muted)]">Scroll-stopping hooks</p>
                  </div>
                  <ChevronRight size={18} className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
                <Link href="/trends" className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] hover:border-[var(--error-light)] transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[var(--error)] flex items-center justify-center text-white">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Explore Trends</p>
                    <p className="text-xs text-[var(--text-muted)]">What's viral right now</p>
                  </div>
                  <ChevronRight size={18} className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
              </div>
            </div>

            {/* Platform Distribution Chart */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-1">Platform Impact</h2>
              <p className="text-sm text-[var(--text-muted)] mb-8">Where your content performs best</p>
              
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Insta', value: 45 },
                    { name: 'YT', value: 30 },
                    { name: 'LinkedIn', value: 20 },
                    { name: 'Twitter', value: 5 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
