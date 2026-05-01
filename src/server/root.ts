import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { scriptRouter } from "./routers/script";
import { captionRouter } from "./routers/caption";
import { trendRouter } from "./routers/trend";
import { competitorRouter } from "./routers/competitor";
import { dashboardRouter } from "./routers/dashboard";
import { agencyRouter } from "./routers/agency";
import { autoDmRouter } from "./routers/autodm";

export const appRouter = createTRPCRouter({
  user: userRouter,
  script: scriptRouter,
  caption: captionRouter,
  trend: trendRouter,
  competitor: competitorRouter,
  dashboard: dashboardRouter,
  agency: agencyRouter,
  autoDm: autoDmRouter,
});

export type AppRouter = typeof appRouter;
