import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getTenantContext } from '../utils/tenant';

export default async function certificatesRouter(app: FastifyInstance) {
  // GET /api/v1/academy/certificates
  app.get('/', async (req, reply) => {
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    const orgFilter = isGlobalSuperAdmin
      ? {}
      : { student: { user: { organizationId: tenantId || '__NO_ACCESS__' } } };

    const certificates = await app.prisma.certificate.findMany({
      where: orgFilter,
      include: {
        student: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        course: { select: { name: true, code: true } }
      },
      orderBy: { issuedAt: 'desc' }
    });

    return { certificates };
  });

  // GET /api/v1/academy/certificates/student/:studentId
  app.get('/student/:studentId', async (req, reply) => {
    const { studentId } = req.params as { studentId: string };
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    const student = await app.prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true }
    });

    if (!student) return reply.notFound('Student not found');
    if (!isGlobalSuperAdmin && student.user?.organizationId && student.user.organizationId !== tenantId) {
      return reply.code(403).send({ error: 'Forbidden', message: 'Access denied to certificates of another tenant' });
    }

    const certificates = await app.prisma.certificate.findMany({
      where: { studentId },
      include: { course: true },
      orderBy: { issuedAt: 'desc' }
    });

    return { certificates };
  });

  // GET /api/v1/academy/certificates/templates
  app.get('/templates', async (req, reply) => {
    const templates = await app.prisma.certificateTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return templates;
  });

  // POST /api/v1/academy/certificates/templates
  app.post('/templates', async (req, reply) => {
    const schema = z.object({
      name: z.string(),
      htmlContent: z.string(),
      backgroundUrl: z.string().optional(),
      watermarkUrl: z.string().optional(),
      educatorSignatureUrl: z.string().optional(),
      academyHeadSignatureUrl: z.string().optional()
    });
    const data = schema.parse(req.body);

    const template = await app.prisma.certificateTemplate.create({
      data
    });
    return template;
  });

  // POST /api/v1/academy/certificates/generate
  app.post('/generate', async (req, reply) => {
    const schema = z.object({
      studentId: z.string(),
      courseId: z.string(),
      templateId: z.string(),
      sendEmail: z.boolean().default(false)
    });
    
    const data = schema.parse(req.body);
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    const student = await app.prisma.student.findUnique({ where: { id: data.studentId }, include: { user: true } });
    if (!student) return reply.code(404).send({ error: 'Student not found' });

    if (!isGlobalSuperAdmin && student.user?.organizationId && student.user.organizationId !== tenantId) {
      return reply.code(403).send({ error: 'Forbidden', message: 'Access denied to generate certificate for another tenant student' });
    }

    const course = await app.prisma.course.findUnique({ where: { id: data.courseId } });
    if (!course) return reply.code(404).send({ error: 'Course not found' });

    const template = await app.prisma.certificateTemplate.findUnique({ where: { id: data.templateId } });
    if (!template) return reply.code(404).send({ error: 'Template not found' });

    // Ensure Certificate ID is unique
    const certificateId = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Generate PDF using Design System
    const { getBrandConfig } = await import('../utils/brand');
    const brand = await getBrandConfig(app, 'ACADEMY');
    
    // We import this dynamically to avoid huge memory overhead if unused
    const { generateCertificatePDF } = await import('../finance/pdf.service');
    
    const pdfBuffer = await generateCertificatePDF({
      brand,
      studentName: `${student.user.firstName} ${student.user.lastName}`,
      courseName: course.name,
      certificateId,
      issuedAt: new Date().toISOString(),
    });

    const pdfUrl = `https://storage.echo-lms.com/certificates/${certificateId}.pdf`; 

    const certificate = await app.prisma.certificate.create({
      data: {
        studentId: data.studentId,
        courseId: data.courseId,
        templateId: data.templateId,
        certificateId,
        pdfUrl
      }
    });

    if (data.sendEmail) {
      app.log.info(`Sending certificate email to ${student.user.email}`);
    }

    reply.header('Content-Type', 'application/pdf');
    reply.header('x-certificate-id', certificate.id);
    return reply.send(pdfBuffer);
  });
}
