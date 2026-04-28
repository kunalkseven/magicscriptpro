import { inngest } from "./client";
import { db } from "@/server/db";

// ============================================
// 1. TREND SCRAPER — Runs every 4 hours
// ============================================
export const scrapeHotTopics = inngest.createFunction(
  {
    id: "scrape-hot-topics",
    name: "Scrape Hot Topics",
    triggers: [{ cron: "0 */4 * * *" }],
  },
  async ({ step }) => {
    // Step 1: Fetch trending topics from multiple niches
    const trendData = await step.run("fetch-trends", async () => {
      const niches = [
        "Tech",
        "Finance",
        "Fitness",
        "Education",
        "Entertainment",
        "Lifestyle",
        "Business",
        "Food",
      ];

      const allTrends: Array<{
        topic: string;
        niche: string;
        score: number;
        velocity: number;
      }> = [];

      for (const niche of niches) {
        const trends = await generateTrendsForNiche(niche);
        allTrends.push(...trends);
      }

      return allTrends;
    });

    // Step 2: Upsert trends into the database
    await step.run("save-trends", async () => {
      // Clear old trends (older than 24 hours)
      await db.trendScore.deleteMany({
        where: {
          scrapedAt: {
            lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      });

      // Insert new trends
      await db.trendScore.createMany({
        data: trendData.map((t) => ({
          topic: t.topic,
          niche: t.niche,
          score: t.score,
          velocity: t.velocity,
        })),
      });

      return { inserted: trendData.length };
    });

    return { success: true, trendsProcessed: trendData.length };
  }
);

// ============================================
// 2. COMPETITOR SCRAPER — Event-driven
// ============================================
export const scrapeCompetitor = inngest.createFunction(
  {
    id: "scrape-competitor",
    name: "Scrape Competitor Data",
    triggers: [{ event: "competitor/scrape.requested" }],
  },
  async ({ event, step }) => {
    const { handle, platform } = event.data as {
      handle: string;
      platform: string;
    };

    // Step 1: Scrape the competitor's recent posts
    const posts = await step.run("scrape-posts", async () => {
      return scrapeCompetitorPosts(handle, platform);
    });

    // Step 2: Save to database
    const saved = await step.run("save-competitor-data", async () => {
      let count = 0;
      for (const post of posts) {
        try {
          await db.competitorData.upsert({
            where: { postUrl: post.postUrl },
            create: {
              handle,
              platform,
              postUrl: post.postUrl,
              views: post.views,
              engagementRate: post.engagementRate,
              hookText: post.hookText,
            },
            update: {
              views: post.views,
              engagementRate: post.engagementRate,
            },
          });
          count++;
        } catch {
          // Skip duplicates or invalid entries
        }
      }
      return { saved: count };
    });

    return { success: true, ...saved };
  }
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate trend topics for a niche.
 * In production, this integrates with YouTube Data API, Google Trends, etc.
 * For now it uses OpenAI to simulate trend analysis.
 */
async function generateTrendsForNiche(
  niche: string
): Promise<Array<{ topic: string; niche: string; score: number; velocity: number }>> {
  try {
    const { openai } = await import("@ai-sdk/openai");
    const { generateObject } = await import("ai");
    const { z } = await import("zod");

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        trends: z.array(
          z.object({
            topic: z.string(),
            score: z.number().min(0).max(100),
            velocity: z.number().min(-50).max(50),
          })
        ),
      }),
      prompt: `You are a social media trend analyst for Indian content creators.
Generate 5 currently trending topics in the "${niche}" niche that Indian creators on Instagram Reels, YouTube Shorts, and LinkedIn should make content about RIGHT NOW.

For each topic:
- topic: A specific, actionable content idea (not just a category)
- score: Trend score from 0-100 (how trending it is right now)
- velocity: How fast it's growing (-50 to +50, positive = growing)

Focus on topics relevant to Indian audiences. Include Hinglish terms where natural.`,
      temperature: 0.9,
    });

    return object.trends.map((t) => ({
      ...t,
      niche,
    }));
  } catch (error) {
    console.error(`Failed to generate trends for ${niche}:`, error);
    return [];
  }
}

/**
 * Scrape competitor posts from a given platform.
 * In production, this would use Apify actors or Playwright.
 * For the MVP, we use OpenAI to simulate competitor analysis.
 */
async function scrapeCompetitorPosts(
  handle: string,
  platform: string
): Promise<
  Array<{
    postUrl: string;
    views: number;
    engagementRate: number;
    hookText: string;
  }>
> {
  try {
    const { openai } = await import("@ai-sdk/openai");
    const { generateObject } = await import("ai");
    const { z } = await import("zod");

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        posts: z.array(
          z.object({
            postUrl: z.string(),
            views: z.number(),
            engagementRate: z.number(),
            hookText: z.string(),
          })
        ),
      }),
      prompt: `Analyze the content strategy of "${handle}" on ${platform}.
Generate 5 simulated recent posts with realistic metrics for an Indian content creator.

For each post, provide:
- postUrl: A plausible URL for the post (use the handle in the URL)
- views: Realistic view count
- engagementRate: Engagement rate as a percentage (0-15)
- hookText: The opening hook/first line of the post caption

Make the hooks diverse: some question-based, some controversial, some data-driven.`,
      temperature: 0.8,
    });

    return object.posts;
  } catch (error) {
    console.error(`Failed to scrape ${handle} on ${platform}:`, error);
    return [];
  }
}

// Export all functions for the Inngest serve handler
export const inngestFunctions = [scrapeHotTopics, scrapeCompetitor];
