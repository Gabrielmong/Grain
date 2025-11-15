import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { AuthenticationError, ValidationError, NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export const userResolvers = {
  Query: {
    // Get current authenticated user
    me: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const user = await prisma.user.findUnique({
        where: { id: context.user.userId },
      });

      if (!user || user.isDeleted) {
        throw new AuthenticationError('User not found');
      }

      return user;
    },

    // Get all users (admin functionality)
    users: async (_: any, { includeDeleted = false }: { includeDeleted?: boolean }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      return prisma.user.findMany({
        where: includeDeleted ? {} : { isDeleted: false },
        orderBy: { createdAt: 'desc' },
      });
    },

    // Get user by ID
    user: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      return prisma.user.findUnique({
        where: { id },
      });
    },
  },

  Mutation: {
    // Register new user (Public)
    register: async (_: any, { input }: any) => {
      const { username, email, password, firstName, lastName, dateOfBirth, hasAcceptedTerms, imageData } = input;

      // Validate terms acceptance
      if (!hasAcceptedTerms) {
        throw new ValidationError('You must accept the terms and conditions');
      }

      // Check if username already exists
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        throw new ValidationError('Username already exists');
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEmail = await prisma.user.findUnique({
          where: { email },
        });

        if (existingEmail) {
          throw new ValidationError('Email already exists');
        }
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          firstName,
          lastName,
          dateOfBirth,
          hasAcceptedTerms,
          imageData,
          settings: {
            create: {
              currency: 'USD',
              language: 'en',
              themeMode: 'light',
            },
          },
        },
      });

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        username: user.username,
      });

      return {
        token,
        user,
      };
    },

    // Login (Public)
    login: async (_: any, { input }: any) => {
      const { username, password } = input;

      // Find user by username
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user || user.isDeleted) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Compare password
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        username: user.username,
      });

      return {
        token,
        user,
      };
    },

    // Update user (Private)
    updateUser: async (_: any, { input }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const { email, firstName, lastName, dateOfBirth, hasAcceptedTerms, imageData } = input;

      // Check if email already exists (if being updated)
      if (email) {
        const existingEmail = await prisma.user.findUnique({
          where: { email },
        });

        if (existingEmail && existingEmail.id !== context.user.userId) {
          throw new ValidationError('Email already exists');
        }
      }

      return prisma.user.update({
        where: { id: context.user.userId },
        data: {
          ...(email !== undefined && { email }),
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(dateOfBirth !== undefined && { dateOfBirth }),
          ...(hasAcceptedTerms !== undefined && { hasAcceptedTerms }),
          ...(imageData !== undefined && { imageData }),
        },
      });
    },

    // Change password (Private)
    changePassword: async (_: any, { input }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const { currentPassword, newPassword } = input;

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: context.user.userId },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Verify current password
      const isPasswordValid = await comparePassword(currentPassword, user.password);

      if (!isPasswordValid) {
        throw new ValidationError('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: context.user.userId },
        data: { password: hashedPassword },
      });

      return true;
    },

    // Soft delete user (Private)
    deleteUser: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      return prisma.user.update({
        where: { id: context.user.userId },
        data: { isDeleted: true },
      });
    },

    // Restore user (Private - admin)
    restoreUser: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      return prisma.user.update({
        where: { id },
        data: { isDeleted: false },
      });
    },
  },
};
