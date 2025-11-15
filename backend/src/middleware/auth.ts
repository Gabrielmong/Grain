import { AuthenticationError } from '../utils/errors';

/**
 * Middleware to check if user is authenticated
 * Use this in resolvers that require authentication
 */
export function requireAuth(context: any) {
  if (!context.user) {
    throw new AuthenticationError('You must be logged in to perform this action');
  }
  return context.user;
}

/**
 * Middleware to check if the resource belongs to the authenticated user
 */
export function requireOwnership(context: any, resourceUserId: string) {
  const user = requireAuth(context);

  if (user.userId !== resourceUserId) {
    throw new AuthenticationError('You do not have permission to access this resource');
  }

  return user;
}
