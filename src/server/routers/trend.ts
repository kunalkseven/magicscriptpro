import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const trendRouter = createTRPCRouter({
  // Get latest trends, optionally filtered by niche
  getTrends: protectedProcedure
    .input(
      z
        .object({
          niche: z.string().optional(),
          limit: z.number().min(1).max(50).default(20),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.trendScore.findMany({
        where: input?.niche ? { niche: input.niche } : undefined,
        orderBy: { score: "desc" },
        take: input?.limit ?? 20,
      });
    }),
});
