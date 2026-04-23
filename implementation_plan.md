# CreatorAI Pro — Superior Big Creator Clone
## Master Implementation Plan + Complete AI Build Prompt

> **Role**: Senior Software Architect & Full-Stack Engineer (20+ years experience)
> **Target**: Production-grade SaaS platform for the Indian creator economy
> **Timeline**: 12 weeks (phased)

---

## 🧠 THE MASTER AI BUILD PROMPT

> Copy-paste this prompt into any capable AI coding agent (Claude, GPT-4o, Gemini) for a full-stack build.

```
You are a world-class Senior Software Architect and Full-Stack Engineer with 20+ years of experience 
building production SaaS platforms. You have deep expertise in Next.js, TypeScript, PostgreSQL, 
AI/LLM integrations, multi-tenant SaaS architecture, and Indian creator economy products.

## PRODUCT BRIEF

Build "CreatorAI Pro" — a premium AI-powered content creation SaaS platform targeting Indian 
content creators, agencies, and digital marketing teams. This is a superior alternative to 
bigcreator.in with the following improvements:

### CORE PROBLEMS WE SOLVE
1. Indian creators waste 6–10 hours/week writing scripts, hooks, and captions from scratch
2. Existing AI tools (ChatGPT, Jasper) aren't trained for Hinglish, Indian cultural context, or 
   local trends
3. No existing tool combines trend discovery + voice modeling + content creation + publishing 
   in one place
4. Agencies managing 50+ creators have no white-label multi-creator workflow tool

### TARGET USERS
- Tier 1: Individual Indian content creators (YouTube, Instagram Reels, LinkedIn)
- Tier 2: Digital marketing agencies managing multiple creator accounts (B2B)
- Tier 3: Brands doing in-house influencer content

### TECH STACK (Mandatory)
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **UI Components**: shadcn/ui + Radix UI primitives
- **Backend**: Next.js API Routes + tRPC for type-safe API
- **Database**: PostgreSQL (Supabase or Neon) with Prisma ORM
- **Auth**: Clerk or NextAuth.js with Google, GitHub OAuth
- **AI/LLM**: OpenAI GPT-4o (primary), Anthropic Claude 3.5 Sonnet (fallback), Whisper API (transcription)
- **Background Jobs**: Inngest or BullMQ for async scraping/AI jobs
- **File Storage**: Cloudflare R2 or AWS S3
- **Payments**: Razorpay (INR) + Stripe (USD international)
- **Analytics**: PostHog for product analytics, Vercel Analytics for web
- **Email**: Resend (transactional) + Loops (lifecycle marketing)
- **Deployment**: Vercel (frontend/API) + Railway (background workers)
- **Monitoring**: Sentry + BetterStack Uptime

---

## FEATURES TO BUILD (in priority order)

### PHASE 1 — CORE MVP (Weeks 1–4)

#### 1. Authentication & Onboarding
- Multi-step onboarding wizard (niche selection, platform choice, language preference)
- Social login (Google, Instagram OAuth for profile import)
- Email/password with magic link option
- Language preference setting: Hindi / English / Hinglish
- Onboarding progress tracking with skip options

#### 2. Trend Intelligence Engine
- **Real-time Trend Scraper**: Crawl YouTube Trending, Instagram Explore (via official APIs where 
  available, Apify/Bright Data for others), Twitter Trends API
- **Niche Clustering**: ML-based topic clustering using embeddings (text-embedding-3-small)
- **Trend Scoring**: Composite score = (velocity × engagement_rate × relevance_to_user_niche)
- **Hot Topics Feed**: Real-time dashboard showing top 20 trending topics for selected niche
- **Competitor Analysis**: Enter any Instagram/YouTube handle → get their top 10 viral posts with:
  - View counts, engagement rates, hook analysis, posting time heatmaps
  - Hook extraction using GPT-4o prompt engineering
  - Content gap analysis (what they're NOT covering)

#### 3. Voice DNA Fingerprinting
- Upload past Reels/YT Shorts (video) or paste post captions/scripts (text)
- Whisper AI transcription for video files (Hindi, English, Hinglish)
- GPT-4o analysis extracts: sentence length patterns, vocabulary richness, CTA phrases, 
  emotional tone distribution, filler words, cultural references
- Store as "Voice Profile" JSON in database (user-level and per-creator for agencies)
- Voice Profile accuracy score with improvement suggestions

#### 4. AI Script Writer
- Input: topic (from Hot Topics or manual), platform (YouTube/Reels/Shorts/Podcast), 
  duration target (30s / 60s / 3min / 10min), tone (8 options)
- Apply Voice DNA before generating
- Output: Full structured script with:
  - Hook (first 3 seconds)
  - Main body with timestamps
  - B-roll suggestions
  - Outro/CTA
  - Thumbnail text suggestion
- Multiple variations (generate 3, pick one)
- Hinglish mode with Devanagari ↔ Roman script toggle
- In-browser script editor with collaboration (Yjs CRDT)
- Script version history

#### 5. Caption & Hashtag AI
- One-click caption from script OR fresh topic
- Platform-specific formatting (Instagram vs LinkedIn vs YouTube description)
- 30 hyper-targeted hashtags (researched, not generic)
- Hashtag performance tier labels (high/medium/niche)
- Emoji injection toggle
- Caption A/B testing (generate 2 variants)

### PHASE 2 — GROWTH FEATURES (Weeks 5–8)

#### 6. Direct Publishing Integration (MAJOR DIFFERENTIATOR vs competitors)
- Instagram Graph API for publishing Reels with caption + hashtags
- YouTube Data API for uploading Shorts
- LinkedIn API for posts
- Buffer/Hootsuite webhook fallback for unsupported platforms
- Schedule posts from visual content calendar
- Post queue with optimal timing AI (learns from your past performance data)

#### 7. Content Calendar (Visual, Drag-and-Drop)
- Full monthly/weekly/daily calendar view
- Color-coded by platform and content type
- Drag-and-drop post scheduling
- Bulk import from CSV
- Repeating series support (e.g., "Weekly Tech Tip every Tuesday")
- Team collaboration with comment threads per post

#### 8. Performance Analytics Flywheel (Long-term Moat)
- After publishing, sync performance data back (likes, saves, shares, reach, watch time %)
- Feed metrics back into script recommendations:
  - "Your 60s Reels about [topic] get 2× more saves than 30s — recommend 60s format"
  - "Hooks with questions get 40% more engagement for your audience"
- Creator Performance Dashboard: weekly/monthly analytics overview
- Insight cards ("Your Wednesday posts perform 60% better")
- AI-generated content strategy recommendation (monthly report, email digest)

#### 9. B2B Agency Dashboard (HIGHEST PRIORITY REVENUE UNLOCK)
- Multi-creator seat management (add/remove creators under one agency account)
- Per-creator Voice DNA profiles
- Agency-level content calendar showing all creators
- White-label report generation (PDF/CSV export with agency branding)
- Role-based access: Agency Owner → Content Manager → Creator (read-only dashboard)
- Approval workflow: content manager creates → creator approves → auto-publishes
- Client-facing portal: creators see their own dashboard, agencies see all

#### 10. Annual Billing + Multi-Currency
- Toggle between monthly and annual billing on pricing page (save 2 months = 17% off)
- Annual billing reduces churn by ~40%
- Razorpay for INR payments (UPI, Cards, Netbanking, EMI)
- Stripe for USD international creators

### PHASE 3 — ADVANCED FEATURES (Weeks 9–12)

#### 11. AI Reel Transcription + Repurposing
- Upload any Reel/Short/Podcast → Whisper transcribes
- Auto-generate: LinkedIn post, Twitter thread, Blog post draft, Email newsletter snippet
- "One video → 5 content pieces" workflow
- Cross-post scheduling from a single piece of content

#### 12. Competitor Intelligence Reports
- Weekly automated email reports for selected competitors
- "Your competitor just went viral with [topic] — write your version now" notifications
- Trend alert system (push/email/in-app)
- Niche saturation score ("this topic is getting crowded")

#### 13. AI Video Script Templates Library
- 50+ proven script templates categorized by:
  - Genre (tech review, day-in-life, tutorial, story time, top 10)
  - Platform (Reels, YT Shorts, LinkedIn, Podcast)
  - Goal (viral reach, lead gen, community building, sales)
- Community template marketplace (creators share templates, earn credits)

#### 14. Creator Collaboration Network (Future Moat)
- Collab opportunity matching based on niche overlap + audience complement
- Joint script creation with shared editing sessions
- Shoutout automation

---

## DATABASE SCHEMA

```sql
-- Users & Auth
users (id, email, name, avatar_url, plan_id, agency_id, created_at)
plans (id, name, price_monthly, price_annual, limits jsonb)
subscriptions (id, user_id, plan_id, status, current_period_end, razorpay_sub_id)

