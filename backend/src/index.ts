import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';
import { PrismaClient } from '@prisma/client';
import { extractTokenFromHeader, verifyToken } from './utils/auth';

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT || 4000;

// Context interface
interface Context {
  prisma: PrismaClient;
  user?: {
    userId: string;
    username: string;
  };
}

async function startServer() {
  // Create Apollo Server
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return error;
    },
  });

  // Start Apollo Server
  await server.start();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Woodwork Calculator Backend is running' });
  });

  // Apollo GraphQL endpoint
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }): Promise<Context> => {
        // Extract token from Authorization header
        const token = extractTokenFromHeader(req.headers.authorization);

        // Verify token and get user payload
        let user = undefined;
        if (token) {
          const payload = verifyToken(token);
          if (payload) {
            user = {
              userId: payload.userId,
              username: payload.username,
            };
          }
        }

        return {
          prisma,
          user,
        };
      },
    })
  );

  // Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`💚 Health check at http://localhost:${PORT}/health`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
