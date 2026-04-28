import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const agencyRouter = createTRPCRouter({
  createAgency: protectedProcedure
    .input(z.object({
      name: z.string().min(3),
      whiteLabelDomain: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.session.userId },
      });

      if (!user) throw new Error("User not found");

      return ctx.db.agency.create({
        data: {
          name: input.name,
          whiteLabelDomain: input.whiteLabelDomain,
          ownerId: user.id,
          members: {
            create: {
              userId: user.id,
              role: "OWNER",
            },
          },
        },
      });
    }),

  getAgency: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.session.userId },
    });

    if (!user) return null;

    return ctx.db.agency.findFirst({
      where: {
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } }
        ]
      },
      include: {
        members: {
          include: { user: true }
        },
        managedCreators: {
          include: { creator: { include: { user: true } } }
        }
      }
    });
  }),

  inviteCreator: protectedProcedure
    .input(z.object({
      agencyId: z.string(),
      creatorId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.agencyCreator.create({
        data: {
          agencyId: input.agencyId,
          creatorId: input.creatorId,
        },
      });
    }),

  getApprovalPendingScripts: protectedProcedure
    .input(z.object({ agencyId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.approvalWorkflow.findMany({
        where: {
          agencyId: input.agencyId,
          status: "pending",
        },
        include: {
          script: {
            include: { creator: { include: { user: true } } }
          }
        }
      });
    }),

  approveScript: protectedProcedure
    .input(z.object({
      workflowId: z.string(),
      status: z.enum(["approved", "rejected"]),
      comments: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.session.userId },
      });

      if (!user) throw new Error("User not found");

      return ctx.db.approvalWorkflow.update({
        where: { id: input.workflowId },
        data: {
          status: input.status,
          comments: input.comments,
          approverId: user.id,
          approvedAt: input.status === "approved" ? new Date() : null,
        },
      });
    }),
});
