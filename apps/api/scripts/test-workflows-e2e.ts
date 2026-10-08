import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// 1. Force load E2E environment with override: true BEFORE importing prisma/app
const candidates = [
  path.resolve(__dirname, '../../../packages/db/.env.e2e'),
  path.resolve(__dirname, '../../packages/db/.env.e2e'),
  path.resolve(__dirname, '../.env.e2e'),
  path.resolve(__dirname, '../../.env.e2e'),
  path.resolve(__dirname, '../../../.env.e2e'),
];

for (const p of candidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p, override: true });
  }
}

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes('echo_lms_e2e')) {
  process.env.DATABASE_URL = "postgresql://echo:Photoshop09%40.@localhost:5432/echo_lms_e2e?schema=public";
}

const dbUrl = process.env.DATABASE_URL || '';
if (!dbUrl.includes('echo_lms_e2e') && !dbUrl.includes('_test') && !dbUrl.includes('_e2e')) {
  console.error(`FATAL: test-workflows-e2e MUST be run against echo_lms_e2e database! Got: ${dbUrl}`);
  process.exit(1);
}

import { buildApp } from '../src/app';
import { prisma } from '../src/db';
import assert from 'assert';

interface TestContext {
  tenantAlphaId: string;
  tenantBetaId: string;
  adminAlphaToken: string;
  adminBetaToken: string;
  studentAlphaToken: string;
  courseAlphaId: string;
  lmsCourseAlphaId: string;
  lessonAlphaId: string;
  batchAlphaId: string;
  formSlugAlpha: string;
  certTemplateId: string;
}

let passed = 0;
let failed = 0;

async function runTest(name: string, fn: () => Promise<void>) {
  try {
    process.stdout.write(`  ⏳ ${name}... `);
    await fn();
    console.log(`\x1b[32mPASSED\x1b[0m`);
    passed++;
  } catch (err: any) {
    console.log(`\x1b[31mFAILED\x1b[0m`);
    console.error(`     Error: ${err.message}`);
    if (err.stack) console.error(err.stack.split('\n').slice(1, 4).join('\n'));
    failed++;
  }
}

