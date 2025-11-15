# Authentication Implementation Guide

This document describes the complete JWT-based authentication system implemented in the Woodwork Calculator backend.

## Overview

The backend uses **JSON Web Tokens (JWT)** for stateless authentication with **bcrypt** for secure password hashing. All routes except `register` and `login` are protected and require a valid JWT token.

## Key Components

### 1. User Model (`prisma/schema.prisma`)

```prisma
model User {
  id                String    @id @default(uuid())
  username          String    @unique
  email             String?   @unique
  password          String    // bcrypt hashed
  firstName         String
  lastName          String
  dateOfBirth       DateTime?
  hasAcceptedTerms  Boolean   @default(false)
  imageData         String?   @db.Text
  isDeleted         Boolean   @default(false)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relations
  lumber            Lumber[]
  finishes          Finish[]
  projects          Project[]
  settings          Settings?
}
```

### 2. Authentication Utilities (`src/utils/auth.ts`)

**Password Hashing:**
- `hashPassword(password)` - Hash password with bcrypt (10 rounds)
- `comparePassword(password, hash)` - Verify password against hash

**JWT Operations:**
- `generateToken(payload)` - Create JWT token (expires in 7 days)
- `verifyToken(token)` - Verify and decode JWT token
- `extractTokenFromHeader(authHeader)` - Extract token from Authorization header

### 3. Authentication Middleware (`src/middleware/auth.ts`)

**Authorization Checks:**
- `requireAuth(context)` - Throws error if user is not authenticated
- `requireOwnership(context, resourceUserId)` - Ensures user owns the resource

### 4. Error Handling (`src/utils/errors.ts`)

Custom GraphQL errors:
- `AuthenticationError` - Not authenticated (401)
- `ForbiddenError` - Access denied (403)
- `ValidationError` - Bad user input (400)
- `NotFoundError` - Resource not found (404)

### 5. Context Setup (`src/index.ts`)

The Apollo Server context extracts and verifies the JWT token from the Authorization header:

```typescript
context: async ({ req }): Promise<Context> => {
  const token = extractTokenFromHeader(req.headers.authorization);
  let user = undefined;

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      user = { userId: payload.userId, username: payload.username };
    }
  }

  return { prisma, user };
}
```

## Public Routes (No Authentication Required)

### Register
```graphql
mutation {
  register(input: {
    username: "johndoe"
    email: "john@example.com"
    password: "securepass123"
    firstName: "John"
    lastName: "Doe"
    hasAcceptedTerms: true
  }) {
    token
    user {
      id
      username
      firstName
      lastName
    }
  }
}
```

**Process:**
1. Validates terms acceptance
2. Checks for duplicate username/email
3. Hashes password with bcrypt
4. Creates user in database
5. Creates default settings for user
6. Generates and returns JWT token

### Login
```graphql
mutation {
  login(input: {
    username: "johndoe"
    password: "securepass123"
  }) {
    token
    user {
      id
      username
      firstName
      lastName
    }
  }
}
```

**Process:**
1. Finds user by username
2. Verifies password with bcrypt
3. Generates and returns JWT token

## Protected Routes (Authentication Required)

All other queries and mutations require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### User Queries
- `me` - Get current authenticated user
- `users` - List all users
- `user(id)` - Get user by ID

### User Mutations
- `updateUser(input)` - Update current user profile
- `changePassword(input)` - Change user password
- `deleteUser` - Soft delete user account
- `restoreUser(id)` - Restore soft-deleted user

### Data Access Protection

All resource resolvers (lumber, finish, project) implement:

1. **Authentication Check**: `requireAuth(context)` ensures user is logged in
2. **Ownership Check**: `requireOwnership(context, resourceUserId)` ensures user owns the resource
3. **Query Filtering**: Automatically filters results by `userId`

Example from `lumberResolvers.ts`:

```typescript
lumbers: async (_: any, { includeDeleted = false }, context: any) => {
  const user = requireAuth(context); // Check authentication

  return prisma.lumber.findMany({
    where: {
      userId: user.userId, // Filter by user
      ...(includeDeleted ? {} : { isDeleted: false }),
    },
  });
}
```

## Data Isolation

Each user's data is completely isolated:

