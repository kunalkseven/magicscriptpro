import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getInstagramOAuthUrl } from "@/lib/instagram";

/**
 * GET /api/auth/instagram
 * Redirects the user to Meta's OAuth dialog to connect their Instagram account
 */
export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use clerkId as state for CSRF protection
  const oauthUrl = getInstagramOAuthUrl(userId);
  return NextResponse.redirect(oauthUrl);
}