async function main() {
  console.log('\n===============================================================');
  console.log('🚀 ECHO LMS — PHASE 4: CORE LMS & ACADEMY WORKFLOWS E2E AUDIT');
  console.log('===============================================================\n');

  const app = await buildApp();
  await app.ready();

  // Load Seed Fixtures from echo_lms_e2e
  const tenantAlpha = await prisma.organization.findUnique({ where: { slug: 'tenant-alpha' } });
  const tenantBeta = await prisma.organization.findUnique({ where: { slug: 'tenant-beta' } });

  if (!tenantAlpha || !tenantBeta) {
    throw new Error('Seed organizations missing. Please run npm run test:e2e:db:reset first.');
  }

  // Find users and courses in Tenant Alpha
  const adminAlpha = await prisma.user.findFirst({ where: { email: 'admin@alpha-academy.com' } });
  const adminBeta = await prisma.user.findFirst({ where: { email: 'admin@beta-design.com' } });
  const studentAlpha = await prisma.user.findFirst({ where: { email: 'student1@alpha-academy.com' } });
  const courseAlpha = await prisma.course.findFirst({ where: { organizationId: tenantAlpha.id } });
  const lmsCourseAlpha = await prisma.lMSCourse.findFirst({ where: { courseId: courseAlpha?.id }, include: { modules: { include: { lessons: true } } } });
  const batchAlpha = await prisma.batch.findFirst({ where: { courseId: courseAlpha?.id } });
  const formAlpha = await prisma.enquiryForm.findFirst({ where: { organizationId: tenantAlpha.id } });

  let certTemplate = await prisma.certificateTemplate.findFirst();
  if (!certTemplate) {
    certTemplate = await prisma.certificateTemplate.create({
      data: {
        name: 'Standard Academy Certificate',
        htmlContent: '<h1>Certificate of Completion</h1><p>{{studentName}} has completed {{courseName}}</p>'
      }
    });
  }

  const ctx: TestContext = {
    tenantAlphaId: tenantAlpha.id,
    tenantBetaId: tenantBeta.id,
    adminAlphaToken: `authjs.session-token=sess_admin_alpha`,
    adminBetaToken: `authjs.session-token=sess_admin_beta`,
    studentAlphaToken: `authjs.session-token=sess_student_alpha_1`,
    courseAlphaId: courseAlpha?.id || '',
    lmsCourseAlphaId: lmsCourseAlpha?.id || '',
    lessonAlphaId: lmsCourseAlpha?.modules[0]?.lessons[0]?.id || '',
    batchAlphaId: batchAlpha?.id || '',
    formSlugAlpha: formAlpha?.slug || '',
    certTemplateId: certTemplate.id
  };

  let generatedLeadId = '';
  let createdStudentId = '';
  let createdEnrollmentId = '';
  let createdAssignmentId = '';
  let createdSubmissionId = '';
  let createdInstallmentId = '';

  console.log('--- SECTION 1: PUBLIC ADMISSIONS & CRM LEAD CONVERSION ---');

  await runTest('1.1 Public Form Submission generates CRM Lead in Tenant Alpha', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/academy/forms/${ctx.formSlugAlpha}/submit`,
      payload: {
        data: {
          fullName: 'Rajesh Kumar',
          email: `rajesh_${Date.now()}@example.com`,
          mobilePhone: '+91 9876543210',
          courseInterest: 'Full Stack Development',
          city: 'Bangalore'
        }
      }
    });
    assert.strictEqual(res.statusCode, 201, `Expected 201, got ${res.statusCode}: ${res.body}`);
    const json = JSON.parse(res.body);
    assert.ok(json.success && json.submissionId, 'Submission failed');

    // Verify lead was generated
    const submission = await prisma.formSubmission.findUnique({
      where: { id: json.submissionId },
      include: { lead: true }
    });
    assert.ok(submission?.leadId, 'Lead was not linked to submission');
    assert.strictEqual(submission?.lead?.organizationId, ctx.tenantAlphaId, 'Lead organizationId mismatch');
    assert.strictEqual(submission?.lead?.name, 'Rajesh Kumar');
    assert.strictEqual(submission?.lead?.status, 'ENQUIRY');
    generatedLeadId = submission.leadId!;
  });

  await runTest('1.2 Staff updates Lead Stage to CONTACTED and WON', async () => {
    // Log activity
    const actRes = await app.inject({
      method: 'POST',
      url: `/api/v1/crm/leads/${generatedLeadId}/activities`,
      headers: { cookie: ctx.adminAlphaToken },
      payload: {
        type: 'CALL',
        content: 'Candidate called back. Very interested in evening cohort.',
        whatsappTemplate: 'NONE'
      }
    });
    assert.strictEqual(actRes.statusCode, 201);

    // Update status to WON
    const updateRes = await app.inject({
      method: 'PATCH',
      url: `/api/v1/crm/leads/${generatedLeadId}`,
      headers: { cookie: ctx.adminAlphaToken },
      payload: {
        status: 'WON',
        notes: 'Enrolled in upcoming Full Stack batch.'
      }
    });
    assert.strictEqual(updateRes.statusCode, 200);
    const lead = JSON.parse(updateRes.body);
    assert.strictEqual(lead.status, 'WON');
  });

  await runTest('1.3 Staff Converts Lead into Student with Batch Enrollment', async () => {
    const studentEmail = `rajesh_student_${Date.now()}@example.com`;
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/academy/students',
      headers: { cookie: ctx.adminAlphaToken },
      payload: {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: studentEmail,
        phone: '+91 9876543210',
        city: 'Bangalore',
        batchId: ctx.batchAlphaId,
        leadId: generatedLeadId,
        deliveryMode: 'ONLINE'
      }
    });
    assert.strictEqual(res.statusCode, 201, `Expected 201, got ${res.statusCode}: ${res.body}`);
    const student = JSON.parse(res.body);
    assert.ok(student.id, 'Missing student id');
    assert.ok(student.studentCode, 'Missing studentCode');
    createdStudentId = student.id;

    // Check enrollment created
    const enrollment = await prisma.enrollment.findFirst({
      where: { studentId: student.id, batchId: ctx.batchAlphaId }
    });
    assert.ok(enrollment, 'Enrollment record not found');
    assert.strictEqual(enrollment.status, 'ACTIVE');
    createdEnrollmentId = enrollment.id;

    // Create session for this new student
    const studentUser = await prisma.user.findFirst({ where: { email: studentEmail } });
    await prisma.session.create({
      data: {
        sessionToken: `sess_rajesh_${student.id}`,
        userId: studentUser!.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  });

  console.log('\n--- SECTION 2: STUDENT DASHBOARD & LEARNING PROGRESS ---');

  await runTest('2.1 Student logs in and queries Student LMS Dashboard', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/academy/lms-student/dashboard',
      headers: { cookie: `authjs.session-token=sess_rajesh_${createdStudentId}` }
    });
    assert.strictEqual(res.statusCode, 200, `Expected 200, got ${res.statusCode}: ${res.body}`);
    const dash = JSON.parse(res.body);
    assert.strictEqual(dash.student.id, createdStudentId);
    assert.strictEqual(dash.stats.enrolledCoursesCount, 1);
    assert.strictEqual(dash.courses[0].completionPct, 0);
  });

  await runTest('2.2 Student calls GET /api/v1/lms/enrollments/my', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/lms/enrollments/my',
      headers: { cookie: `authjs.session-token=sess_rajesh_${createdStudentId}` }
    });
    assert.strictEqual(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.totalCourses, 1);
    assert.strictEqual(json.studentId, createdStudentId);
  });

  await runTest('2.3 Student watches Lesson and updates Progress', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/lms/progress',
      payload: {
        lessonId: ctx.lessonAlphaId,
        studentId: createdStudentId,
        watchedSecs: 300,
        isCompleted: true
      }
    });
    assert.strictEqual(res.statusCode, 200);
    const progress = JSON.parse(res.body);
    assert.strictEqual(progress.isCompleted, true);
    assert.strictEqual(progress.watchedSecs, 300);

    // Verify progress % endpoint
    const pctRes = await app.inject({
      method: 'GET',
      url: `/api/v1/lms/progress/${createdStudentId}/${ctx.lmsCourseAlphaId}`
    });
    assert.strictEqual(pctRes.statusCode, 200);
    const pctJson = JSON.parse(pctRes.body);
    assert.ok(pctJson.completionPct > 0, 'Completion % did not increase');
    assert.strictEqual(pctJson.completedLessons, 1);
  });

  console.log('\n--- SECTION 3: ASSIGNMENT SUBMISSION, MENTOR REVIEW & PORTFOLIO ---');

  await runTest('3.1 Educator creates Assignment for Lesson', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/lms/assignments',
      payload: {
        lessonId: ctx.lessonAlphaId,
        title: 'Build a Next.js Full Stack Prototype',
        description: 'Implement full CRUD with Prisma and PostgreSQL'
      }
    });
    assert.strictEqual(res.statusCode, 201);
    const json = JSON.parse(res.body);
    assert.ok(json.data?.id);
    createdAssignmentId = json.data.id;
  });

  await runTest('3.2 Student Submits Assignment Protocol', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/academy/submissions',
      headers: { cookie: `authjs.session-token=sess_rajesh_${createdStudentId}` },
      payload: {
        assignmentId: createdAssignmentId,
        studentId: createdStudentId,
        linkUrl: 'https://github.com/rajesh/nextjs-crud-demo',
        note: 'Complete with tests and schema migrations'
      }
    });
    assert.strictEqual(res.statusCode, 201);
    const submission = JSON.parse(res.body);
    assert.strictEqual(submission.status, 'SUBMITTED');
    assert.strictEqual(submission.versionCount, 1);
    createdSubmissionId = submission.id;
  });

  await runTest('3.3 Educator reviews and APPROVES assignment -> auto-pushes to Portfolio', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/academy/submissions/${createdSubmissionId}/review`,
      headers: { cookie: ctx.adminAlphaToken },
      payload: {
        status: 'APPROVED',
        grade: 95,
        feedback: 'Outstanding architecture and clear documentation.',
        gradedBy: 'Senior Educator'
      }
    });
    assert.strictEqual(res.statusCode, 200);
    const reviewed = JSON.parse(res.body);
    assert.strictEqual(reviewed.status, 'APPROVED');
    assert.strictEqual(reviewed.grade, 95);

    // Verify portfolio project created
    const portfolio = await prisma.studentPortfolio.findUnique({
      where: { studentId: createdStudentId },
      include: { projects: true }
    });
    assert.ok(portfolio, 'Portfolio not found');
    assert.ok(portfolio.projects.length >= 1, 'Project not pushed to portfolio');
    assert.strictEqual(portfolio.projects[0].title, 'Build a Next.js Full Stack Prototype');
  });

  console.log('\n--- SECTION 4: ATTENDANCE TRACKING & SCAN ENGINE ---');

  await runTest('4.1 Educator marks attendance manually for the day', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/academy/attendance/mark',
      headers: { cookie: ctx.adminAlphaToken },
      payload: {
        studentId: createdStudentId,
        status: 'PRESENT',
        notes: 'Attended live interactive session'
      }
    });
    assert.strictEqual(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.record?.status, 'PRESENT');
  });

  await runTest('4.2 Query Attendance Log list scoped to Tenant Alpha', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/academy/attendance',
      headers: { cookie: ctx.adminAlphaToken }
    });
    assert.strictEqual(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.ok(json.logs.some((l: any) => l.id === createdStudentId && l.status === 'PRESENT'));
  });

  console.log('\n--- SECTION 5: FEE INVOICING & PAYMENT RECONCILIATION ---');

  await runTest('5.1 Admin creates Fee Installment for Student Enrollment', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/academy/fees/installment',
      headers: { cookie: ctx.adminAlphaToken },
      payload: {
        enrollmentId: createdEnrollmentId,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 25000,
        taxRate: 18,
        notes: 'Term 1 Tuition Fee'
      }
    });
    assert.strictEqual(res.statusCode, 201);
    const inst = JSON.parse(res.body);
    assert.ok(inst.id);
    createdInstallmentId = inst.id;
  });

  await runTest('5.2 Student / Admin records payment on Fee Installment', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/academy/fees/installment/${createdInstallmentId}/pay`,
      headers: { cookie: ctx.adminAlphaToken },
      payload: {
        amount: 29500, // 25000 + 18% tax = 29500
        paymentRef: 'UPI-REF-9988776655',
        notes: 'Paid via Razorpay UPI'
      }
    });
    assert.strictEqual(res.statusCode, 200);
    const updated = JSON.parse(res.body);
    assert.strictEqual(updated.status, 'PAID');
    assert.strictEqual(updated.paidAmount, 29500);

    // Verify enrollment aggregate feePaid updated
    const enr = await prisma.enrollment.findUnique({ where: { id: createdEnrollmentId } });
    assert.strictEqual(enr?.feePaid, 29500);
  });

  console.log('\n--- SECTION 6: CERTIFICATE ISSUANCE & PDF ENGINE ---');

  await runTest('6.1 Issue Certificate for Student on Course Completion', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/academy/certificates/generate',
      headers: { cookie: ctx.adminAlphaToken },
      payload: {
        studentId: createdStudentId,
        courseId: ctx.courseAlphaId,
        templateId: ctx.certTemplateId,
        sendEmail: false
      }
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.headers['content-type'], 'application/pdf');
    assert.ok(res.rawPayload.length > 500, 'PDF buffer was empty or too small');

    const certId = res.headers['x-certificate-id'] as string;
    assert.ok(certId, 'x-certificate-id header missing');

    const cert = await prisma.certificate.findUnique({ where: { id: certId } });
    assert.ok(cert, 'Certificate record not created in DB');
    assert.ok(cert.certificateId.startsWith('CERT-'), `Certificate ID ${cert.certificateId} did not match expected prefix`);
    assert.ok(cert.pdfUrl.includes('storage.echo-lms.com'), `PDF URL ${cert.pdfUrl} contained legacy domain`);
  });

  console.log('\n--- SECTION 7: CROSS-TENANT WORKFLOW SECURITY AUDIT ---');

  await runTest('7.1 Tenant Beta admin cannot access Tenant Alpha Student Ledger', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/academy/fees/student/${createdStudentId}`,
      headers: { cookie: ctx.adminBetaToken }
    });
    assert.strictEqual(res.statusCode, 403, `Expected 403, got ${res.statusCode}: ${res.body}`);
  });

  await runTest('7.2 Tenant Beta admin cannot mark attendance for Tenant Alpha Student', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/academy/attendance/mark',
      headers: { cookie: ctx.adminBetaToken },
      payload: {
        studentId: createdStudentId,
        status: 'ABSENT'
      }
    });
    assert.strictEqual(res.statusCode, 403, `Expected 403, got ${res.statusCode}: ${res.body}`);
  });

  await runTest('7.3 Tenant Beta admin cannot generate certificate for Tenant Alpha Student', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/academy/certificates/generate',
      headers: { cookie: ctx.adminBetaToken },
      payload: {
        studentId: createdStudentId,
        courseId: ctx.courseAlphaId,
        templateId: ctx.certTemplateId
      }
    });
    assert.strictEqual(res.statusCode, 403, `Expected 403, got ${res.statusCode}: ${res.body}`);
  });

  console.log('\n===============================================================');
  console.log(`📊 PHASE 4 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================\n');

  await app.close();
  await prisma.$disconnect();

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error running workflow tests:', err);
  process.exit(1);
});
