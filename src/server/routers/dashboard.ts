import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.session.userId },
      include: { creatorProfile: true },
    });

    if (!user || !user.creatorProfile) {
      return {
        scriptsCount: 0,
        captionsCount: 0,
        scheduledPostsCount: 0,
        avgEngagement: 0,
      };
    }

    const [scriptsCount, captionsCount, scheduledPostsCount] = await Promise.all([
      ctx.db.script.count({ where: { creatorId: user.creatorProfile.id } }),
      ctx.db.caption.count({ where: { creatorId: user.creatorProfile.id } }),
      ctx.db.scheduledPost.count({ where: { creatorId: user.creatorProfile.id } }),
    ]);

    // Mock engagement for now or calculate from PostMetric if available
    const avgEngagement = 4.8; 

    return {
      scriptsCount,
      captionsCount,
      scheduledPostsCount,
      avgEngagement,
    };
  }),

  getRecentActivity: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.session.userId },
      include: { creatorProfile: true },
    });

    if (!user || !user.creatorProfile) return [];

    const scripts = await ctx.db.script.findMany({
      where: { creatorId: user.creatorProfile.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return scripts.map(s => ({
      id: s.id,
      type: "script",
      title: s.topic,
      date: s.createdAt,
      status: s.status,
    }));
  }),

  getEngagementData: protectedProcedure.query(async () => {
    // Return mock data for Recharts for now
    return [
      { name: "Mon", views: 4000, engagement: 2400 },
      { name: "Tue", views: 3000, engagement: 1398 },
      { name: "Wed", views: 2000, engagement: 9800 },
      { name: "Thu", views: 2780, engagement: 3908 },
      { name: "Fri", views: 1890, engagement: 4800 },
      { name: "Sat", views: 2390, engagement: 3800 },
      { name: "Sun", views: 3490, engagement: 4300 },
    ];
  }),
});
