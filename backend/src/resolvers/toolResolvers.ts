import { PrismaClient } from '@prisma/client';
import { requireAuth, requireOwnership } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export const toolResolvers = {
  Query: {
    tools: async (_: any, { includeDeleted = false }: { includeDeleted?: boolean }, context: any) => {
      const user = requireAuth(context);

      return prisma.tool.findMany({
        where: {
          userId: user.userId,
          ...(includeDeleted ? {} : { isDeleted: false }),
        },
        orderBy: { createdAt: 'desc' },
      });
    },

    tool: async (_: any, { id }: { id: string }, context: any) => {
      const user = requireAuth(context);

      const tool = await prisma.tool.findUnique({
        where: { id },
      });

      if (!tool) {
        throw new NotFoundError('Tool not found');
      }

      requireOwnership(context, tool.userId);

      return tool;
    },
  },

  Mutation: {
    createTool: async (_: any, { input }: any, context: any) => {
      const user = requireAuth(context);

      return prisma.tool.create({
        data: {
          ...input,
          userId: user.userId,
        },
      });
    },

    updateTool: async (_: any, { id, input }: any, context: any) => {
      const user = requireAuth(context);

      const tool = await prisma.tool.findUnique({
        where: { id },
      });

      if (!tool) {
        throw new NotFoundError('Tool not found');
      }

      requireOwnership(context, tool.userId);

      return prisma.tool.update({
        where: { id },
        data: input,
      });
    },

    deleteTool: async (_: any, { id }: { id: string }, context: any) => {
      const user = requireAuth(context);

      const tool = await prisma.tool.findUnique({
        where: { id },
      });

      if (!tool) {
        throw new NotFoundError('Tool not found');
      }

      requireOwnership(context, tool.userId);

      return prisma.tool.update({
        where: { id },
        data: { isDeleted: true },
      });
    },

    restoreTool: async (_: any, { id }: { id: string }, context: any) => {
      const user = requireAuth(context);

      const tool = await prisma.tool.findUnique({
        where: { id },
      });

      if (!tool) {
        throw new NotFoundError('Tool not found');
      }

      requireOwnership(context, tool.userId);

      return prisma.tool.update({
        where: { id },
        data: { isDeleted: false },
      });
    },

    hardDeleteTool: async (_: any, { id }: { id: string }, context: any) => {
      const user = requireAuth(context);

      const tool = await prisma.tool.findUnique({
        where: { id },
      });

      if (!tool) {
        throw new NotFoundError('Tool not found');
      }

      requireOwnership(context, tool.userId);

      await prisma.tool.delete({
        where: { id },
      });
      return true;
    },
  },
};
