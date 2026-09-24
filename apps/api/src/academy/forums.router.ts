import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getTenantContext } from '../utils/tenant';

export default async function forumsRouter(app: FastifyInstance) {
  // GET /api/v1/academy/forums (Overview)
  app.get('/', async (req, reply) => {
    const { orgFilter, tenantId, isGlobalSuperAdmin } = getTenantContext(req);
    const postOrgFilter = isGlobalSuperAdmin ? {} : { category: { organizationId: tenantId || '__NO_ACCESS__' } };

    const categories = await app.prisma.forumCategory.findMany({
      where: orgFilter,
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' }
    });
    const recentPosts = await app.prisma.forumPost.findMany({
      take: 20,
      where: postOrgFilter,
      include: {
        author: { select: { firstName: true, lastName: true, role: true } },
        category: true,
        _count: { select: { replies: true } }
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }]
    });
    return { data: { categories, recentPosts }, totalCategories: categories.length };
  });

  // GET /api/v1/academy/forums/categories
  app.get('/categories', async (req, reply) => {
    const { orgFilter } = getTenantContext(req);
    const categories = await app.prisma.forumCategory.findMany({
      where: orgFilter,
      include: {
        _count: { select: { posts: true } }
      }
    });
    return { data: categories };
  });

  // POST /api/v1/academy/forums/categories
  app.post('/categories', async (req, reply) => {
    const { tenantId } = getTenantContext(req);
    const schema = z.object({
      name: z.string(),
      description: z.string().optional(),
      slug: z.string().optional(),
    });
    const body = schema.parse(req.body);
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const category = await app.prisma.forumCategory.create({
      data: {
        name: body.name,
        description: body.description,
        slug,
        ...(tenantId ? { organizationId: tenantId } : {})
      }
    });
    reply.code(201);
    return { data: category };
  });

  // GET /api/v1/academy/forums/posts
  app.get('/posts', async (req, reply) => {
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);
    const { categoryId } = req.query as { categoryId?: string };
    
    const postOrgFilter = isGlobalSuperAdmin ? {} : { category: { organizationId: tenantId || '__NO_ACCESS__' } };
    const posts = await app.prisma.forumPost.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...postOrgFilter
      },
      include: {
        author: { select: { firstName: true, lastName: true, role: true } },
        category: true,
        _count: { select: { replies: true } }
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    return { data: posts };
  });

  // POST /api/v1/academy/forums/posts
  app.post('/posts', async (req, reply) => {
    const { categoryId, authorId, title, content } = req.body as { categoryId: string; authorId: string; title: string; content: string };
    
    const post = await app.prisma.forumPost.create({
      data: {
        categoryId,
        authorId,
        title,
        content
      }
    });

    // Award 5 XP for creating a post! (Gamification)
    const student = await app.prisma.student.findUnique({ where: { userId: authorId } });
    if (student) {
      await app.prisma.student.update({
        where: { id: student.id },
        data: { xp: { increment: 5 } }
      });
    }
    
    return reply.status(201).send({ success: true, post });
  });

  // GET /api/v1/academy/forums/posts/:id
  app.get('/posts/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    
    const post = await app.prisma.forumPost.findUnique({
      where: { id },
      include: {
        author: { select: { firstName: true, lastName: true, role: true } },
        replies: {
          include: { author: { select: { firstName: true, lastName: true, role: true } } },
          orderBy: [{ isAccepted: 'desc' }, { createdAt: 'asc' }]
        }
      }
    });

    if (!post) return reply.notFound('Post not found');
    return { data: post };
  });

  // POST /api/v1/academy/forums/posts/:id/replies
  app.post('/posts/:id/replies', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { authorId, content } = req.body as { authorId: string; content: string };

    const forumReply = await app.prisma.forumReply.create({
      data: {
        postId: id,
        authorId,
        content
      }
    });

    // Award 2 XP for replying
    const student = await app.prisma.student.findUnique({ where: { userId: authorId } });
    if (student) {
      await app.prisma.student.update({
        where: { id: student.id },
        data: { xp: { increment: 2 } }
      });
    }

    return reply.status(201).send({ success: true, reply: forumReply });
  });
}
