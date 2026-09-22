import { FastifyInstance } from 'fastify';
import { z } from 'zod';

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

  // GET /api/v1/academy/batches
  app.get('/batches', async (req, reply) => {
    const { isActive, courseId } = req.query as { isActive?: string; courseId?: string };
    
    let whereClause: any = {};
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

  // GET /api/v1/academy/batches/:id
  app.get('/batches/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
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
    const batch = await app.prisma.batch.create({
      data: {
        courseId: body.courseId,
        name: body.name,
        type: body.type,
        capacity: body.capacity,
        educatorId: body.educatorId || undefined,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });
    reply.code(201);
    return batch;
  });

  // POST /api/v1/academy/batches/:id/auto-schedule (Generate 45-day daily sessions)
  app.post('/batches/:id/auto-schedule', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { daysCount = 45, defaultMeetLink } = req.body as { daysCount?: number; defaultMeetLink?: string };
    
    const batch = await app.prisma.batch.findUnique({ where: { id } });
    if (!batch) return reply.notFound('Batch not found');

    const startDate = new Date(batch.startDate);
    const createdSessions = [];

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

  // POST /api/v1/academy/batches/:id/sessions
  app.post('/batches/:id/sessions', async (req, reply) => {
    const { id } = req.params as { id: string };
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
    const user = await app.prisma.user.findFirst({ where: { role: 'STUDENT' } });
    if (!user) return { data: [] };

    const student = await app.prisma.student.findUnique({ where: { userId: user.id } });
    if (!student) return { data: [] };

    const enrollments = await app.prisma.enrollment.findMany({
      where: { studentId: student.id },
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