-- Creator Profiles
creator_profiles (id, user_id, niche, platforms[], language_pref, onboarding_complete)
voice_profiles (id, creator_id, raw_analysis jsonb, vocabulary jsonb, tone_scores jsonb, version)

-- Content
scripts (id, creator_id, topic, platform, tone, content text, voice_profile_id, status, created_at)
script_versions (id, script_id, content, created_by, created_at)
captions (id, creator_id, script_id, platform, content, hashtags[], variant)
scheduled_posts (id, creator_id, caption_id, platform, scheduled_at, published_at, status)

-- Analytics
post_metrics (id, scheduled_post_id, likes, comments, shares, saves, reach, watch_time_pct, synced_at)
trend_scores (id, topic, niche, score, velocity, scraped_at)
competitor_data (id, handle, platform, post_url, views, engagement_rate, hook_text, scraped_at)

-- Agency
agencies (id, name, logo_url, white_label_domain, owner_id)
agency_members (id, agency_id, user_id, role enum('owner','manager','creator'))
agency_creators (id, agency_id, creator_id, assigned_manager_id)
approval_workflows (id, agency_id, content_id, status, approver_id, approved_at)
```

---

## UI/UX DESIGN SYSTEM

### Color Palette
```css
/* Brand Colors */
--primary: #6C47FF;          /* Electric violet — primary CTA */
--primary-dark: #4F35CC;     /* Hover state */
--accent: #FF6B35;           /* Orange accent — highlights */
--accent-glow: #FF6B3520;    /* Glow effect */

