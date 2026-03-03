import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { NotFoundError, AuthenticationError } from '../utils/errors';

const prisma = new PrismaClient();

const COMMENT_INCLUDE = {
  user: { select: { imageData: true } },
  post: { select: { userId: true } },
  replies: {
    where: { isDeleted: false },
    orderBy: { createdAt: 'asc' as const },
    include: {
      user: { select: { imageData: true } },
      post: { select: { userId: true } },
    },
  },
};

const POST_INCLUDE = {
  likes: true,
  comments: {
    where: { isDeleted: false, parentId: null },
    orderBy: { createdAt: 'asc' as const },
    include: COMMENT_INCLUDE,
  },
  project: {
    include: {
      images: true,
      user: { select: { firstName: true, lastName: true, username: true, imageData: true } },
    },
  },
};

export const postResolvers = {
  Query: {
    feed: async (_: any, { page = 1, limit = 20 }: { page?: number; limit?: number }) => {
      return prisma.post.findMany({
        where: { isHidden: false },
        include: POST_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });
    },

    post: async (_: any, { id }: { id: string }) => {
      const post = await prisma.post.findUnique({ where: { id }, include: POST_INCLUDE });
      if (!post) throw new NotFoundError('Post not found');
      return post;
    },

    myPost: async (_: any, { projectId }: { projectId: string }, context: any) => {
      const user = requireAuth(context);
      return prisma.post.findUnique({
        where: { projectId },
        include: POST_INCLUDE,
      }).then((p) => (p?.userId === user.userId ? p : null));
    },

    userPosts: async (_: any, { username }: { username: string }) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || user.isDeleted) return [];
      return prisma.post.findMany({
        where: { userId: user.id, isHidden: false },
        include: POST_INCLUDE,
        orderBy: { createdAt: 'desc' },
      });
    },

    userProfile: async (_: any, { username }: { username: string }) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || user.isDeleted) throw new NotFoundError('User not found');
      const [posts, completedProjectsCount] = await Promise.all([
        prisma.post.findMany({
          where: { userId: user.id, isHidden: false },
          include: POST_INCLUDE,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.project.count({
          where: { userId: user.id, status: 'COMPLETED', isDeleted: false },
        }),
      ]);
      return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        imageData: user.imageData || null,
        completedProjectsCount,
        posts,
      };
    },
  },

  Mutation: {
    createOrUpdatePost: async (_: any, { projectId, input }: any, context: any) => {
      const user = requireAuth(context);
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) throw new NotFoundError('Project not found');
      if (project.userId !== user.userId) throw new AuthenticationError('Forbidden');

      const post = await prisma.post.upsert({
        where: { projectId },
        create: { projectId, userId: user.userId, ...input },
        update: input,
        include: POST_INCLUDE,
      });
      return post;
    },

    deletePost: async (_: any, { id }: { id: string }, context: any) => {
      const user = requireAuth(context);
      const post = await prisma.post.findUnique({ where: { id } });
      if (!post) throw new NotFoundError('Post not found');
      if (post.userId !== user.userId) throw new AuthenticationError('Forbidden');
      await prisma.post.delete({ where: { id } });
      return true;
    },

    likePost: async (_: any, { postId, fingerprint }: { postId: string; fingerprint: string }) => {
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post) throw new NotFoundError('Post not found');
      await prisma.like.upsert({
        where: { postId_fingerprint: { postId, fingerprint } },
        create: { postId, fingerprint },
        update: {},
      });
      return prisma.post.findUnique({ where: { id: postId }, include: POST_INCLUDE })!;
    },

    unlikePost: async (_: any, { postId, fingerprint }: { postId: string; fingerprint: string }) => {
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post) throw new NotFoundError('Post not found');
      await prisma.like.deleteMany({ where: { postId, fingerprint } });
      return prisma.post.findUnique({ where: { id: postId }, include: POST_INCLUDE })!;
    },

    addComment: async (_: any, { postId, input }: { postId: string; input: any }, context: any) => {
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post) throw new NotFoundError('Post not found');

      // If authenticated, use the user's real name and link userId
      let userId: string | undefined;
      let authorName = input.authorName;
      try {
        const authUser = requireAuth(context);
        userId = authUser.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) authorName = `${user.firstName} ${user.lastName}`.trim();
      } catch {
        // anonymous comment — keep the provided authorName
      }

      const comment = await prisma.comment.create({
        data: {
          postId,
          content: input.content,
          authorName,
          ...(userId && { userId }),
          ...(input.parentId && { parentId: input.parentId }),
        },
        include: COMMENT_INCLUDE,
      });
      return comment;
    },

    editComment: async (_: any, { id, content }: { id: string; content: string }, context: any) => {
      const authUser = requireAuth(context);
      const comment = await prisma.comment.findUnique({ where: { id } });
      if (!comment) throw new NotFoundError('Comment not found');
      if (comment.userId !== authUser.userId) throw new AuthenticationError('Forbidden');

      // 10-minute edit window
      const ageMs = Date.now() - new Date(comment.createdAt).getTime();
      if (ageMs > 10 * 60 * 1000) throw new Error('Edit window has expired');

      return prisma.comment.update({
        where: { id },
        data: { content },
        include: COMMENT_INCLUDE,
      });
    },

    deleteComment: async (_: any, { id }: { id: string }, context: any) => {
      const authUser = requireAuth(context);
      const comment = await prisma.comment.findUnique({
        where: { id },
        include: { post: { select: { userId: true } } },
      });
      if (!comment) throw new NotFoundError('Comment not found');

      // Allow: comment owner OR post author
      const isOwner = comment.userId === authUser.userId;
      const isPostAuthor = comment.post.userId === authUser.userId;
      if (!isOwner && !isPostAuthor) throw new AuthenticationError('Forbidden');

      await prisma.comment.update({ where: { id }, data: { isDeleted: true } });
      return true;
    },
  },

  Post: {
    projectName: (parent: any) => parent.project?.name || '',
    createdBy: (parent: any) => {
      const u = parent.project?.user;
      return u ? `${u.firstName} ${u.lastName}`.trim() : '';
    },
    username: (parent: any) => parent.project?.user?.username || '',
    createdByImageData: (parent: any) => parent.project?.user?.imageData || null,
    images: (parent: any) => {
      const projectImages: any[] = parent.project?.images || [];
      return projectImages.filter((img: any) => {
        if (img.category === 'RENDER') return parent.showRenderImages;
        if (img.category === 'FINISHED') return parent.showFinishedImages;
        return true;
      });
    },
    likeCount: (parent: any) => parent.likes?.length || 0,
    commentCount: (parent: any) => parent.comments?.length || 0,
    isLikedByMe: (parent: any, { fingerprint }: { fingerprint: string }) => {
      return (parent.likes || []).some((l: any) => l.fingerprint === fingerprint);
    },
    comments: (parent: any) => parent.comments || [],
  },

  Comment: {
    userImageData: (parent: any) => parent.user?.imageData || null,
    isAuthor: (parent: any) => {
      return Boolean(parent.userId && parent.userId === parent.post?.userId);
    },
    replies: (parent: any) => parent.replies || [],
  },
};
