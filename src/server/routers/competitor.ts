import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { inngest } from "@/inngest/client";

export const competitorRouter = createTRPCRouter({
  // Trigger a competitor scrape job
  requestScrape: protectedProcedure
    .input(
      z.object({
        handle: z.string().min(1),
        platform: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "competitor/scrape.requested",
        data: {
          handle: input.handle,
          platform: input.platform,
        },
      });

      return { queued: true };
    }),

  // Get scraped competitor data
  getCompetitorData: protectedProcedure
    .input(
      z
        .object({
          handle: z.string().optional(),
          platform: z.string().optional(),
          limit: z.number().min(1).max(100).default(20),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.competitorData.findMany({
        where: {
          ...(input?.handle ? { handle: input.handle } : {}),
          ...(input?.platform ? { platform: input.platform } : {}),
        },
        orderBy: { scrapedAt: "desc" },
        take: input?.limit ?? 20,
      });
    }),
});
