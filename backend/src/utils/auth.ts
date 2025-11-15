import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN as StringValue) || '7d';
const BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS ? parseInt(process.env.BCRYPT_ROUNDS) : 10;

export interface JwtPayload {
  userId: string;
  username: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: JwtPayload): string {
  const options: jwt.SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  }; // Add any options if needed
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;

  // Format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }

  return null;
}
