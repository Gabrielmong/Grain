import { PrismaClient } from '@prisma/client';
import { requireAuth, requireOwnership } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export const finishResolvers = {
  Query: {
    finishes: async (
      _: any,
      { includeDeleted = false }: { includeDeleted?: boolean },
      context: any
    ) => {
      const user = requireAuth(context);

      return prisma.finish.findMany({
        where: {
          userId: user.userId,
          ...(includeDeleted ? {} : { isDeleted: false }),
        },
        orderBy: { createdAt: 'desc' },
      });
    },

    finish: async (_: any, { id }: { id: string }, context: any) => {
      const finish = await prisma.finish.findUnique({
        where: { id },
      });

      if (!finish) {
        throw new NotFoundError('Finish not found');
      }

      requireOwnership(context, finish.userId);

      return finish;
    },
  },

  Mutation: {
    createFinish: async (_: any, { input }: any, context: any) => {
      const user = requireAuth(context);

      return prisma.finish.create({
        data: {
          ...input,
          userId: user.userId,
        },
      });
    },

    updateFinish: async (_: any, { id, input }: any, context: any) => {
      const finish = await prisma.finish.findUnique({
        where: { id },
      });

      if (!finish) {
        throw new NotFoundError('Finish not found');
      }

      requireOwnership(context, finish.userId);

      return prisma.finish.update({
        where: { id },
        data: input,
      });
    },

    deleteFinish: async (_: any, { id }: { id: string }, context: any) => {
      const finish = await prisma.finish.findUnique({
        where: { id },
      });

      if (!finish) {
        throw new NotFoundError('Finish not found');
      }

      requireOwnership(context, finish.userId);

      return prisma.finish.update({
        where: { id },
        data: { isDeleted: true },
      });
    },

    restoreFinish: async (_: any, { id }: { id: string }, context: any) => {
      const finish = await prisma.finish.findUnique({
        where: { id },
      });

      if (!finish) {
        throw new NotFoundError('Finish not found');
      }

      requireOwnership(context, finish.userId);

      return prisma.finish.update({
        where: { id },
        data: { isDeleted: false },
      });
    },

    hardDeleteFinish: async (_: any, { id }: { id: string }, context: any) => {
      const finish = await prisma.finish.findUnique({
        where: { id },
      });

      if (!finish) {
        throw new NotFoundError('Finish not found');
      }

      requireOwnership(context, finish.userId);

      await prisma.finish.delete({
        where: { id },
      });
      return true;
    },
  },
};
