import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getTenantContext } from '../utils/tenant';

export default async function officeHoursRouter(app: FastifyInstance) {
  // ── GET /api/v1/academy/office-hours ─────────────────────────────────────
  // Get upcoming office hours scoped to tenant
  app.get('/', async (req, reply) => {
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    const where: any = { scheduledFor: { gte: new Date() } };
    if (tenantId && !isGlobalSuperAdmin) {
      where.mentor = { organizationId: tenantId };
    }

    const hours = await app.prisma.officeHour.findMany({
      where,
      include: {
        mentor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, organizationId: true } },
        _count: { select: { bookings: true } }
      },
      orderBy: { scheduledFor: 'asc' }
    });
    return { success: true, officeHours: hours, total: hours.length };
  });

  // ── POST /api/v1/academy/office-hours ────────────────────────────────────
  // Mentor creates a slot
  app.post('/', async (req, reply) => {
    const schema = z.object({
      title: z.string().min(1),
      scheduledFor: z.string(),
      durationMins: z.number().default(15),
      capacity: z.number().default(1),
      meetLink: z.string().optional(),
      mentorId: z.string().optional()
    });
    const body = schema.parse(req.body);
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    let mentorId = body.mentorId || (req as any).user?.id;
    if (!mentorId) {
      const mentor = await app.prisma.user.findFirst({
        where: {
          role: { in: ['EDUCATOR', 'ADMIN', 'TRAINER', 'STAFF'] },
          ...(tenantId && !isGlobalSuperAdmin ? { organizationId: tenantId } : {})
        }
      });
      if (!mentor) return reply.code(401).send({ error: 'Mentor not found or not authorized' });
      mentorId = mentor.id;
    }

    const slot = await app.prisma.officeHour.create({
      data: {
        title: body.title,
        scheduledFor: new Date(body.scheduledFor),
        durationMins: body.durationMins,
        capacity: body.capacity,
        meetLink: body.meetLink || 'https://meet.echo-lms.com/live-room',
        mentorId
      },
      include: {
        mentor: { select: { id: true, firstName: true, lastName: true, organizationId: true } }
      }
    });

    reply.code(201);
    return { success: true, slot };
  });

  // ── POST /api/v1/academy/office-hours/:id/book ─────────────────────────
  app.post('/:id/book', async (req, reply) => {
    const { id } = req.params as { id: string };
    const schema = z.object({
      studentId: z.string().optional()
    });
    const { studentId: reqStudentId } = schema.parse(req.body || {});
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    let targetStudentId = reqStudentId;
    if (!targetStudentId) {
      const authUserId = (req as any).user?.id;
      if (authUserId) {
        const student = await app.prisma.student.findUnique({ where: { userId: authUserId } });
        targetStudentId = student?.id;
      }
    }

    if (!targetStudentId) {
      return reply.code(400).send({ error: 'Student ID is required to book an office hour slot.' });
    }

    const student = await app.prisma.student.findUnique({
      where: { id: targetStudentId },
      include: { user: true }
    });

    if (!student) {
      return reply.notFound('Student profile not found');
    }

    // Tenant check
    if (tenantId && !isGlobalSuperAdmin && student.user.organizationId !== tenantId) {
      return reply.code(403).send({ error: 'Forbidden', message: 'Student belongs to a different academy' });
    }

    // Check slot
    const slot = await app.prisma.officeHour.findUnique({
      where: { id },
      include: {
        _count: { select: { bookings: true } },
        mentor: true
      }
    });

    if (!slot) return reply.notFound('Office hour slot not found');

    if (tenantId && !isGlobalSuperAdmin && slot.mentor.organizationId && slot.mentor.organizationId !== tenantId) {
      return reply.code(403).send({ error: 'Forbidden', message: 'Office hour slot belongs to a different academy' });
    }

    if (slot._count.bookings >= slot.capacity) {
      return reply.code(400).send({ message: 'This slot is fully booked' });
    }

    try {
      const booking = await app.prisma.officeHourBooking.create({
        data: {
          officeHourId: slot.id,
          studentId: targetStudentId
        }
      });
      return { success: true, booking };
    } catch (err: any) {
      if (err.code === 'P2002') {
        return reply.code(400).send({ message: 'You have already booked this slot' });
      }
      throw err;
    }
  });
}
