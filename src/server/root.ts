import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { scriptRouter } from "./routers/script";
import { captionRouter } from "./routers/caption";
import { trendRouter } from "./routers/trend";
import { competitorRouter } from "./routers/competitor";

export const appRouter = createTRPCRouter({
  user: userRouter,
  script: scriptRouter,
  caption: captionRouter,
  trend: trendRouter,
  competitor: competitorRouter,
});

export type AppRouter = typeof appRouter;