/* Background Layers (Dark Mode First) */
--bg-base: #08090E;          /* Page background */
--bg-surface: #111218;       /* Card backgrounds */
--bg-elevated: #1A1B26;      /* Modals, dropdowns */
--bg-border: #2A2B38;        /* Borders */

/* Text */
--text-primary: #F4F4F8;     /* Main text */
--text-secondary: #8B8FA8;   /* Muted text */
--text-tertiary: #4A4D6A;    /* Disabled/placeholder */

/* Semantic */
--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Typography
```
Headings: "Clash Display" or "Cabinet Grotesk" (bold, modern)
Body: "Inter" (clean, readable)
Code/Script: "JetBrains Mono" (script editor)
Indian languages: "Noto Sans Devanagari" (Hindi rendering)
```

### Key UI Patterns
1. **Glassmorphism cards** with `backdrop-filter: blur(16px)` and subtle border gradients
2. **Gradient mesh backgrounds** in hero and section highlights
3. **Animated gradient borders** on premium feature cards
4. **Skeleton loaders** for all AI-generating states
5. **Streaming text UI** for script generation (typewriter effect, token-by-token)
6. **Command palette** (⌘K) for power users
7. **Floating action button** on mobile for quick script creation
8. **Toast notifications** with contextual actions
9. **Progress rings** for usage limits (visual quota tracking)
10. **Confetti animation** on first script generation

---

## API ARCHITECTURE

### tRPC Routers
```
auth.router        → profile, updatePreferences, deleteAccount
creator.router     → voiceProfile.create/update/get, nicheSelect
trend.router       → getHotTopics, searchCompetitor, getTrendScore
script.router      → generate, list, get, update, delete, duplicate
caption.router     → generate, list, regenerate, getHashtags
calendar.router    → createPost, schedulePost, getCalendar, movePost
publish.router     → connectPlatform, publishNow, publishScheduled
analytics.router   → getDashboard, syncMetrics, getInsights
agency.router      → createAgency, addMember, getCreators, getReport
billing.router     → getPlans, createSubscription, getUsage
```

### Background Job Queue (Inngest)
```
scrape/competitor-analysis    → runs on demand, 2-5 min
scrape/hot-topics             → runs every 4 hours
ai/generate-script            → triggered by user action, streams response
ai/voice-profile-analysis     → triggered after upload, 30-60 sec
publish/scheduled-post        → triggered by calendar scheduler
analytics/sync-metrics        → runs every 6 hours per published post
reports/weekly-digest         → runs every Monday 9 AM IST
```

