import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  // Gets the currently logged in user from the database
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.session.userId },
      include: {
        creatorProfile: true,
        agency: true,
      },
    });
    
    return user;
  }),

  // Creates or updates the user profile during onboarding
  completeOnboarding: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().nullable(),
        avatarUrl: z.string().nullable(),
        niche: z.string(),
        platforms: z.array(z.string()),
        languagePref: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const clerkId = ctx.session.userId;
      
      // Upsert the User record
      const user = await ctx.db.user.upsert({
        where: { clerkId },
        update: {
          email: input.email,
          name: input.name,
          avatarUrl: input.avatarUrl,
        },
        create: {
          clerkId,
          email: input.email,
          name: input.name,
          avatarUrl: input.avatarUrl,
        },
      });

      // Upsert the Creator Profile
      await ctx.db.creatorProfile.upsert({
        where: { userId: user.id },
        update: {
          niche: input.niche,
          platforms: input.platforms,
          languagePref: input.languagePref,
          onboardingComplete: true,
        },
        create: {
          userId: user.id,
          niche: input.niche,
          platforms: input.platforms,
          languagePref: input.languagePref,
          onboardingComplete: true,
        },
      });

      return { success: true };
    }),
});
