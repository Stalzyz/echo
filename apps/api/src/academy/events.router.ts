import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getTenantContext } from '../utils/tenant';

export default async function eventsRouter(app: FastifyInstance) {
  // GET /api/v1/academy/events
  app.get('/events', async (req, reply) => {
    const { orgFilter } = getTenantContext(req);
    const events = await app.prisma.campusEvent.findMany({
      where: orgFilter,
      include: { _count: { select: { registrations: true } } },
      orderBy: { date: 'asc' }
    });
    return events;
  });

  // POST /api/v1/academy/events
  app.post('/events', async (req, reply) => {
    const { tenantId } = getTenantContext(req);
    const schema = z.object({
      title: z.string(),
      description: z.string().optional(),
      type: z.enum(['WORKSHOP', 'HACKATHON', 'GUEST_SESSION', 'WEBINAR']),
      date: z.string(),
      location: z.string().optional(),
      maxCapacity: z.number().optional(),
    });
    const body = schema.parse(req.body);

    const event = await app.prisma.campusEvent.create({
      data: {
        ...body,
        date: new Date(body.date),
        ...(tenantId ? { organizationId: tenantId } : {})
      }
    });
    reply.code(201);
    return event;
  });

  // POST /api/v1/academy/events/:id/register
  app.post('/events/:id/register', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { studentId } = req.body as { studentId: string };

    const event = await app.prisma.campusEvent.findUnique({
      where: { id },
      include: { _count: { select: { registrations: true } } }
    });

    if (!event) return reply.notFound('Event not found');
    if (event.maxCapacity && event._count.registrations >= event.maxCapacity) {
      return reply.code(400).send({ message: 'Event is fully booked' });
    }

    try {
      const reg = await app.prisma.eventRegistration.create({
        data: { eventId: id, studentId }
      });
      return reg;
    } catch (e) {
      return reply.code(400).send({ message: 'Already registered' });
    }
  });
}