- **Lumber**: Only shows lumber created by the authenticated user
- **Finishes**: Only shows finishes created by the authenticated user
- **Projects**: Only shows projects created by the authenticated user
- **Settings**: Each user has their own settings (one-to-one relationship)
- **Dashboard Stats**: Aggregates data only for the authenticated user

## Security Features

### Password Security
- **Bcrypt hashing** with 10 salt rounds
- Passwords never stored in plain text
- Password comparison uses constant-time comparison

### Token Security
- **JWT tokens** signed with secret key
- Token expiration (default 7 days)
- Stateless authentication (no session storage)

### Data Security
- **User-scoped queries**: All queries filter by userId
- **Ownership validation**: Cannot modify other users' resources
- **Soft delete**: User accounts and data marked as deleted, not removed
- **Cascade deletion**: When user is deleted, all related data is deleted

### Input Validation
- Username uniqueness enforced at database level
- Email uniqueness enforced at database level
- Terms acceptance required for registration
- Password verification before changes

## Environment Variables

Required environment variables in `.env`:

```
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
```

**Security Notes:**
- Use a strong, random secret in production (minimum 32 characters)
- Keep the secret secure and never commit to version control
- Rotate secrets periodically for maximum security

## Error Messages

Authentication errors return descriptive messages:

- `"Not authenticated"` - No valid token provided
- `"Invalid credentials"` - Wrong username or password
- `"Username already exists"` - Registration failed, username taken
- `"Email already exists"` - Registration failed, email taken
- `"You must accept the terms and conditions"` - Terms not accepted
- `"Current password is incorrect"` - Password change failed
- `"You do not have permission to access this resource"` - Ownership check failed

## Testing Authentication

### 1. Register a new user
```graphql
mutation {
  register(input: {
    username: "testuser"
    password: "testpass123"
    firstName: "Test"
    lastName: "User"
    hasAcceptedTerms: true
  }) {
    token
    user { id username }
  }
}
```

### 2. Copy the token from the response

### 3. Set the Authorization header in GraphQL Playground

Click "HTTP HEADERS" at the bottom and add:
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

### 4. Make authenticated requests

```graphql
query {
  me {
    id
    username
    firstName
    lastName
  }

  lumbers {
    id
    name
  }

  dashboardStats {
    totalProjects
    totalLumber
  }
}
```

## Migration Guide

If you're adding authentication to an existing system:

1. Run `npm install bcrypt jsonwebtoken @types/bcrypt @types/jsonwebtoken`
2. Update Prisma schema to add User model and relationships
3. Run `npx prisma migrate dev --name add-authentication`
4. Add JWT_SECRET to `.env`
5. Update all resolvers to include authentication checks
6. Update frontend to store and send JWT token

## Best Practices

✅ **DO:**
- Use HTTPS in production
- Store JWT in httpOnly cookies or secure storage
- Implement token refresh for better UX
- Add rate limiting to login/register endpoints
- Log authentication failures for security monitoring
- Use strong password requirements

❌ **DON'T:**
- Store JWT in localStorage (XSS vulnerability)
- Use weak JWT secrets
- Send tokens in URL parameters
- Store passwords in plain text
- Skip HTTPS in production
- Expose user enumeration in error messages

## Future Enhancements

Potential improvements to the authentication system:

- **Refresh Tokens**: Long-lived refresh tokens for better UX
- **Email Verification**: Verify email addresses before account activation
- **Password Reset**: Email-based password reset flow
- **Two-Factor Authentication**: TOTP-based 2FA
- **OAuth Integration**: Social login (Google, GitHub, etc.)
- **Role-Based Access Control**: Admin, user, guest roles
- **Session Management**: Track active sessions and allow logout from all devices
- **Account Lockout**: Temporary lockout after failed login attempts
- **Audit Logging**: Track all authentication events

## Troubleshooting

### "Not authenticated" error
- Verify token is included in Authorization header
- Check token format: `Bearer <token>`
- Ensure token hasn't expired
- Verify JWT_SECRET matches between registration and verification

### "Invalid credentials" error
- Check username is correct
- Verify password is correct
- Ensure user account isn't soft-deleted (isDeleted = false)

### Token expiration
- Default expiration is 7 days
- User must login again after token expires
- Consider implementing refresh tokens for longer sessions
