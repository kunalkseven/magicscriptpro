import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { z } from "zod";

export const maxDuration = 60;

const captionSchema = z.object({
  captions: z.array(
    z.object({
      content: z.string().describe("The caption text"),
      hashtags: z.array(z.string()).describe("Relevant hashtags without the # symbol"),
      variant: z.number().describe("Variant number starting from 1"),
      style: z.string().describe("Short label for the caption style, e.g. 'Storytelling', 'CTA-heavy', 'Minimalist'"),
    })
  ),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { topic, platform, tone, scriptContent, count } = await req.json();

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { creatorProfile: true },
  });

  const niche = user?.creatorProfile?.niche || "General Content";
  const language = user?.creatorProfile?.languagePref || "Hinglish";

  const systemPrompt = `
You are CreatorAI Pro, an expert social media copywriter for Indian content creators.
Generate ${count || 3} unique caption + hashtag variations for the given content.

CONTEXT:
- Niche: ${niche}
- Platform: ${platform}
- Tone: ${tone || "Engaging"}
- Language: ${language}

PLATFORM-SPECIFIC RULES:
${getPlatformRules(platform)}

GUIDELINES:
- Each caption must have a distinct style (e.g., Storytelling, CTA-heavy, Minimalist, Question-based, Data-driven).
- Hashtags should be a mix of trending and niche-specific tags.
- If language is Hinglish, use natural Hindi words written in English script.
- Ensure hashtags are relevant and NOT generic spam.
- Each caption should be able to stand alone even without the video.
  `;

  const prompt = scriptContent
    ? `Generate captions for this script about "${topic}":\n\n${scriptContent}`
    : `Generate captions about: "${topic}"`;

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: captionSchema,
    system: systemPrompt,
    prompt,
    temperature: 0.8,
  });

  return Response.json(object);
}

function getPlatformRules(platform: string): string {
  switch (platform) {
    case "Instagram Reels":
      return `- Max 2200 characters but keep under 150 for best engagement.
- Use 5-10 hashtags (mix of broad + niche).
- First line is the "hook" — it appears above the "more" fold.
- Add relevant emojis but don't overdo it.`;
    case "YouTube Shorts":
      return `- Captions go in the description. Keep them concise.
- Use 3-5 hashtags max (YouTube penalizes hashtag spam).
- First 2 lines appear in search results — make them keyword-rich.
- Include a CTA to subscribe or watch the full video.`;
    case "LinkedIn Post":
      return `- Professional but authentic tone.
- Use line breaks for readability.
- 3-5 hashtags at the end.
- Start with a bold statement or insight.
- Keep under 1300 characters for "See more" fold optimization.`;
    case "Twitter/X":
      return `- Max 280 characters.
- Use 1-3 hashtags max.
- Start with the hook — no preamble.
- Thread-ready: make it quotable.`;
    default:
      return `- Keep it concise and engaging.
- Use 3-8 relevant hashtags.
- Start with a hook.`;
  }
}
