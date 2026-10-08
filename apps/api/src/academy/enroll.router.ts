import { FastifyInstance } from 'fastify';
import { getTenantContext } from '../utils/tenant';

export default async function enrollRouter(app: FastifyInstance) {
  // POST /api/v1/academy/enroll
  app.post('/enroll', async (req, reply) => {
    const { lmsCourseId, studentId: providedStudentId } = req.body as { lmsCourseId: string; studentId?: string };
    const { user, tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    // 1. Fetch the LMS Course and its core Course to get the first Batch
    const lmsCourse = await app.prisma.lMSCourse.findUnique({
      where: { id: lmsCourseId },
      include: {
        course: {
          include: { batches: true }
        }
      }
    });

    if (!lmsCourse) {
      return reply.status(404).send({ error: 'Course not found' });
    }

    if (!isGlobalSuperAdmin && lmsCourse.course?.organizationId && lmsCourse.course.organizationId !== tenantId) {
      return reply.code(403).send({ error: 'Forbidden', message: 'Course belongs to another tenant' });
    }

    // 2. Resolve or Create Student profile
    let student: any = null;

    if (providedStudentId) {
      student = await app.prisma.student.findUnique({
        where: { id: providedStudentId },
        include: { user: true }
      });
      if (student && !isGlobalSuperAdmin && student.user?.organizationId && student.user.organizationId !== tenantId) {
        return reply.code(403).send({ error: 'Forbidden', message: 'Student belongs to another tenant' });
      }
    } else if (user) {
      student = await app.prisma.student.findUnique({
        where: { userId: user.id },
        include: { user: true }
      });
      if (!student) {
        const studentCode = `STU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        student = await app.prisma.student.create({
          data: {
            userId: user.id,
            studentCode,
          },
          include: { user: true }
        });
      }
    } else {
      // Unauthenticated fallback
      return reply.code(401).send({ error: 'Unauthorized', message: 'Authentication required for enrollment' });
    }

    if (!student) {
      return reply.code(404).send({ error: 'Student not found' });
    }

    // 3. Find or Create a Batch for the Course
    let batch = lmsCourse.course.batches.find(b => b.type === 'ONLINE') || lmsCourse.course.batches[0];
    if (!batch) {
      const durationMonths = lmsCourse.course.duration ? parseInt(lmsCourse.course.duration) || 3 : 3;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + durationMonths);

      batch = await app.prisma.batch.create({
        data: {
          courseId: lmsCourse.course.id,
          name: `${lmsCourse.course.name} - Cohort ${new Date().getFullYear()}`,
          type: 'ONLINE',
          startDate,
          endDate
        }
      });
    }

    // 4. Create the Enrollment
    const enrollment = await app.prisma.enrollment.upsert({
      where: {
        studentId_batchId: {
          studentId: student.id,
          batchId: batch.id
        }
      },
      update: {},
      create: {
        studentId: student.id,
        batchId: batch.id,
        totalFee: lmsCourse.course.fee,
        feePaid: lmsCourse.course.fee,
        status: 'ACTIVE'
      },
      include: {
        batch: { include: { course: true } },
        student: { include: { user: true } }
      }
    });

    return { success: true, enrollment };
  });

  // GET /api/v1/academy/enrollments/me
  app.get('/enrollments/me', async (req, reply) => {
    const { user } = getTenantContext(req);
    if (!user) return reply.code(401).send({ error: 'Unauthorized' });

    const student = await app.prisma.student.findUnique({ where: { userId: user.id } });
    if (!student) return { data: [] };

    const enrollments = await app.prisma.enrollment.findMany({
      where: { studentId: student.id, status: 'ACTIVE' },
      include: {
        batch: {
          include: {
            course: {
              include: {
                lmsCourse: true
              }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    return { data: enrollments };
  });

  // GET /api/v1/academy/enroll/all
  app.get('/enroll/all', async (req, reply) => {
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    const orgFilter = isGlobalSuperAdmin
      ? {}
      : { batch: { course: { organizationId: tenantId || '__NO_ACCESS__' } } };

    const enrollments = await app.prisma.enrollment.findMany({
      where: orgFilter,
      include: {
        student: { include: { user: true } },
        batch: { include: { course: true } }
      },
      orderBy: { enrolledAt: 'desc' }
    });
    return { data: enrollments };
  });
}
