import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { INSTAGRAM_CONFIG, sendPrivateReply } from "@/lib/instagram";

/**
 * GET /api/webhooks/instagram
 * Handles the Meta Webhook verification challenge
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === INSTAGRAM_CONFIG.webhookVerifyToken
  ) {
    console.log("✅ Instagram webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * POST /api/webhooks/instagram
 * Receives comment events from Instagram and triggers Auto DM rules
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Instagram sends comment events under 'entry'
    if (body.object !== "instagram" && body.object !== "page") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const entries = body.entry || [];

    for (const entry of entries) {
      // Process comment changes
      const changes = entry.changes || [];

      for (const change of changes) {
        if (change.field === "comments" || change.field === "feed") {
          const value = change.value;

          // Only process new comments (not edits/deletes)
          if (value?.item === "comment" && value?.verb === "add") {
            await processComment({
              commentId: value.comment_id,
              commentText: value.message || "",
              commenterId: value.from?.id || "",
              commenterUsername: value.from?.username || "",
              mediaId: value.media_id || value.post_id || "",
              igUserId: entry.id, // The Instagram account receiving the comment
            });
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook processing error:", err);
    // Always return 200 to prevent Meta from retrying
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

/**
 * Process a single comment against all active Auto DM rules
 */
async function processComment(event: {
  commentId: string;
  commentText: string;
  commenterId: string;
  commenterUsername: string;
  mediaId: string;
  igUserId: string;
}) {
  // Find the Instagram connection for this IG user ID
  // @ts-ignore
  const connection = await db.instagramConnection.findUnique({
    where: { igUserId: event.igUserId },
    include: {
      autoDMRules: {
        where: { isActive: true },
        include: { metrics: true },
      },
    },
  });

  if (!connection || !connection.isActive) return;

  const commentLower = event.commentText.toLowerCase().trim();

  for (const rule of connection.autoDMRules) {
    const keywordLower = rule.triggerKeyword.toLowerCase();
    let isMatch = false;

    if (rule.matchType === "exact") {
      isMatch = commentLower === keywordLower;
    } else {
      // "contains" match
      isMatch = commentLower.includes(keywordLower);
    }

    if (!isMatch) continue;

    // Build the message (append link if provided)
    let message = rule.responseMessage;
    if (rule.linkUrl) {
      message += `\n\n🔗 ${rule.linkUrl}`;
    }

    try {
      // Send the private reply DM
      await sendPrivateReply(
        connection.igUserId,
        event.commentId,
        message,
        connection.pageAccessToken || connection.accessToken
      );

      // Log success
      // @ts-ignore
      await db.autoDMLog.create({
        data: {
          ruleId: rule.id,
          commentId: event.commentId,
          commenterId: event.commenterId,
          commenterUsername: event.commenterUsername,
          commentText: event.commentText,
          status: "sent",
        },
      });

      // Update metrics
      // @ts-ignore
      await db.autoDMMetric.upsert({
        where: { ruleId: rule.id },
        update: {
          timesTriggered: { increment: 1 },
          successfulSends: { increment: 1 },
          lastTriggeredAt: new Date(),
        },
        create: {
          ruleId: rule.id,
          timesTriggered: 1,
          successfulSends: 1,
          lastTriggeredAt: new Date(),
        },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error";

      // Log failure
      // @ts-ignore
      await db.autoDMLog.create({
        data: {
          ruleId: rule.id,
          commentId: event.commentId,
          commenterId: event.commenterId,
          commenterUsername: event.commenterUsername,
          commentText: event.commentText,
          status: "failed",
          errorMessage,
        },
      });

      // Update metrics
      // @ts-ignore
      await db.autoDMMetric.upsert({
        where: { ruleId: rule.id },
        update: {
          timesTriggered: { increment: 1 },
          failedSends: { increment: 1 },
          lastTriggeredAt: new Date(),
        },
        create: {
          ruleId: rule.id,
          timesTriggered: 1,
          failedSends: 1,
          lastTriggeredAt: new Date(),
        },
      });

      console.error(`Auto DM failed for rule ${rule.id}:`, errorMessage);
    }

    // Only send one DM per comment (don't trigger multiple rules)
    break;
  }
}
