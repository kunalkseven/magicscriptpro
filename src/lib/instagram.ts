// =============================================================
// Instagram Graph API Configuration & Helpers
// =============================================================

export const INSTAGRAM_CONFIG = {
  appId: process.env.META_APP_ID!,
  appSecret: process.env.META_APP_SECRET!,
  webhookVerifyToken: process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN!,
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`,
  graphApiVersion: "v21.0",
  
  // Required permissions for Auto DM
  scopes: [
    "instagram_basic",
    "instagram_manage_comments",
    "instagram_manage_messages",
    "pages_show_list",
    "pages_read_engagement",
  ],
} as const;

/**
 * Build the Meta OAuth authorization URL
 */
export function getInstagramOAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: INSTAGRAM_CONFIG.appId,
    redirect_uri: INSTAGRAM_CONFIG.redirectUri,
    scope: INSTAGRAM_CONFIG.scopes.join(","),
    response_type: "code",
    state, // CSRF protection — pass the user's clerkId or a signed token
  });

  return `https://www.facebook.com/${INSTAGRAM_CONFIG.graphApiVersion}/dialog/oauth?${params.toString()}`;
}

/**
 * Exchange an authorization code for a short-lived access token
 */
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  token_type: string;
}> {
  const params = new URLSearchParams({
    client_id: INSTAGRAM_CONFIG.appId,
    client_secret: INSTAGRAM_CONFIG.appSecret,
    redirect_uri: INSTAGRAM_CONFIG.redirectUri,
    code,
  });

  const res = await fetch(
    `https://graph.facebook.com/${INSTAGRAM_CONFIG.graphApiVersion}/oauth/access_token?${params.toString()}`,
    { method: "GET" }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Token exchange failed: ${JSON.stringify(error)}`);
  }

  return res.json();
}

/**
 * Exchange a short-lived token for a long-lived token (60 days)
 */
export async function getLongLivedToken(shortLivedToken: string): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: INSTAGRAM_CONFIG.appId,
    client_secret: INSTAGRAM_CONFIG.appSecret,
    fb_exchange_token: shortLivedToken,
  });

  const res = await fetch(
    `https://graph.facebook.com/${INSTAGRAM_CONFIG.graphApiVersion}/oauth/access_token?${params.toString()}`,
    { method: "GET" }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Long-lived token exchange failed: ${JSON.stringify(error)}`);
  }

  return res.json();
}

/**
 * Get the user's Facebook Pages (needed to find the connected Instagram account)
 */
export async function getUserPages(accessToken: string): Promise<{
  data: Array<{
    id: string;
    name: string;
    access_token: string;
  }>;
}> {
  const res = await fetch(
    `https://graph.facebook.com/${INSTAGRAM_CONFIG.graphApiVersion}/me/accounts?access_token=${accessToken}`,
    { method: "GET" }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Failed to get pages: ${JSON.stringify(error)}`);
  }

  return res.json();
}

/**
 * Get the Instagram Business Account connected to a Facebook Page
 */
export async function getInstagramBusinessAccount(
  pageId: string,
  pageAccessToken: string
): Promise<{
  instagram_business_account?: { id: string };
}> {
  const res = await fetch(
    `https://graph.facebook.com/${INSTAGRAM_CONFIG.graphApiVersion}/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`,
    { method: "GET" }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Failed to get IG business account: ${JSON.stringify(error)}`);
  }

  return res.json();
}

/**
 * Get Instagram user profile info
 */
export async function getInstagramProfile(
  igUserId: string,
  accessToken: string
): Promise<{
  id: string;
  username: string;
  name?: string;
  profile_picture_url?: string;
}> {
  const res = await fetch(
    `https://graph.facebook.com/${INSTAGRAM_CONFIG.graphApiVersion}/${igUserId}?fields=id,username,name,profile_picture_url&access_token=${accessToken}`,
    { method: "GET" }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Failed to get IG profile: ${JSON.stringify(error)}`);
  }

  return res.json();
}

/**
 * Send a private reply (DM) to a comment via the Instagram Graph API
 */
export async function sendPrivateReply(
  igUserId: string,
  commentId: string,
  message: string,
  accessToken: string
): Promise<{ recipient_id: string; message_id: string }> {
  const res = await fetch(
    `https://graph.facebook.com/${INSTAGRAM_CONFIG.graphApiVersion}/${igUserId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { comment_id: commentId },
        message: { text: message },
      }),
    }
  );

  // Use the page access token for sending
  const url = new URL(
    `https://graph.facebook.com/${INSTAGRAM_CONFIG.graphApiVersion}/${igUserId}/messages`
  );
  url.searchParams.set("access_token", accessToken);

  const sendRes = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { comment_id: commentId },
      message: { text: message },
    }),
  });

  if (!sendRes.ok) {
    const error = await sendRes.json();
    throw new Error(`Failed to send DM: ${JSON.stringify(error)}`);
  }

  return sendRes.json();
}

/**
 * Subscribe a page to webhook fields for comments
 */
export async function subscribePageToWebhooks(
  pageId: string,
  pageAccessToken: string
): Promise<{ success: boolean }> {
  const res = await fetch(
    `https://graph.facebook.com/${INSTAGRAM_CONFIG.graphApiVersion}/${pageId}/subscribed_apps`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscribed_fields: ["feed"],
        access_token: pageAccessToken,
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Failed to subscribe to webhooks: ${JSON.stringify(error)}`);
  }

  return res.json();
}
