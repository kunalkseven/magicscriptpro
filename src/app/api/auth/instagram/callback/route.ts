import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import {
  exchangeCodeForToken,
  getLongLivedToken,
  getUserPages,
  getInstagramBusinessAccount,
  getInstagramProfile,
  subscribePageToWebhooks,
  INSTAGRAM_CONFIG,
} from "@/lib/instagram";

/**
 * GET /api/auth/instagram/callback
 * Handles the OAuth callback from Meta after the user authorizes
 */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  // Handle user denial
  if (error) {
    return NextResponse.redirect(
      new URL("/auto-dm?error=access_denied", req.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/auto-dm?error=missing_params", req.url)
    );
  }

  // Verify CSRF state matches the current user
  if (!userId || state !== userId) {
    return NextResponse.redirect(
      new URL("/auto-dm?error=invalid_state", req.url)
    );
  }

  try {
    // Step 1: Exchange code for short-lived token
    const { access_token: shortLivedToken } = await exchangeCodeForToken(code);

    // Step 2: Exchange for long-lived token (60 days)
    const longLivedResult = await getLongLivedToken(shortLivedToken);
    const expiresAt = new Date(
      Date.now() + longLivedResult.expires_in * 1000
    );

    // Step 3: Get user's Facebook Pages
    const pages = await getUserPages(longLivedResult.access_token);

    if (!pages.data || pages.data.length === 0) {
      return NextResponse.redirect(
        new URL("/auto-dm?error=no_pages", req.url)
      );
    }

    // Use the first page (most common for individual creators)
    const page = pages.data[0];

    // Step 4: Get Instagram Business Account from the page
    const igAccount = await getInstagramBusinessAccount(
      page.id,
      page.access_token
    );

    if (!igAccount.instagram_business_account) {
      return NextResponse.redirect(
        new URL("/auto-dm?error=no_ig_business", req.url)
      );
    }

    const igUserId = igAccount.instagram_business_account.id;

    // Step 5: Get Instagram profile info
    const igProfile = await getInstagramProfile(
      igUserId,
      page.access_token
    );

    // Step 6: Find the user's CreatorProfile
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: { creatorProfile: true },
    });

    if (!user?.creatorProfile) {
      return NextResponse.redirect(
        new URL("/auto-dm?error=no_profile", req.url)
      );
    }

    // Step 7: Upsert the Instagram connection
    // @ts-ignore - Prisma types may be out of sync in the IDE
    await db.instagramConnection.upsert({
      where: { creatorId: user.creatorProfile.id },
      update: {
        igUserId,
        igUsername: igProfile.username,
        accessToken: longLivedResult.access_token,
        tokenExpiresAt: expiresAt,
        pageId: page.id,
        pageAccessToken: page.access_token,
        scopes: [...INSTAGRAM_CONFIG.scopes],
        isActive: true,
      },
      create: {
        creatorId: user.creatorProfile.id,
        igUserId,
        igUsername: igProfile.username,
        accessToken: longLivedResult.access_token,
        tokenExpiresAt: expiresAt,
        pageId: page.id,
        pageAccessToken: page.access_token,
        scopes: [...INSTAGRAM_CONFIG.scopes],
        isActive: true,
      },
    });

    // Step 8: Subscribe the page to webhooks (for comment events)
    try {
      await subscribePageToWebhooks(page.id, page.access_token);
    } catch (webhookErr) {
      console.error("Failed to subscribe to webhooks:", webhookErr);
      // Don't block — user can still create rules, webhooks can be set up later
    }

    // Success! Redirect back to Auto DM page
    return NextResponse.redirect(
      new URL("/auto-dm?connected=true", req.url)
    );
  } catch (err) {
    console.error("Instagram OAuth callback error:", err);
    return NextResponse.redirect(
      new URL(`/auto-dm?error=oauth_failed`, req.url)
    );
  }
}
