import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const captionRouter = createTRPCRouter({
  // Save generated captions to the database
  saveCaptions: protectedProcedure
    .input(
      z.object({
        scriptId: z.string().optional(),
        platform: z.string(),
        captions: z.array(
          z.object({
            content: z.string(),
            hashtags: z.array(z.string()),
            variant: z.number(),
          })
        ),
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

      const created = await ctx.db.caption.createMany({
        data: input.captions.map((c) => ({
          creatorId: user.creatorProfile!.id,
          scriptId: input.scriptId || null,
          platform: input.platform,
          content: c.content,
          hashtags: c.hashtags,
          variant: c.variant,
        })),
      });

      return created;
    }),

  // Get all captions for the current user
  getCaptions: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.session.userId },
      include: { creatorProfile: true },
    });

    if (!user || !user.creatorProfile) {
      return [];
    }

    return ctx.db.caption.findMany({
      where: { creatorId: user.creatorProfile.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }),
});
