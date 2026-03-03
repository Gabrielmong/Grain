import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import multer from 'multer';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';
import { PrismaClient } from '@prisma/client';
import { extractTokenFromHeader, verifyToken } from './utils/auth';
import { uploadToS3 } from './services/s3';

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT || 4000;
const BACKEND_URL = process.env.BACKEND_URL || 'localhost';

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

  // Image upload endpoint
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
  app.post('/upload', upload.single('file'), async (req: any, res: any) => {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token || !verifyToken(token)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    try {
      const folder = (req.query.folder as string) || 'uploads';
      const url = await uploadToS3(req.file.buffer, req.file.mimetype, folder);
      return res.json({ url });
    } catch (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Upload failed' });
    }
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
    console.log(`🚀 Server ready at http://${BACKEND_URL}:${PORT}/graphql`);
    console.log(`💚 Health check at http://${BACKEND_URL}:${PORT}/health`);
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
