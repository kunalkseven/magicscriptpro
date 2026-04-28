import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const scriptRouter = createTRPCRouter({
  // Save a new generated script
  saveScript: protectedProcedure
    .input(
      z.object({
        topic: z.string(),
        platform: z.string(),
        tone: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.session.userId },
        include: { creatorProfile: true },
      });

      if (!user || !user.creatorProfile) {
        throw new Error("User or Creator Profile not found");
      }

      const script = await ctx.db.script.create({
        data: {
          creatorId: user.creatorProfile.id,
          topic: input.topic,
          platform: input.platform,
          tone: input.tone,
          content: input.content,
          status: "DRAFT",
        },
      });

      return script;
    }),

  // Get all scripts for the current user
  getScripts: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.session.userId },
      include: { creatorProfile: true },
    });

    if (!user || !user.creatorProfile) {
      return [];
    }

    const scripts = await ctx.db.script.findMany({
      where: { creatorId: user.creatorProfile.id },
      orderBy: { createdAt: "desc" },
    });

    return scripts;
  }),
});
