import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getTenantContext } from '../utils/tenant';

export default async function lmsStudentRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // GET /api/v1/academy/lms-student/dashboard
  server.get('/lms-student/dashboard', async (req, reply) => {
    const { user } = getTenantContext(req);
    if (!user) {
      return reply.code(401).send({ error: 'Unauthorized', message: 'Student authentication required' });
    }

    const student = await server.prisma.student.findUnique({
      where: { userId: user.id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } },
        enrollments: {
          where: { status: 'ACTIVE' },
          include: {
            batch: {
              include: {
                course: {
                  include: {
                    lmsCourse: {
                      include: {
                        modules: {
                          include: { lessons: true }
                        }
                      }
                    }
                  }
                }
              }
            },
            installments: {
              where: { status: { in: ['PENDING', 'PARTIAL', 'OVERDUE'] } },
              orderBy: { dueDate: 'asc' },
              take: 1
            }
          }
        },
        attendanceRecords: {
          orderBy: { date: 'desc' },
          take: 30
        },
        submissions: {
          include: { assignment: true },
          orderBy: { updatedAt: 'desc' },
          take: 5
        },
        Certificate: {
          include: { course: true },
          orderBy: { issuedAt: 'desc' }
        }
      }
    });

    if (!student) {
      return reply.code(404).send({ error: 'Student profile not found' });
    }

    // Calculate progress for each enrollment
    const enrolledCourses = await Promise.all(
      student.enrollments.map(async (enr: any) => {
        const lmsCourse = enr.batch.course.lmsCourse;
        if (!lmsCourse) {
          return {
            enrollmentId: enr.id,
            courseId: enr.batch.course.id,
            name: enr.batch.course.name,
            batchName: enr.batch.name,
            completionPct: 0,
            completedLessons: 0,
            totalLessons: 0,
            watchedSecs: 0
          };
        }

        const allLessons = lmsCourse.modules.flatMap((m: any) => m.lessons);
        const lessonIds = allLessons.map((l: any) => l.id);

        const completedCount = lessonIds.length > 0
          ? await server.prisma.lessonProgress.count({
              where: { studentId: student.id, isCompleted: true, lessonId: { in: lessonIds } }
            })
          : 0;

        const watchData = await server.prisma.lessonProgress.aggregate({
          where: { studentId: student.id, lessonId: { in: lessonIds } },
          _sum: { watchedSecs: true }
        });

        return {
          enrollmentId: enr.id,
          lmsCourseId: lmsCourse.id,
          courseId: enr.batch.course.id,
          name: enr.batch.course.name,
          batchName: enr.batch.name,
          completionPct: lessonIds.length > 0 ? Math.round((completedCount / lessonIds.length) * 100) : 0,
          completedLessons: completedCount,
          totalLessons: lessonIds.length,
          watchedSecs: watchData._sum.watchedSecs || 0
        };
      })
    );

    // Attendance stats
    const totalLogs = student.attendanceRecords.length;
    const presentLogs = student.attendanceRecords.filter((r: any) => r.status === 'PRESENT' || r.status === 'LATE').length;
    const attendanceRate = totalLogs > 0 ? Math.round((presentLogs / totalLogs) * 100) : 100;

    // Next due installment
    const upcomingInstallment = student.enrollments
      .flatMap((e: any) => e.installments || [])
      .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0] || null;

    return {
      student: {
        id: student.id,
        name: `${student.user.firstName} ${student.user.lastName}`.trim(),
        email: student.user.email,
        avatar: student.user.avatarUrl,
        studentCode: student.studentCode,
        xp: student.xp,
        careerScore: student.careerScore,
      },
      stats: {
        enrolledCoursesCount: enrolledCourses.length,
        attendanceRate: `${attendanceRate}%`,
        certificatesCount: student.Certificate.length,
        totalWatchedSecs: enrolledCourses.reduce((sum, c) => sum + c.watchedSecs, 0)
      },
      courses: enrolledCourses,
      recentSubmissions: student.submissions,
      certificates: student.Certificate,
      upcomingFee: upcomingInstallment ? {
        id: upcomingInstallment.id,
        amount: upcomingInstallment.amount,
        paidAmount: upcomingInstallment.paidAmount,
        dueDate: upcomingInstallment.dueDate,
        status: upcomingInstallment.status
      } : null
    };
  });

  // GET /api/v1/academy/lms-student/courses
  server.get('/lms-student/courses', async (req, reply) => {
    const { user } = getTenantContext(req);
    if (!user) return reply.code(401).send({ error: 'Unauthorized' });

    const student = await server.prisma.student.findUnique({ where: { userId: user.id } });
    if (!student) return { data: [] };

    const enrollments = await server.prisma.enrollment.findMany({
      where: { studentId: student.id, status: 'ACTIVE' },
      include: {
        batch: {
          include: {
            course: {
              include: {
                lmsCourse: {
                  include: {
                    modules: {
                      include: {
                        lessons: {
                          include: {
                            progress: {
                              where: { studentId: student.id }
                            }
                          },
                          orderBy: { sortOrder: 'asc' }
                        }
                      },
                      orderBy: { sortOrder: 'asc' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const courses = enrollments.map(enr => {
      const lmsCourse = enr.batch.course.lmsCourse;
      return {
        enrollmentId: enr.id,
        batchId: enr.batchId,
        batchName: enr.batch.name,
        course: enr.batch.course,
        lmsCourse
      };
    });

    return { data: courses };
  });

  // POST /api/v1/academy/lms-student/assignments/:id/submit
  server.post('/lms-student/assignments/:id/submit', {
    schema: {
      params: z.object({ id: z.string() }),
      body: z.object({
        fileUrls: z.array(z.string()).optional().default([]),
        linkUrl: z.string().optional(),
        note: z.string().optional()
      })
    }
  }, async (req, reply) => {
    const { id } = req.params;
    const { user } = getTenantContext(req);
    if (!user) return reply.code(401).send({ error: 'Unauthorized' });

    const student = await server.prisma.student.findUnique({ where: { userId: user.id } });
    if (!student) return reply.code(404).send({ error: 'Student not found' });

    const assignment = await server.prisma.assignment.findUnique({ where: { id } });
    if (!assignment) return reply.code(404).send({ error: 'Assignment not found' });

    const body = req.body;

    const existing = await server.prisma.assignmentSubmission.findFirst({
      where: { assignmentId: id, studentId: student.id },
      include: { _count: { select: { versions: true } } }
    });

    if (existing) {
      const newVersion = (existing._count.versions || 0) + 1;
      await server.prisma.submissionVersion.create({
        data: {
          submissionId: existing.id,
          version: newVersion,
          fileUrls: body.fileUrls,
          linkUrl: body.linkUrl,
          note: body.note
        }
      });

      const updated = await server.prisma.assignmentSubmission.update({
        where: { id: existing.id },
        data: {
          fileUrls: body.fileUrls,
          linkUrl: body.linkUrl,
          status: 'SUBMITTED',
          versionCount: newVersion,
          updatedAt: new Date()
        }
      });
      return reply.code(200).send({ success: true, submission: updated, version: newVersion });
    } else {
      const submission = await server.prisma.assignmentSubmission.create({
        data: {
          assignmentId: id,
          studentId: student.id,
          fileUrls: body.fileUrls,
          linkUrl: body.linkUrl,
          status: 'SUBMITTED',
          versionCount: 1
        }
      });

      await server.prisma.submissionVersion.create({
        data: {
          submissionId: submission.id,
          version: 1,
          fileUrls: body.fileUrls,
          linkUrl: body.linkUrl,
          note: body.note || 'Initial submission'
        }
      });

      return reply.code(201).send({ success: true, submission, version: 1 });
    }
  });
}