---

## LANDING PAGE SECTIONS (in order)

1. **Hero** — Headline: "Turn Trends into Viral Scripts — In Your Voice. In Hinglish."
   - Sub-headline: "The only AI content tool built for Indian creators that learns YOUR tone, 
     scrapes trending topics, and writes production-ready scripts in minutes."
   - CTA: "Start Free — No Credit Card" + "Watch 90-second Demo"
   - Social proof: "Trusted by 5,000+ Indian creators" + platform logos
   - Hero visual: animated dashboard preview (Lottie or video)

2. **Problem Section** — "The Creator's Biggest Time Suck"
   - Before/After comparison slider
   - Pain points: blank page anxiety, trend research fatigue, inconsistent voice

3. **How It Works** — 4-step flow with animated illustrations
   Step 1: Connect your profiles
   Step 2: AI learns your voice
   Step 3: Pick trending topics
   Step 4: Generate, edit, publish

4. **Feature Deep Dives** — One section per major feature with:
   - Live interactive demos (not just screenshots)
   - Side-by-side "Without CreatorAI vs With CreatorAI"

5. **Agency Section** — Dedicated B2B pitch with ROI calculator
   "If your agency manages 20 creators × 4 scripts/week × 6 hrs/script = 480 hrs/week saved"

6. **Social Proof** — Video testimonials + metrics wall
   "28K followers gained", "10× faster workflow"

7. **Pricing** — 4 tiers with monthly/annual toggle
   - Free: ₹0
   - Creator: ₹399/mo (₹299 annual)
   - Pro: ₹999/mo (₹799 annual)
   - Agency: ₹4,999/mo (₹3,999 annual)

8. **FAQ** — 12 questions covering technical + trust concerns

9. **Footer** — Feature pages, blog, docs, social links

---

## PRICING STRATEGY (Improved from Big Creator)

| Tier | Monthly | Annual | Key Limits | Target |
|------|---------|--------|------------|--------|
| Free | ₹0 | ₹0 | 3 scripts, 5 captions, 1 competitor scan | Acquisition |
| Creator | ₹399 | ₹299/mo | 50 scripts, 50 captions, 10 scans, calendar | Solopreneurs |
| Pro | ₹999 | ₹799/mo | Unlimited, publishing, analytics, 3 seats | Full-time creators |
| Agency | ₹4,999 | ₹3,999/mo | 25 creator seats, white-label, approval flows | Agencies |

**Key improvements over Big Creator:**
- Annual billing (reduces churn 40%)
- Agency tier (5–10× higher LTV)
- Better value at each tier (more scripts per ₹)
- Clearer upgrade triggers (usage limits with progress bars)

---

## STEP-BY-STEP IMPLEMENTATION ROADMAP

### PHASE 0: Project Setup (Day 1–2)
- [ ] `npx create-next-app@latest creatorai-pro --typescript --tailwind --app`
- [ ] Install shadcn/ui: `npx shadcn-ui@latest init`
- [ ] Install Prisma, tRPC, Clerk Auth
- [ ] Set up Supabase/Neon PostgreSQL instance
- [ ] Configure environment variables (.env.local)
- [ ] Set up ESLint, Prettier, Husky pre-commit hooks
- [ ] Initialize Git repository and GitHub Actions CI
- [ ] Deploy skeleton to Vercel

### PHASE 1: Auth & Database Foundation (Days 3–7)
- [ ] Implement Clerk authentication (Google + Email)
- [ ] Build Prisma schema with all models
- [ ] Run migrations and seed database
- [ ] Create tRPC router scaffolding
- [ ] Build multi-step onboarding flow (niche, platform, language)
- [ ] User profile page

### PHASE 2: Design System & Landing Page (Days 8–14)
- [ ] Implement global CSS design tokens (colors, typography, spacing)
- [ ] Build component library:
  - Button, Badge, Card, Input, Modal, Toast, Skeleton
  - GradientBorder, GlassCard, AnimatedGradient
- [ ] Build landing page (all 9 sections)
- [ ] Implement Framer Motion animations:
  - Hero entrance animation
  - Scroll-triggered section reveals
  - Dashboard preview animation
- [ ] Mobile-responsive layouts
- [ ] SEO meta tags, Open Graph, sitemap.xml

