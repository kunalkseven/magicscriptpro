import { appRouter } from "@/server/root";
import { createTRPCContext } from "@/server/trpc";
import { headers } from "next/headers";

export const trpcServer = async () => {
  const h = await headers();
  const ctx = await createTRPCContext({ headers: h });
  return appRouter.createCaller(ctx);
};
