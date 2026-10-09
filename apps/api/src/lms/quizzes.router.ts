import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getTenantContext } from '../utils/tenant';

const QuestionSchema = z.object({
  questionText: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctOption: z.number().int().min(0),
  explanation: z.string().optional()
});

const CreateQuizSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  passingScore: z.number().int().min(1).max(100).default(70),
  courseId: z.string().optional(),
  moduleId: z.string().optional(),
  questions: z.array(QuestionSchema).optional()
});

export default async function quizzesRouter(app: FastifyInstance) {
  // GET /api/v1/lms/quizzes — Scoped to course / tenant
  app.get('/', async (req, reply) => {
    const { courseId, moduleId } = (req.query as any) || {};
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    const where: any = {};
    if (courseId) where.courseId = courseId;
    if (moduleId) where.moduleId = moduleId;
    if (tenantId && !isGlobalSuperAdmin) {
      where.course = { organizationId: tenantId };
    }

    const quizzes = await app.prisma.quiz.findMany({
      where,
      include: {
        _count: {
          select: { questions: true, attempts: true }
        },
        course: { select: { id: true, name: true, organizationId: true } },
        module: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: quizzes, total: quizzes.length };
  });

  // POST /api/v1/lms/quizzes — Create quiz with optional questions
  app.post('/', async (req, reply) => {
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);
    const data = CreateQuizSchema.parse(req.body);

    let targetCourseId = data.courseId;
    if (!targetCourseId) {
      // Find course belonging to tenant
      const course = await app.prisma.course.findFirst({
        where: tenantId && !isGlobalSuperAdmin ? { organizationId: tenantId } : {}
      });
      if (!course) {
        return reply.code(400).send({ error: 'No course found. Please provide a valid courseId.' });
      }
      targetCourseId = course.id;
    } else if (tenantId && !isGlobalSuperAdmin) {
      // Validate course belongs to tenant
      const course = await app.prisma.course.findUnique({ where: { id: targetCourseId } });
      if (!course || course.organizationId !== tenantId) {
        return reply.code(403).send({ error: 'Forbidden', message: 'Course does not belong to your academy' });
      }
    }

    const quiz = await app.prisma.quiz.create({
      data: {
        title: data.title,
        description: data.description,
        passingScore: data.passingScore,
        courseId: targetCourseId,
        moduleId: data.moduleId || null,
        ...(data.questions && data.questions.length > 0 ? {
          questions: {
            create: data.questions.map(q => ({
              questionText: q.questionText,
              options: q.options,
              correctOption: q.correctOption,
              explanation: q.explanation || null
            }))
          }
        } : {})
      },
      include: {
        questions: true,
        _count: { select: { questions: true } }
      }
    });

    reply.code(201);
    return { success: true, data: quiz };
  });

  // GET /api/v1/lms/quizzes/:id
  app.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    const quiz = await app.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
        course: { select: { id: true, name: true, organizationId: true } },
        _count: { select: { attempts: true } }
      }
    });

    if (!quiz) return reply.notFound('Quiz not found');

    if (tenantId && !isGlobalSuperAdmin && quiz.course.organizationId && quiz.course.organizationId !== tenantId) {
      return reply.code(403).send({ error: 'Forbidden', message: 'Access to foreign quiz denied' });
    }

    return { success: true, data: quiz };
  });

  // POST /api/v1/lms/quizzes/:id/questions — Add questions to existing quiz
  app.post('/:id/questions', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = QuestionSchema.parse(req.body);

    const quiz = await app.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) return reply.notFound('Quiz not found');

    const question = await app.prisma.quizQuestion.create({
      data: {
        quizId: id,
        questionText: body.questionText,
        options: body.options,
        correctOption: body.correctOption,
        explanation: body.explanation || null
      }
    });

    reply.code(201);
    return { success: true, data: question };
  });

  // POST /api/v1/lms/quizzes/:id/submit — Submit answers, calculate score, award XP
  app.post('/:id/submit', async (req, reply) => {
    const { id } = req.params as { id: string };
    const submitSchema = z.object({
      studentId: z.string().min(1),
      answers: z.record(z.string(), z.number())
    });
    const { studentId, answers } = submitSchema.parse(req.body);

    const quiz = await app.prisma.quiz.findUnique({
      where: { id },
      include: { questions: true }
    });

    if (!quiz) return reply.notFound('Quiz not found');
    if (quiz.questions.length === 0) {
      return reply.code(400).send({ error: 'Quiz has no questions configured.' });
    }

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctOption) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attempt = await app.prisma.quizAttempt.create({
      data: {
        quizId: id,
        studentId,
        score,
        passed
      }
    });

    // Gamification: Award XP based on score
    const student = await app.prisma.student.findUnique({ where: { id: studentId } });
    if (student && passed) {
      await app.prisma.student.update({
        where: { id: student.id },
        data: { xp: { increment: 25 } }
      });
    }

    return { 
      success: true, 
      score, 
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      earnedXp: passed ? 25 : 0,
      attemptId: attempt.id
    };
  });

  // GET /api/v1/lms/quizzes/:id/attempts — List all attempts for a quiz
  app.get('/:id/attempts', async (req, reply) => {
    const { id } = req.params as { id: string };

    const attempts = await app.prisma.quizAttempt.findMany({
      where: { quizId: id },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, attempts, total: attempts.length };
  });

  // PATCH /api/v1/lms/quizzes/:id
  app.patch('/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const schema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      passingScore: z.number().int().min(1).max(100).optional(),
    });
    const body = schema.parse(req.body);

    const updated = await app.prisma.quiz.update({
      where: { id },
      data: body
    });

    return { success: true, data: updated };
  });

  // DELETE /api/v1/lms/quizzes/:id
  app.delete('/:id', async (req, reply) => {
    const { id } = req.params as { id: string };

    await app.prisma.quiz.delete({ where: { id } });
    return { success: true, message: 'Quiz deleted successfully' };
  });
}
