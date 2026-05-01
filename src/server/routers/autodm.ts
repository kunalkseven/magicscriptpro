import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const autoDmRouter = createTRPCRouter({
  // Get the user's Instagram connection status
  getConnection: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.session.userId },
      include: {
        creatorProfile: {
          // @ts-ignore
          include: { instagramConnection: true },
        },
      },
    }) as any;

    return user?.creatorProfile?.instagramConnection ?? null;
  }),

  // Disconnect Instagram
  disconnect: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.session.userId },
      include: { creatorProfile: true },
    }) as any;

    if (!user?.creatorProfile) return { success: false };

    // @ts-ignore
    await ctx.db.instagramConnection.deleteMany({
      where: { creatorId: user.creatorProfile.id },
    });

    return { success: true };
  }),

  // Get all Auto DM rules for the current user
  getRules: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.session.userId },
      include: { creatorProfile: true },
    }) as any;

    if (!user?.creatorProfile) return [];

    // @ts-ignore
    return ctx.db.autoDMRule.findMany({
      where: { creatorId: user.creatorProfile.id },
      include: { metrics: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Create a new Auto DM rule
  createRule: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        triggerKeyword: z.string().min(1),
        triggerType: z.enum(["comment", "story_reply"]).default("comment"),
        matchType: z.enum(["exact", "contains"]).default("contains"),
        responseMessage: z.string().min(1),
        linkUrl: z.string().url().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.session.userId },
        include: {
          creatorProfile: {
            // @ts-ignore
            include: { instagramConnection: true },
          },
        },
      }) as any;

      if (!user?.creatorProfile?.instagramConnection) {
        throw new Error("Instagram not connected");
      }

      // @ts-ignore
      const rule = await ctx.db.autoDMRule.create({
        data: {
          creatorId: user.creatorProfile.id,
          connectionId: user.creatorProfile.instagramConnection.id,
          name: input.name,
          triggerKeyword: input.triggerKeyword,
          triggerType: input.triggerType,
          matchType: input.matchType,
          responseMessage: input.responseMessage,
          linkUrl: input.linkUrl || null,
        },
      });

      // initial metrics record
      // @ts-ignore
      await ctx.db.autoDMMetric.create({
        data: { ruleId: rule.id },
      });

      return rule;
    }),

  // Toggle a rule's active state
  toggleRule: protectedProcedure
    .input(z.object({ ruleId: z.string(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      // @ts-ignore
      return ctx.db.autoDMRule.update({
        where: { id: input.ruleId },
        data: { isActive: input.isActive },
      });
    }),

  // Update a rule
  updateRule: protectedProcedure
    .input(
      z.object({
        ruleId: z.string(),
        name: z.string().min(1).optional(),
        triggerKeyword: z.string().min(1).optional(),
        matchType: z.enum(["exact", "contains"]).optional(),
        responseMessage: z.string().min(1).optional(),
        linkUrl: z.string().url().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { ruleId, ...data } = input;
      // @ts-ignore
      return ctx.db.autoDMRule.update({
        where: { id: ruleId },
        data: {
          ...data,
          linkUrl: data.linkUrl || null,
        },
      });
    }),

  // Delete a rule
  deleteRule: protectedProcedure
    .input(z.object({ ruleId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // @ts-ignore
      await ctx.db.autoDMRule.delete({
        where: { id: input.ruleId },
      });
      return { success: true };
    }),

  // Get aggregate metrics for the dashboard
  getMetrics: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.session.userId },
      include: { creatorProfile: true },
    }) as any;

    if (!user?.creatorProfile) {
      return { totalTriggered: 0, totalSent: 0, totalFailed: 0, ruleCount: 0 };
    }

    // @ts-ignore
    const metrics = await ctx.db.autoDMMetric.findMany({
      where: { rule: { creatorId: user.creatorProfile.id } },
    });

    // @ts-ignore
    const ruleCount = await ctx.db.autoDMRule.count({
      where: { creatorId: user.creatorProfile.id },
    });

    return {
      totalTriggered: metrics.reduce((acc: number, m: any) => acc + (m.timesTriggered || 0), 0),
      totalSent: metrics.reduce((acc: number, m: any) => acc + (m.successfulSends || 0), 0),
      totalFailed: metrics.reduce((acc: number, m: any) => acc + (m.failedSends || 0), 0),
      ruleCount,
    };
  }),

  // Get recent DM send logs
  getLogs: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.session.userId },
        include: { creatorProfile: true },
      }) as any;

      if (!user?.creatorProfile) return [];

      // @ts-ignore
      return ctx.db.autoDMLog.findMany({
        where: { rule: { creatorId: user.creatorProfile.id } },
        include: { rule: { select: { name: true, triggerKeyword: true } } },
        orderBy: { sentAt: "desc" },
        take: input.limit,
      });
    }),
});
