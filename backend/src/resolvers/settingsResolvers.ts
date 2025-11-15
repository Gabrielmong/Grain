import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const prisma = new PrismaClient();

export const settingsResolvers = {
  Query: {
    settings: async (_: any, __: any, context: any) => {
      const user = requireAuth(context);

      let settings = await prisma.settings.findUnique({
        where: { userId: user.userId },
      });

      // Create default settings if they don't exist
      if (!settings) {
        settings = await prisma.settings.create({
          data: {
            userId: user.userId,
            currency: 'USD',
            language: 'en',
            themeMode: 'light',
          },
        });
      }

      return settings;
    },
  },

  Mutation: {
    updateSettings: async (_: any, { input }: any, context: any) => {
      const user = requireAuth(context);

      // Try to update existing settings
      try {
        return await prisma.settings.update({
          where: { userId: user.userId },
          data: input,
        });
      } catch (error) {
        // If settings don't exist, create them
        return await prisma.settings.create({
          data: {
            userId: user.userId,
            currency: 'USD',
            language: 'en',
            themeMode: 'light',
            ...input,
          },
        });
      }
    },
  },
};