### PHASE 3: Core AI Features (Days 15–28)
- [ ] Build AI Script Writer:
  - tRPC `script.generate` with OpenAI streaming
  - Script editor with Tiptap or CodeMirror
  - Voice DNA application logic
  - 8-tone variation system
- [ ] Build Caption & Hashtag AI:
  - tRPC `caption.generate`
  - Platform-specific formatting logic
  - Hashtag research integration
- [ ] Build Trend Intelligence:
  - Inngest job: `scrape/hot-topics`
  - YouTube Trends API integration
  - GPT-4o topic clustering
- [ ] Build Competitor Analyzer:
  - Apify actor for Instagram/YouTube scraping
  - Hook extraction prompt engineering
  - Visual competitor report page

### PHASE 4: Voice DNA Engine (Days 22–28)
- [ ] File upload UI (video/audio/text)
- [ ] Whisper API integration for transcription
- [ ] Voice analysis prompt (extract vocabulary, tone, rhythms)
- [ ] Voice profile storage and versioning
- [ ] Voice accuracy score UI
- [ ] Apply DNA to script generation

### PHASE 5: Dashboard & App Shell (Days 25–35)
- [ ] Build sidebar navigation (collapsible, mobile-responsive)
- [ ] Command palette (⌘K) with fuzzy search
- [ ] Usage quota tracking (progress rings)
- [ ] Notification system (in-app + email)
- [ ] Recent activity feed
- [ ] Quick-action widget panel

### PHASE 6: Content Calendar (Days 32–40)
- [ ] Visual calendar component (monthly/weekly/daily views)
- [ ] Drag-and-drop post scheduling
- [ ] Post creation modal from calendar
- [ ] Platform color coding
- [ ] Bulk CSV import
- [ ] Team collaboration: comment threads per post

### PHASE 7: Publishing Integration (Days 38–48)
- [ ] Instagram Graph API: OAuth connect + Reel publish
- [ ] YouTube Data API v3: OAuth connect + Short upload
- [ ] LinkedIn API: OAuth connect + post publish
- [ ] Publish queue job (Inngest scheduled trigger)
- [ ] "Optimal timing" AI suggestion
- [ ] Platform connection health dashboard

### PHASE 8: Analytics Flywheel (Days 45–55)
- [ ] Inngest job: `analytics/sync-metrics` (fetch post performance)
- [ ] Creator analytics dashboard (PostHog-style)
- [ ] Insight card generation (GPT-4o summarizes patterns)
- [ ] Script recommendation engine (uses performance history)
- [ ] Weekly performance email digest (Resend)

### PHASE 9: B2B Agency Tier (Days 52–65)
- [ ] Agency account creation flow
- [ ] Multi-seat user management
- [ ] Role-based access control (RBAC)
- [ ] Per-creator voice profile management
- [ ] Approval workflow UI (submit → review → approve → publish)
- [ ] White-label PDF report generator
- [ ] Agency analytics overview

### PHASE 10: Billing & Payments (Days 60–70)
- [ ] Razorpay subscription integration (INR)
- [ ] Stripe integration (USD)
- [ ] Monthly/annual billing toggle
- [ ] Usage-based billing for agency overages
- [ ] Invoice generation and download
- [ ] Upgrade/downgrade flow with proration
- [ ] Payment failure recovery emails

### PHASE 11: Polish & Launch Prep (Days 68–80)
- [ ] Lighthouse audit: target 95+ performance score
- [ ] Sentry error monitoring
- [ ] BetterStack uptime monitoring
- [ ] Load testing with k6
- [ ] Security audit (API rate limiting, input validation, CSRF)
- [ ] GDPR/data deletion compliance
- [ ] Help documentation (Mintlify or Gitbook)
- [ ] Customer support chat (Crisp or Intercom)

### PHASE 12: Post-Launch (Ongoing)
- [ ] PostHog funnels to identify drop-offs
- [ ] A/B test pricing page (annual upsell banner)
- [ ] Referral program (give 1 month, get 1 month)
- [ ] Creator community on Discord
- [ ] Product Hunt launch strategy
- [ ] Influencer early access program

---

## KEY ARCHITECTURAL DECISIONS

