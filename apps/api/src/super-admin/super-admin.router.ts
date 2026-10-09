import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getTenantContext } from '../utils/tenant';

const CreateAcademySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  domain: z.string().optional(),
  ownerName: z.string().min(2),
  ownerEmail: z.string().email(),
  ownerPhone: z.string().optional(),
  adminPassword: z.string().min(6).default('Password@123'),
  subscription: z.enum(['FREE', 'STARTER', 'GROWTH', 'ENTERPRISE']).default('GROWTH'),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'TRIAL']).default('ACTIVE'),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

const UpdateAcademySchema = z.object({
  name: z.string().min(2).optional(),
  domain: z.string().optional(),
  cname: z.string().optional(),
  ownerName: z.string().optional(),
  ownerEmail: z.string().email().optional(),
  ownerPhone: z.string().optional(),
  subscription: z.enum(['FREE', 'STARTER', 'GROWTH', 'ENTERPRISE']).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'TRIAL']).optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
});

export default async function superAdminRouter(app: FastifyInstance) {
  // Middleware: All routes in this router require Global Super Admin permissions
  app.addHook('preHandler', async (req, reply) => {
    const { isGlobalSuperAdmin } = getTenantContext(req);
    if (!isGlobalSuperAdmin) {
      return reply.code(403).send({
        error: 'Forbidden',
        message: 'Super Admin privileges required to access control plane endpoints.'
      });
    }
  });

  // GET /api/v1/super-admin/stats — Platform Overview
  app.get('/stats', async (req, reply) => {
    const [
      totalAcademies,
      activeAcademies,
      totalStudents,
      totalCourses,
      totalUsers,
      planBreakdown
    ] = await Promise.all([
      app.prisma.organization.count(),
      app.prisma.organization.count({ where: { status: 'ACTIVE' } }),
      app.prisma.student.count(),
      app.prisma.course.count(),
      app.prisma.user.count(),
      app.prisma.organization.groupBy({
        by: ['subscription'],
        _count: { id: true }
      })
    ]);

    return {
      success: true,
      stats: {
        totalAcademies,
        activeAcademies,
        totalStudents,
        totalCourses,
        totalUsers,
        plans: planBreakdown.map(p => ({
          plan: p.subscription,
          count: p._count.id
        }))
      }
    };
  });

  // GET /api/v1/super-admin/academies — List all tenant academies
  app.get('/academies', async (req, reply) => {
    const organizations = await app.prisma.organization.findMany({
      include: {
        _count: {
          select: {
            users: true,
            courses: true,
            batches: true,
            leads: true
          }
        },
        users: {
          where: { role: 'ADMIN' },
          select: { id: true, email: true, firstName: true, lastName: true },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = await Promise.all(organizations.map(async (org) => {
      const studentCount = await app.prisma.user.count({
        where: { organizationId: org.id, role: 'STUDENT' }
      });

      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        domain: org.domain || `${org.slug}.echolms.com`,
        cname: org.cname,
        status: org.status,
        subscription: org.subscription,
        ownerName: org.ownerName || (org.users[0] ? `${org.users[0].firstName} ${org.users[0].lastName}` : 'N/A'),
        ownerEmail: org.ownerEmail || (org.users[0] ? org.users[0].email : 'N/A'),
        ownerPhone: org.ownerPhone || 'N/A',
        totalUsers: org._count.users,
        studentsCount: studentCount,
        coursesCount: org._count.courses,
        batchesCount: org._count.batches,
        leadsCount: org._count.leads,
        createdAt: org.createdAt.toISOString()
      };
    }));

    return { success: true, academies: formatted, total: formatted.length };
  });

  // POST /api/v1/super-admin/academies — Provision a new tenant academy
  app.post('/academies', async (req, reply) => {
    const body = CreateAcademySchema.parse(req.body);

    // Verify slug uniqueness
    const existingOrg = await app.prisma.organization.findUnique({
      where: { slug: body.slug }
    });

    if (existingOrg) {
      return reply.code(409).send({
        error: 'Conflict',
        message: `Academy with slug '${body.slug}' already exists.`
      });
    }

    // Verify admin email uniqueness
    const existingUser = await app.prisma.user.findUnique({
      where: { email: body.ownerEmail }
    });

    if (existingUser) {
      return reply.code(409).send({
        error: 'Conflict',
        message: `User with email '${body.ownerEmail}' already exists.`
      });
    }

    const passwordHash = await bcrypt.hash(body.adminPassword, 10);
    const names = body.ownerName.split(' ');
    const firstName = names[0] || 'Admin';
    const lastName = names.slice(1).join(' ') || 'Owner';

    const result = await app.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: body.name,
          slug: body.slug,
          domain: body.domain || `${body.slug}.echolms.com`,
          ownerName: body.ownerName,
          ownerEmail: body.ownerEmail,
          ownerPhone: body.ownerPhone,
          subscription: body.subscription,
          status: body.status,
          primaryColor: body.primaryColor || '#2563eb',
          secondaryColor: body.secondaryColor || '#1e40af',
          logoUrl: '/echo_logo.png',
          academyLogoUrl: '/echo_logo.png'
        }
      });

      const adminUser = await tx.user.create({
        data: {
          email: body.ownerEmail,
          passwordHash,
          firstName,
          lastName,
          role: 'ADMIN',
          organizationId: org.id
        }
      });

      return { org, adminUser };
    });

    // Record audit trail
    const reqUser = (req as any).user;
    if (reqUser?.id) {
      await app.prisma.auditLog.create({
        data: {
          userId: reqUser.id,
          action: 'CREATE',
          resource: 'Organization',
          resourceId: result.org.id,
          changes: { name: body.name, slug: body.slug, subscription: body.subscription }
        }
      }).catch(() => {});
    }

    reply.code(201);
    return {
      success: true,
      message: 'Academy provisioned successfully',
      academy: {
        id: result.org.id,
        name: result.org.name,
        slug: result.org.slug,
        subscription: result.org.subscription,
        status: result.org.status,
        adminUser: {
          id: result.adminUser.id,
          email: result.adminUser.email,
          role: result.adminUser.role
        }
      }
    };
  });

  // PATCH /api/v1/super-admin/academies/:id — Update academy settings / subscription
  app.patch('/academies/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = UpdateAcademySchema.parse(req.body);

    const existing = await app.prisma.organization.findUnique({ where: { id } });
    if (!existing) {
      return reply.notFound(`Academy ${id} not found`);
    }

    const updated = await app.prisma.organization.update({
      where: { id },
      data: body
    });

    // Audit log
    const reqUser = (req as any).user;
    if (reqUser?.id) {
      await app.prisma.auditLog.create({
        data: {
          userId: reqUser.id,
          action: 'UPDATE',
          resource: 'Organization',
          resourceId: id,
          changes: body as any
        }
      }).catch(() => {});
    }

    return { success: true, academy: updated };
  });

  // DELETE /api/v1/super-admin/academies/:id — Deactivate / remove an academy
  app.delete('/academies/:id', async (req, reply) => {
    const { id } = req.params as { id: string };

    const existing = await app.prisma.organization.findUnique({
      where: { id },
      include: {
        _count: { select: { users: true, courses: true } }
      }
    });

    if (!existing) {
      return reply.notFound(`Academy ${id} not found`);
    }

    // Set status to SUSPENDED for safe archiving
    const archived = await app.prisma.organization.update({
      where: { id },
      data: { status: 'SUSPENDED' }
    });

    const reqUser = (req as any).user;
    if (reqUser?.id) {
      await app.prisma.auditLog.create({
        data: {
          userId: reqUser.id,
          action: 'DELETE',
          resource: 'Organization',
          resourceId: id,
          changes: { status: 'SUSPENDED' }
        }
      }).catch(() => {});
    }

    return {
      success: true,
      message: `Academy '${existing.name}' suspended successfully`,
      academy: archived
    };
  });

  // POST /api/v1/super-admin/impersonate — Issue impersonation session for target tenant
  app.post('/impersonate', async (req, reply) => {
    const schema = z.object({
      targetTenantId: z.string().min(1)
    });
    const { targetTenantId } = schema.parse(req.body);

    const targetOrg = await app.prisma.organization.findUnique({
      where: { id: targetTenantId }
    });

    if (!targetOrg) {
      return reply.notFound(`Target tenant organization '${targetTenantId}' not found.`);
    }

    const reqUser = (req as any).user;
    const token = app.jwt.sign({
      id: reqUser?.id || 'super-admin-root',
      email: reqUser?.email || 'admin@grekam.in',
      role: 'SUPER_ADMIN',
      organizationId: targetTenantId,
      isImpersonating: true,
      impersonatedTenantId: targetTenantId
    }, { expiresIn: '4h' });

    reply.header('Set-Cookie', `echo_impersonate_tenant=${targetTenantId}; Path=/; SameSite=Lax; Max-Age=14400`);

    // Record audit trail
    if (reqUser?.id) {
      await app.prisma.auditLog.create({
        data: {
          userId: reqUser.id,
          action: 'IMPERSONATE',
          resource: 'Organization',
          resourceId: targetTenantId,
          changes: { targetTenant: targetOrg.name, slug: targetOrg.slug }
        }
      }).catch(() => {});
    }

    return {
      success: true,
      impersonatingTenantId: targetTenantId,
      impersonatingTenantName: targetOrg.name,
      token,
      message: `Now impersonating ${targetOrg.name}`
    };
  });

  // POST /api/v1/super-admin/impersonate/exit — Exit impersonation
  app.post('/impersonate/exit', async (req, reply) => {
    reply.header('Set-Cookie', 'echo_impersonate_tenant=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0');
    return {
      success: true,
      message: 'Impersonation ended. Returned to Super Admin root scope.'
    };
  });
}
