import { PrismaClient } from '@prisma/client';
import { requireAuth, requireOwnership } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

const CUSTOMER_INCLUDE = {
  customerProjects: {
    include: {
      project: {
        include: {
          boards: { include: { lumber: true } },
          projectFinishes: { include: { finish: true } },
          projectSheetGoods: { include: { sheetGood: true } },
          projectConsumables: { include: { consumable: true } },
          images: true,
        },
      },
    },
  },
};

export const customerResolvers = {
  Query: {
    customers: async (
      _: any,
      { includeDeleted = false }: { includeDeleted?: boolean },
      context: any
    ) => {
      const user = requireAuth(context);
      return prisma.customer.findMany({
        where: {
          userId: user.userId,
          ...(includeDeleted ? {} : { isDeleted: false }),
        },
        include: CUSTOMER_INCLUDE,
        orderBy: { createdAt: 'desc' },
      });
    },

    customer: async (_: any, { id }: { id: string }, context: any) => {
      const customer = await prisma.customer.findUnique({ where: { id }, include: CUSTOMER_INCLUDE });
      if (!customer) throw new NotFoundError('Customer not found');
      requireOwnership(context, customer.userId);
      return customer;
    },
  },

  Mutation: {
    createCustomer: async (_: any, { input }: any, context: any) => {
      const user = requireAuth(context);
      const { projectIds, ...data } = input;

      return prisma.customer.create({
        data: {
          ...data,
          userId: user.userId,
          ...(projectIds?.length && {
            customerProjects: { create: projectIds.map((projectId: string) => ({ projectId })) },
          }),
        },
        include: CUSTOMER_INCLUDE,
      });
    },

    updateCustomer: async (_: any, { id, input }: any, context: any) => {
      const customer = await prisma.customer.findUnique({ where: { id } });
      if (!customer) throw new NotFoundError('Customer not found');
      requireOwnership(context, customer.userId);

      const { projectIds, ...data } = input;

      return prisma.$transaction(async (tx) => {
        if (projectIds !== undefined) {
          await tx.customerProject.deleteMany({ where: { customerId: id } });
        }
        return tx.customer.update({
          where: { id },
          data: {
            ...data,
            ...(projectIds !== undefined && {
              customerProjects: { create: projectIds.map((projectId: string) => ({ projectId })) },
            }),
          },
          include: CUSTOMER_INCLUDE,
        });
      });
    },

    deleteCustomer: async (_: any, { id }: { id: string }, context: any) => {
      const customer = await prisma.customer.findUnique({ where: { id }, include: CUSTOMER_INCLUDE });
      if (!customer) throw new NotFoundError('Customer not found');
      requireOwnership(context, customer.userId);
      return prisma.customer.update({ where: { id }, data: { isDeleted: true }, include: CUSTOMER_INCLUDE });
    },

    restoreCustomer: async (_: any, { id }: { id: string }, context: any) => {
      const customer = await prisma.customer.findUnique({ where: { id }, include: CUSTOMER_INCLUDE });
      if (!customer) throw new NotFoundError('Customer not found');
      requireOwnership(context, customer.userId);
      return prisma.customer.update({ where: { id }, data: { isDeleted: false }, include: CUSTOMER_INCLUDE });
    },

    hardDeleteCustomer: async (_: any, { id }: { id: string }, context: any) => {
      const customer = await prisma.customer.findUnique({ where: { id } });
      if (!customer) throw new NotFoundError('Customer not found');
      requireOwnership(context, customer.userId);
      await prisma.customer.delete({ where: { id } });
      return true;
    },
  },

  Customer: {
    projects: (parent: any) => parent.customerProjects?.map((cp: any) => cp.project) || [],
  },
};