### 1. Scraping Strategy (Resilience First)
**Problem**: Instagram/YouTube actively ban scrapers.
**Solution**:
- Primary: Use official APIs (YouTube Data API, Instagram Graph API) — slower but reliable
- Secondary: Apify cloud actors for extended data (proxy-rotated, TOS-compliant within fair use)
- Tertiary: Bright Data Scraping Browser as final fallback
- All scraped data is cached for 4 hours to reduce requests
- Graceful degradation: if scraping fails, show cached data with "last updated" timestamp

### 2. AI Cost Management
- Cache all AI responses keyed by (topic + tone + voice_profile_hash)
- Use GPT-4o-mini for caption generation, GPT-4o for scripts
- Implement credit system server-side — never trust client
- Rate limit: 3 AI requests/second per user, 100/day on free plan
- Stream responses using Vercel AI SDK for perceived speed

### 3. Multi-Tenancy (Agency Architecture)
- Row-level security in PostgreSQL via Supabase RLS
- Tenant isolation at middleware level (verify JWT → extract org_id → apply to all queries)
- Agency subdomain support: `{agency-slug}.creatoraipro.com`

### 4. Indian Language Support
- Store scripts in UTF-8 (full Unicode support)
- Whisper API handles Hindi/Hinglish natively
- Devanagari ↔ Roman transliteration library: `transliterate` or `indic-transliteration`
- Font loading: Noto Sans Devanagari via Google Fonts with swap strategy

---

## COMPETITIVE ADVANTAGES OVER BIG CREATOR

| Feature | Big Creator | CreatorAI Pro |
|---------|-------------|---------------|
| Direct Publishing | ❌ No | ✅ Instagram + YouTube + LinkedIn |
| Annual Billing | ❌ No | ✅ 17% discount, reduces churn |
| Agency Tier | ❌ No | ✅ ₹4,999/mo white-label |
| Performance Analytics | ❌ No | ✅ Flywheel feedback loop |
| Script Collaboration | ❌ No | ✅ Real-time co-editing (Yjs) |
| Approval Workflows | ❌ No | ✅ Agency content governance |
| Content Repurposing | ❌ No | ✅ 1 video → 5 formats |
| Template Marketplace | ❌ No | ✅ Community-driven library |
| Command Palette | ❌ No | ✅ ⌘K power user mode |
| Mobile PWA | ❌ No | ✅ Fully responsive + installable |

---

## ESTIMATED DEVELOPMENT RESOURCES

| Role | Hours/Week | Duration | Cost (₹) |
|------|-----------|----------|----------|
| Lead Full-Stack (Next.js + AI) | 40 hrs | 12 weeks | ₹2,40,000 |
| Backend/DevOps Engineer | 20 hrs | 8 weeks | ₹80,000 |
| UI/UX Designer | 20 hrs | 4 weeks | ₹60,000 |
| QA Engineer | 15 hrs | 4 weeks | ₹30,000 |
| **Total Development** | | | **~₹4,10,000** |
| Infrastructure (Vercel, DB, APIs) | | | ~₹15,000/mo |
| 3rd Party APIs (OpenAI, Whisper, Apify) | | | ~₹20,000/mo |

---

## SUCCESS METRICS (Month 1–6 Targets)

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Signups | 500 | 2,000 | 8,000 |
| Paid Conversions | 5% = 25 | 8% = 160 | 12% = 960 |
| Agency Accounts | 2 | 15 | 50 |
| MRR | ₹20,000 | ₹1,50,000 | ₹8,00,000 |
| Churn (monthly) | <10% | <6% | <4% |
| NPS Score | 40 | 55 | 70 |
```

---

## Open Questions for Review

> [!IMPORTANT]
> **Decision Required**: Should we build this as a **Next.js monorepo** (all-in-one) or split 
> into a **Next.js frontend + FastAPI backend** for the AI-heavy background jobs?
> 
> **Recommendation**: Next.js monorepo first (faster to ship), migrate AI workers to Python later.

> [!WARNING]
> **Legal Risk**: Instagram's TOS prohibits automated scraping. Consider using only official 
> APIs + Apify's "ethical scraping" service which operates within rate limits.

> [!NOTE]
> **Phase MVP Recommendation**: If you want to go live in 4 weeks, cut Phase 3 (Publishing 
> Integration) and Phase 9 (Agency Tier) from the initial launch and ship them as "coming soon" 
> with a waitlist. This dramatically reduces scope while capturing the market.
