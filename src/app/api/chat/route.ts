import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, topic, platform, tone, language } = await req.json();

  // Fetch the user's voice profile and niche if they have one
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { creatorProfile: true },
  });

  const niche = user?.creatorProfile?.niche || "General Content";

  // System Prompt for CreatorAI Pro
  const systemPrompt = `
You are CreatorAI Pro, an elite scriptwriter for Indian content creators.
Your job is to generate a highly engaging, viral-ready video script.

CONTEXT:
- Niche: ${niche}
- Platform: ${platform || "YouTube Shorts"}
- Tone: ${tone || "Engaging"}
- Language: ${language || "Hinglish (Mix of Hindi and English, written in English alphabet)"}
- Topic: ${topic}

GUIDELINES:
1. Start with an ultra-hook (first 3 seconds).
2. Keep pacing fast and engaging.
3. If language is Hinglish, use modern internet slang naturally (e.g., "bhai", "samjho", "crazy trick").
4. Include visual cues in brackets like [Quick Zoom in], [B-Roll of X], or [Sound effect].
5. End with a strong Call-To-Action (CTA).

Respond with the script content only. Do not include introductory text.
  `;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: messages,
    temperature: 0.7,
  });

  return result.toUIMessageStreamResponse();
}
