import { PrismaClient } from '@prisma/client';
import { requireAuth, requireOwnership } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

// Helper function to calculate board feet
// Formula: (width × thickness × length_in_inches) / 144 × quantity
// 1 vara = 33 inches
const calculateBoardFeet = (
  width: number,
  thickness: number,
  length: number,
  quantity: number
): number => {
  const lengthInInches = length * 33;
  return ((width * thickness * lengthInInches) / 144) * quantity;
};

export const projectResolvers = {
  Query: {
    projects: async (
      _: any,
      { includeDeleted = false }: { includeDeleted?: boolean },
      context: any
    ) => {
      const user = requireAuth(context);
      return prisma.project.findMany({
        where: {
          userId: user.userId,
          ...(includeDeleted ? {} : { isDeleted: false }),
        },
        include: {
          boards: {
            include: {
              lumber: true,
            },
          },
          finishes: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    },

    project: async (_: any, { id }: { id: string }, context: any) => {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          boards: {
            include: {
              lumber: true,
            },
          },
          finishes: true,
        },
      });

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      requireOwnership(context, project.userId);

      return project;
    },
  },

  Mutation: {
    createProject: async (_: any, { input }: any, context: any) => {
      const user = requireAuth(context);
      const { boards, finishIds, ...projectData } = input;

      return prisma.project.create({
        data: {
          ...projectData,
          userId: user.userId,
          boards: {
            create: boards,
          },
          finishes: {
            connect: finishIds.map((id: string) => ({ id })),
          },
        },
        include: {
          boards: {
            include: {
              lumber: true,
            },
          },
          finishes: true,
        },
      });
    },

    updateProject: async (_: any, { id, input }: any, context: any) => {
      const { boards, finishIds, ...projectData } = input;

      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      requireOwnership(context, project.userId);

      // Delete existing boards if boards are being updated
      if (boards) {
        await prisma.board.deleteMany({
          where: { projectId: id },
        });
      }

      return prisma.project.update({
        where: { id },
        data: {
          ...projectData,
          ...(boards && {
            boards: {
              create: boards,
            },
          }),
          ...(finishIds && {
            finishes: {
              set: finishIds.map((finishId: string) => ({ id: finishId })),
            },
          }),
        },
        include: {
          boards: {
            include: {
              lumber: true,
            },
          },
          finishes: true,
        },
      });
    },

    deleteProject: async (_: any, { id }: { id: string }, context: any) => {
      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      requireOwnership(context, project.userId);

      return prisma.project.update({
        where: { id },
        data: { isDeleted: true },
        include: {
          boards: {
            include: {
              lumber: true,
            },
          },
          finishes: true,
        },
      });
    },

    restoreProject: async (_: any, { id }: { id: string }, context: any) => {
      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      requireOwnership(context, project.userId);

      return prisma.project.update({
        where: { id },
        data: { isDeleted: false },
        include: {
          boards: {
            include: {
              lumber: true,
            },
          },
          finishes: true,
        },
      });
    },

    hardDeleteProject: async (_: any, { id }: { id: string }, context: any) => {
      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      requireOwnership(context, project.userId);

      await prisma.project.delete({
        where: { id },
      });
      return true;
    },
  },

  // Field resolvers for computed values
  Project: {
    totalBoardFeet: (parent: any) => {
      return parent.boards.reduce((total: number, board: any) => {
        return (
          total + calculateBoardFeet(board.width, board.thickness, board.length, board.quantity)
        );
      }, 0);
    },

    materialCost: (parent: any) => {
      return parent.boards.reduce((total: number, board: any) => {
        const boardFeet = calculateBoardFeet(
          board.width,
          board.thickness,
          board.length,
          board.quantity
        );
        return total + boardFeet * board.lumber.costPerBoardFoot;
      }, 0);
    },

    finishCost: (parent: any) => {
      return parent.finishes.reduce((total: number, finish: any) => {
        return total + finish.price;
      }, 0);
    },

    totalCost: (parent: any) => {
      const materialCost = parent.boards.reduce((total: number, board: any) => {
        const boardFeet = calculateBoardFeet(
          board.width,
          board.thickness,
          board.length,
          board.quantity
        );
        return total + boardFeet * board.lumber.costPerBoardFoot;
      }, 0);

      const finishCost = parent.finishes.reduce((total: number, finish: any) => {
        return total + finish.price;
      }, 0);

      return materialCost + finishCost + parent.laborCost + parent.miscCost;
    },
  },

  Board: {
    boardFeet: (parent: any) => {
      return calculateBoardFeet(parent.width, parent.thickness, parent.length, parent.quantity);
    },
  },
};
