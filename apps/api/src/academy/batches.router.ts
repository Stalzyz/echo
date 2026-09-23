import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import * as cookie from 'cookie';

const CreateBatchSchema = z.object({
  courseId: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['MORNING', 'EVENING', 'WEEKEND', 'ONLINE']),
  capacity: z.number().int().positive().default(20),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  educatorId: z.string().optional(),
  recordingAccessDays: z.number().int().min(1).default(7),
});

export default async function batchesRouter(app: FastifyInstance) {
  // Helper to extract active tenant
  const getTenantContext = (req: any) => {
    const user = req.user;
    const cookies = cookie.parse(req.headers.cookie || '');
    const impersonatedTenantId = cookies['echo_impersonate_tenant'];
    const isGlobalSuperAdmin = (user?.role === 'SUPER_ADMIN' || user?.role === 'Super Admin') && !impersonatedTenantId;
    const tenantId = (user?.role === 'SUPER_ADMIN' || user?.role === 'Super Admin')
      ? (impersonatedTenantId || null)
      : (user?.organizationId || null);

    return { user, tenantId, isGlobalSuperAdmin };
  };

  // GET /api/v1/academy/batches
  app.get('/batches', async (req, reply) => {
    const { isActive, courseId } = req.query as { isActive?: string; courseId?: string };
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    const orgFilter = isGlobalSuperAdmin
      ? {}
      : { organizationId: tenantId || '__NO_ACCESS__' };
    
    let whereClause: any = {
      ...orgFilter
    };
    if (isActive === 'true') whereClause.isActive = true;
    if (isActive === 'false') whereClause.isActive = false;
    if (courseId) whereClause.courseId = courseId;

    const batches = await app.prisma.batch.findMany({
      where: whereClause,
      include: {
        course: { select: { name: true, code: true } },
        educator: { select: { user: { select: { firstName: true, lastName: true, email: true } } } },
        _count: { select: { enrollments: true, sessions: true } },
      },
      orderBy: { startDate: 'desc' },
    });
    return { data: batches, total: batches.length };
  });

  // POST /api/v1/academy/batches/with-course — Create a Course, LMSCourse, and Batch in one transaction
  app.post('/batches/with-course', async (req, reply) => {
    const schema = z.object({
      courseName: z.string().min(1),
      courseCode: z.string().min(1),
      courseDuration: z.string().optional().default('3 Months'),
      courseFee: z.union([z.number(), z.string()]).optional().transform(v => typeof v === 'string' ? parseFloat(v) || 0 : (v || 0)),
      batchName: z.string().optional(),
      batchType: z.string().optional().default('MORNING'),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      capacity: z.union([z.number(), z.string()]).optional().transform(v => typeof v === 'string' ? parseInt(v, 10) || 20 : (v || 20)),
      educatorId: z.string().optional(),
    });

    const body = schema.parse(req.body);
    const { tenantId } = getTenantContext(req);

    try {
      const result = await app.prisma.$transaction(async (tx) => {
        // 1. Create or find base course scoped to tenant
        let course = await tx.course.findFirst({
          where: {
            code: body.courseCode,
            organizationId: tenantId || null,
          }
        });

        if (!course) {
          course = await tx.course.create({
            data: {
              name: body.courseName,
              code: body.courseCode,
              duration: body.courseDuration || '3 Months',
              fee: body.courseFee,
              isPublished: true,
              organizationId: tenantId || null,
            }
          });
        }

        // 2. Ensure LMS Course exists for curriculum builder & catalog
        const existingLms = await tx.lMSCourse.findUnique({
          where: { courseId: course.id }
        });
        if (!existingLms) {
          await tx.lMSCourse.create({
            data: {
              courseId: course.id,
              isPublished: true,
              draftStatus: 'PUBLISHED',
            }
          });
        }

        // 3. Parse dates safely
        const start = body.startDate ? new Date(body.startDate) : new Date();
        const end = body.endDate ? new Date(body.endDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        const validStart = isNaN(start.getTime()) ? new Date() : start;
        const validEnd = isNaN(end.getTime()) ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : end;

        // 4. Create batch
        const batchName = body.batchName?.trim() || `${body.courseName} - Batch 1`;
        const batch = await tx.batch.create({
          data: {
            courseId: course.id,
            name: batchName,
            type: body.batchType || 'MORNING',
            startDate: validStart,
            endDate: validEnd,
            capacity: body.capacity || 20,
            educatorId: body.educatorId || undefined,
            organizationId: tenantId || null,
          },
          include: {
            course: { select: { name: true, code: true } },
            educator: { select: { user: { select: { firstName: true, lastName: true, email: true } } } },
            _count: { select: { enrollments: true, sessions: true } },
          }
        });

        return batch;
      });

      reply.code(201);
      return result;
    } catch (err: any) {
      if (err.code === 'P2002') {
        return reply.code(400).send({
          error: 'BadRequest',
          message: `Course code "${body.courseCode}" already exists in your academy.`
        });
      }
      app.log.error(err, 'Failed to create course with batch');
      return reply.code(500).send({
        error: 'InternalServerError',
        message: err.message || 'Failed to create course and batch'
      });
    }
  });

  // GET /api/v1/academy/batches/:id
  app.get('/batches/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    const batch = await app.prisma.batch.findUnique({
      where: { id },
      include: {
        course: true,
        educator: { include: { user: true } },
        sessions: { orderBy: { startTime: 'asc' } },
        enrollments: { include: { student: { include: { user: true } } } },
      },
    });
    if (!batch) return reply.notFound('Batch not found');

    if (!isGlobalSuperAdmin && batch.organizationId && batch.organizationId !== tenantId) {
      return reply.code(403).send({ error: 'Forbidden', message: 'Access denied to batch of another tenant' });
    }
    
    const accessDays = (batch as any).recordingAccessDays || 7;
    const now = new Date();

    const formattedSessions = batch.sessions.map((session, index) => {
      const sessionDate = new Date(session.startTime);
      const expiresAt = new Date(sessionDate.getTime() + accessDays * 24 * 60 * 60 * 1000);
      const isExpired = now > expiresAt;
      const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

      return {
        ...session,
        dayNumber: index + 1,
        recordingAccessDays: accessDays,
        expiresAt: expiresAt.toISOString(),
        isExpired,
        daysRemaining
      };
    });

    return { ...batch, sessions: formattedSessions };
  });

  // POST /api/v1/academy/batches
  app.post('/batches', async (req, reply) => {
    const body = CreateBatchSchema.parse(req.body);
    const { tenantId } = getTenantContext(req);

    const batch = await app.prisma.batch.create({
      data: {
        courseId: body.courseId,
        name: body.name,
        type: body.type,
        capacity: body.capacity,
        educatorId: body.educatorId || undefined,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        organizationId: tenantId || null,
      },
    });
    reply.code(201);
    return batch;
  });

  // POST /api/v1/academy/batches/:id/auto-schedule (Generate 45-day daily sessions)
  app.post('/batches/:id/auto-schedule', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { daysCount = 45, defaultMeetLink } = req.body as { daysCount?: number; defaultMeetLink?: string };
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);
    
    const batch = await app.prisma.batch.findUnique({ where: { id } });
    if (!batch) return reply.notFound('Batch not found');

    if (!isGlobalSuperAdmin && batch.organizationId && batch.organizationId !== tenantId) {
      return reply.code(403).send({ error: 'Forbidden', message: 'Access denied to batch of another tenant' });
    }

    const startDate = new Date(batch.startDate);
    const createdSessions: any[] = [];

    for (let i = 0; i < daysCount; i++) {
      const sessionStart = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      sessionStart.setHours(19, 0, 0, 0); // 7:00 PM default
      const sessionEnd = new Date(sessionStart.getTime() + 90 * 60 * 1000); // 90 mins

      const session = await app.prisma.batchSession.create({
        data: {
          batchId: id,
          title: `Day ${i + 1}: Live Session & Interactive Discussion`,
          description: `Comprehensive topic coverage, live coding, Q&A and practical exercise for Day ${i + 1}.`,
          startTime: sessionStart,
          endTime: sessionEnd,
          meetLink: defaultMeetLink || `https://meet.google.com/new`,
          educatorId: batch.educatorId || undefined
        }
      });
      createdSessions.push(session);
    }

    return { success: true, count: createdSessions.length, message: `Generated ${createdSessions.length} daily live sessions!` };
  });

  // PATCH /api/v1/academy/batches/:id
  app.patch('/batches/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    const existing = await app.prisma.batch.findUnique({ where: { id } });
    if (!existing) return reply.notFound('Batch not found');

    if (!isGlobalSuperAdmin && existing.organizationId && existing.organizationId !== tenantId) {
      return reply.code(403).send({ error: 'Forbidden', message: 'Access denied to batch of another tenant' });
    }

    const schema = CreateBatchSchema.partial().extend({ isActive: z.boolean().optional() });
    const body = schema.parse(req.body);
    const batch = await app.prisma.batch.update({
      where: { id },
      data: {
        ...(body.courseId && { courseId: body.courseId }),
        ...(body.name && { name: body.name }),
        ...(body.type && { type: body.type }),
        ...(body.capacity && { capacity: body.capacity }),
        ...(body.educatorId !== undefined && { educatorId: body.educatorId || null }),
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.endDate && { endDate: new Date(body.endDate) }),
        ...(body.isActive !== undefined && { isActive: body.isActive })
      },
    });
    return batch;
  });

  // DELETE /api/v1/academy/batches/:id
  app.delete('/batches/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    const existing = await app.prisma.batch.findUnique({ where: { id } });
    if (!existing) return reply.notFound('Batch not found');

    if (!isGlobalSuperAdmin && existing.organizationId && existing.organizationId !== tenantId) {
      return reply.code(403).send({ error: 'Forbidden', message: 'Access denied to batch of another tenant' });
    }

    await app.prisma.batch.delete({ where: { id } });
    return reply.code(204).send();
  });

  // POST /api/v1/academy/batches/:id/sessions
  app.post('/batches/:id/sessions', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    const batch = await app.prisma.batch.findUnique({ where: { id } });
    if (!batch) return reply.notFound('Batch not found');

    if (!isGlobalSuperAdmin && batch.organizationId && batch.organizationId !== tenantId) {
      return reply.code(403).send({ error: 'Forbidden', message: 'Access denied to batch of another tenant' });
    }

    const SessionSchema = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      startTime: z.string(),
      endTime: z.string(),
      educatorId: z.string().optional(),
      meetLink: z.string().optional(),
      recordingUrl: z.string().optional(),
      location: z.string().optional(),
    });
    const body = SessionSchema.parse(req.body);

    const session = await app.prisma.batchSession.create({
      data: {
        batchId: id,
        title: body.title,
        description: body.description || undefined,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        educatorId: body.educatorId || undefined,
        meetLink: body.meetLink || undefined,
        recordingUrl: body.recordingUrl || undefined,
        location: body.location || undefined,
      },
    });
    reply.code(201);
    return session;
  });

  // PATCH /api/v1/academy/batches/sessions/:sessionId
  app.patch('/batches/sessions/:sessionId', async (req, reply) => {
    const { sessionId } = req.params as { sessionId: string };
    const SessionSchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      meetLink: z.string().optional(),
      recordingUrl: z.string().optional(),
      location: z.string().optional(),
    });
    const body = SessionSchema.parse(req.body);

    const updated = await app.prisma.batchSession.update({
      where: { id: sessionId },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.startTime && { startTime: new Date(body.startTime) }),
        ...(body.endTime && { endTime: new Date(body.endTime) }),
        ...(body.meetLink !== undefined && { meetLink: body.meetLink }),
        ...(body.recordingUrl !== undefined && { recordingUrl: body.recordingUrl }),
        ...(body.location !== undefined && { location: body.location }),
      }
    });

    return updated;
  });

  // DELETE /api/v1/academy/batches/sessions/:sessionId
  app.delete('/batches/sessions/:sessionId', async (req, reply) => {
    const { sessionId } = req.params as { sessionId: string };
    await app.prisma.batchSession.delete({ where: { id: sessionId } }).catch(() => {});
    return { success: true, message: "Session deleted" };
  });

  // GET /api/v1/academy/batches/sessions/upcoming
  app.get('/batches/sessions/upcoming', async (req, reply) => {
    const { user, tenantId, isGlobalSuperAdmin } = getTenantContext(req);
    
    // Find students belonging to current tenant
    const orgFilter = isGlobalSuperAdmin
      ? {}
      : { user: { organizationId: tenantId || '__NO_ACCESS__' } };

    const students = await app.prisma.student.findMany({
      where: orgFilter,
      select: { id: true }
    });

    if (students.length === 0) return { data: [] };

    const studentIds = students.map(s => s.id);

    const enrollments = await app.prisma.enrollment.findMany({
      where: { studentId: { in: studentIds } },
      select: { batchId: true }
    });

    const batchIds = enrollments.map(e => e.batchId);

    const sessions = await app.prisma.batchSession.findMany({
      where: {
        batchId: { in: batchIds }
      },
      include: {
        batch: {
          include: { course: true }
        }
      },
      orderBy: { startTime: 'asc' }
    });

    return { data: sessions };
  });
}
