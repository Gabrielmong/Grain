import { PrismaClient } from '@prisma/client';
import { requireAuth, requireOwnership } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export const lumberResolvers = {
  Query: {
    lumbers: async (_: any, { includeDeleted = false }: { includeDeleted?: boolean }, context: any) => {
      const user = requireAuth(context);

      return prisma.lumber.findMany({
        where: {
          userId: user.userId,
          ...(includeDeleted ? {} : { isDeleted: false }),
        },
        orderBy: { createdAt: 'desc' },
      });
    },

    lumber: async (_: any, { id }: { id: string }, context: any) => {
      const user = requireAuth(context);

      const lumber = await prisma.lumber.findUnique({
        where: { id },
      });

      if (!lumber) {
        throw new NotFoundError('Lumber not found');
      }

      requireOwnership(context, lumber.userId);

      return lumber;
    },
  },

  Mutation: {
    createLumber: async (_: any, { input }: any, context: any) => {
      const user = requireAuth(context);

      return prisma.lumber.create({
        data: {
          ...input,
          userId: user.userId,
        },
      });
    },

    updateLumber: async (_: any, { id, input }: any, context: any) => {
      const user = requireAuth(context);

      const lumber = await prisma.lumber.findUnique({
        where: { id },
      });

      if (!lumber) {
        throw new NotFoundError('Lumber not found');
      }

      requireOwnership(context, lumber.userId);

      return prisma.lumber.update({
        where: { id },
        data: input,
      });
    },

    deleteLumber: async (_: any, { id }: { id: string }, context: any) => {
      const user = requireAuth(context);

      const lumber = await prisma.lumber.findUnique({
        where: { id },
      });

      if (!lumber) {
        throw new NotFoundError('Lumber not found');
      }

      requireOwnership(context, lumber.userId);

      return prisma.lumber.update({
        where: { id },
        data: { isDeleted: true },
      });
    },

    restoreLumber: async (_: any, { id }: { id: string }, context: any) => {
      const user = requireAuth(context);

      const lumber = await prisma.lumber.findUnique({
        where: { id },
      });

      if (!lumber) {
        throw new NotFoundError('Lumber not found');
      }

      requireOwnership(context, lumber.userId);

      return prisma.lumber.update({
        where: { id },
        data: { isDeleted: false },
      });
    },

    hardDeleteLumber: async (_: any, { id }: { id: string }, context: any) => {
      const user = requireAuth(context);

      const lumber = await prisma.lumber.findUnique({
        where: { id },
      });

      if (!lumber) {
        throw new NotFoundError('Lumber not found');
      }

      requireOwnership(context, lumber.userId);

      await prisma.lumber.delete({
        where: { id },
      });
      return true;
    },
  },
};
