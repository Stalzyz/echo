process.env.NODE_ENV = 'test';
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
  console.error(`FATAL: test-admin-studio-e2e MUST be run against echo_lms_e2e database! Got: ${dbUrl}`);
  process.exit(1);
}

process.env.AUTH_SECRET = process.env.AUTH_SECRET || "echo_jwt_secret_key_2026";
process.env.JWT_SECRET = process.env.JWT_SECRET || "echo_jwt_secret_key_2026";

import assert from 'assert';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../src/app';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

async function main() {
  console.log('\n===============================================================');
  console.log('🚀 ECHO LMS — PHASE 5: SUPER ADMIN, STUDIO & INTEGRATIONS E2E');
  console.log('===============================================================\n');

  const app = await buildApp();
  await app.ready();

  // 1. Fetch seed entities
  const superAdmin = await prisma.user.findFirst({ where: { email: 'superadmin-e2e@example.test' } });
  const adminAlpha = await prisma.user.findFirst({ where: { email: 'admin-alpha@example.test' } });
  const adminBeta = await prisma.user.findFirst({ where: { email: 'admin-beta@example.test' } });
  const educatorAlpha = await prisma.user.findFirst({ where: { email: 'trainer-alpha@example.test' } });
  const studentAlphaUser = await prisma.user.findFirst({ where: { email: 'student-alpha@example.test' } });
  const studentAlpha = await prisma.student.findFirst({ where: { userId: studentAlphaUser?.id } });
  const studentBetaUser = await prisma.user.findFirst({ where: { email: 'student-beta@example.test' } });
  const studentBeta = await prisma.student.findFirst({ where: { userId: studentBetaUser?.id } });
  
  const orgAlpha = await prisma.organization.findFirst({ where: { slug: 'academy-alpha' } });
  const orgBeta = await prisma.organization.findFirst({ where: { slug: 'academy-beta' } });
  const courseAlpha = await prisma.course.findFirst({ where: { organizationId: orgAlpha?.id } });
  const batchAlpha = await prisma.batch.findFirst({ where: { organizationId: orgAlpha?.id } });

  assert.ok(superAdmin, 'Super Admin user missing in seed');
  assert.ok(adminAlpha, 'Admin Alpha user missing in seed');
  assert.ok(adminBeta, 'Admin Beta user missing in seed');
  assert.ok(educatorAlpha, 'Educator Alpha user missing in seed');
  assert.ok(studentAlpha, 'Student Alpha missing in seed');
  assert.ok(orgAlpha, 'Tenant Alpha missing in seed');
  assert.ok(courseAlpha, 'Course Alpha missing in seed');
  assert.ok(batchAlpha, 'Batch Alpha missing in seed');

  // Sign JWT session tokens
  const superAdminToken = `echo_session=${app.jwt.sign({
    id: superAdmin.id,
    email: superAdmin.email,
    role: 'SUPER_ADMIN'
  })}`;

  const adminAlphaToken = `echo_session=${app.jwt.sign({
    id: adminAlpha.id,
    email: adminAlpha.email,
    role: 'ADMIN',
    organizationId: orgAlpha.id
  })}`;

  const adminBetaToken = `echo_session=${app.jwt.sign({
    id: adminBeta.id,
    email: adminBeta.email,
    role: 'ADMIN',
    organizationId: orgBeta!.id
  })}`;

  const educatorAlphaToken = `echo_session=${app.jwt.sign({
    id: educatorAlpha.id,
    email: educatorAlpha.email,
    role: 'EDUCATOR',
    organizationId: orgAlpha.id
  })}`;

  const studentAlphaToken = `echo_session=${app.jwt.sign({
    id: studentAlphaUser!.id,
    email: studentAlphaUser!.email,
    role: 'STUDENT',
    organizationId: orgAlpha.id
  })}`;

  let passed = 0;
  let failed = 0;

  async function runTest(title: string, fn: () => Promise<void>) {
    process.stdout.write(`  ⏳ ${title}... `);
    try {
      await fn();
      console.log('PASSED');
      passed++;
    } catch (err: any) {
      console.log('FAILED');
      console.error(`     ❌ ${err.message}`);
      if (err.stack) {
        console.error(err.stack.split('\n').slice(0, 3).map((l: string) => `        ${l}`).join('\n'));
      }
      failed++;
    }
  }

  // Tracking IDs across workflow steps
  let createdOrgDeltaId = '';
  let createdQuizId = '';
  let createdQuestion2Id = '';
  let createdSlotId = '';

  console.log('--- SECTION 1: SUPER ADMIN CONTROL PLANE & PROVISIONING ---');

  await runTest('1.1 Non-superadmin (Tenant Beta Admin) rejected from Super Admin endpoint', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/super-admin/academies',
      headers: { cookie: adminBetaToken }
    });
    assert.strictEqual(res.statusCode, 403, `Expected 403, got ${res.statusCode}: ${res.body}`);
  });

  await runTest('1.2 Super Admin queries platform overview statistics', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/super-admin/stats',
      headers: { cookie: superAdminToken }
    });
    assert.strictEqual(res.statusCode, 200, `Expected 200, got ${res.statusCode}`);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.ok(json.stats.totalAcademies >= 3);
    assert.ok(json.stats.totalUsers >= 5);
  });

  await runTest('1.3 Super Admin lists all multi-tenant academies', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/super-admin/academies',
      headers: { cookie: superAdminToken }
    });
    assert.strictEqual(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.ok(json.academies.length >= 3);
    assert.ok(json.academies.some((a: any) => a.slug === 'academy-alpha'));
    assert.ok(json.academies.some((a: any) => a.slug === 'academy-beta'));
  });

  await runTest('1.4 Super Admin provisions new Academy Delta with admin user', async () => {
    const timestamp = Date.now();
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/super-admin/academies',
      headers: { cookie: superAdminToken },
      payload: {
        name: `Delta Institute ${timestamp}`,
        slug: `delta-inst-${timestamp}`,
        ownerName: 'Dr. Sarah Connor',
        ownerEmail: `sarah_${timestamp}@delta-inst.com`,
        subscription: 'GROWTH',
        status: 'ACTIVE'
      }
    });
    assert.strictEqual(res.statusCode, 201, `Expected 201, got ${res.statusCode}: ${res.body}`);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.ok(json.academy.id);
    createdOrgDeltaId = json.academy.id;

    // Verify in database
    const org = await prisma.organization.findUnique({
      where: { id: createdOrgDeltaId },
      include: { users: true }
    });
    assert.ok(org);
    assert.strictEqual(org.subscription, 'GROWTH');
    assert.strictEqual(org.users.length, 1);
    assert.strictEqual(org.users[0].role, 'ADMIN');
  });

  await runTest('1.5 Super Admin updates Academy Delta plan to ENTERPRISE', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/super-admin/academies/${createdOrgDeltaId}`,
      headers: { cookie: superAdminToken },
      payload: {
        subscription: 'ENTERPRISE',
        cname: 'lms.delta-inst.com'
      }
    });
    assert.strictEqual(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.academy.subscription, 'ENTERPRISE');
    assert.strictEqual(json.academy.cname, 'lms.delta-inst.com');
  });

  await runTest('1.6 Super Admin initiates Impersonation for Tenant Alpha', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/super-admin/impersonate',
      headers: { cookie: superAdminToken },
      payload: {
        targetTenantId: orgAlpha.id
      }
    });
    assert.strictEqual(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.impersonatingTenantId, orgAlpha.id);
    assert.ok(json.token);

    // Verify audit log
    const audit = await prisma.auditLog.findFirst({
      where: { action: 'IMPERSONATE', resourceId: orgAlpha.id },
      orderBy: { createdAt: 'desc' }
    });
    assert.ok(audit, 'Impersonation audit log not created');
  });

  await runTest('1.7 Super Admin exits Impersonation session', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/super-admin/impersonate/exit',
      headers: { cookie: superAdminToken }
    });
    assert.strictEqual(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
  });

  console.log('\n--- SECTION 2: TEACHING STUDIO & QUIZ BUILDER ---');

  await runTest('2.1 Educator creates interactive Quiz with question options', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/lms/quizzes',
      headers: { cookie: educatorAlphaToken },
      payload: {
        title: 'Full-Stack Architecture & Security Quiz',
        description: 'Testing knowledge on Next.js, Prisma, and Multi-Tenancy',
        passingScore: 75,
        courseId: courseAlpha.id,
        questions: [
          {
            questionText: 'Which HTTP status code is used for Forbidden access due to IDOR?',
            options: ['200 OK', '401 Unauthorized', '403 Forbidden', '500 Server Error'],
            correctOption: 2,
            explanation: '403 Forbidden indicates the server understands the request but refuses to authorize it.'
          }
        ]
      }
    });
    assert.strictEqual(res.statusCode, 201, `Expected 201, got ${res.statusCode}: ${res.body}`);
    const json = JSON.parse(res.body);
    assert.ok(json.data.id);
    assert.strictEqual(json.data.questions.length, 1);
    createdQuizId = json.data.id;
  });

  await runTest('2.2 Educator adds second question to Quiz', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/lms/quizzes/${createdQuizId}/questions`,
      headers: { cookie: educatorAlphaToken },
      payload: {
        questionText: 'What is the primary key strategy used for isolated tenant lookups?',
        options: ['Random ID', 'Scoped Composite Index on organizationId', 'Global Auto-Increment', 'No index'],
        correctOption: 1,
        explanation: 'Multi-tenant databases must index by tenant organizationId for performance and security.'
      }
    });
    assert.strictEqual(res.statusCode, 201);
    const json = JSON.parse(res.body);
    assert.ok(json.data.id);
    createdQuestion2Id = json.data.id;
  });

  await runTest('2.3 Student takes Quiz, answers correctly, receives calculated score and XP', async () => {
    // Fetch quiz questions
    const qRes = await app.inject({
      method: 'GET',
      url: `/api/v1/lms/quizzes/${createdQuizId}`,
      headers: { cookie: studentAlphaToken }
    });
    assert.strictEqual(qRes.statusCode, 200);
    const qJson = JSON.parse(qRes.body);
    assert.strictEqual(qJson.data.questions.length, 2);

    const q1 = qJson.data.questions[0];
    const q2 = qJson.data.questions[1];

    const prevStudent = await prisma.student.findUnique({ where: { id: studentAlpha.id } });
    const prevXp = prevStudent?.xp || 0;

    // Submit correct answers
    const subRes = await app.inject({
      method: 'POST',
      url: `/api/v1/lms/quizzes/${createdQuizId}/submit`,
      headers: { cookie: studentAlphaToken },
      payload: {
        studentId: studentAlpha.id,
        answers: {
          [q1.id]: q1.correctOption,
          [q2.id]: q2.correctOption
        }
      }
    });

    assert.strictEqual(subRes.statusCode, 200);
    const subJson = JSON.parse(subRes.body);
    assert.strictEqual(subJson.score, 100);
    assert.strictEqual(subJson.passed, true);
    assert.strictEqual(subJson.earnedXp, 25);

    // Verify XP increment in DB
    const updatedStudent = await prisma.student.findUnique({ where: { id: studentAlpha.id } });
    assert.strictEqual(updatedStudent?.xp, prevXp + 25);
  });

  await runTest('2.4 Educator reviews Quiz attempt list', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/lms/quizzes/${createdQuizId}/attempts`,
      headers: { cookie: educatorAlphaToken }
    });
    assert.strictEqual(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.ok(json.attempts.length >= 1);
    assert.strictEqual(json.attempts[0].score, 100);
  });

  console.log('\n--- SECTION 3: LIVE STUDIO & OFFICE HOURS ENGINE ---');

  await runTest('3.1 Educator creates an Office Hour Slot', async () => {
    const slotTime = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/academy/office-hours',
      headers: { cookie: educatorAlphaToken },
      payload: {
        title: 'Live 1-on-1 Code Review & Architecture Guidance',
        scheduledFor: slotTime,
        durationMins: 30,
        capacity: 1,
        meetLink: 'https://meet.echo-lms.com/alpha-live-room'
      }
    });
    assert.strictEqual(res.statusCode, 201);
    const json = JSON.parse(res.body);
    assert.ok(json.slot?.id);
    createdSlotId = json.slot.id;
  });

  await runTest('3.2 Student books the Office Hour slot', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/academy/office-hours/${createdSlotId}/book`,
      headers: { cookie: studentAlphaToken },
      payload: {
        studentId: studentAlpha.id
      }
    });
    assert.strictEqual(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.ok(json.booking?.id);
  });

  await runTest('3.3 Prevent booking when capacity is full (1/1)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/academy/office-hours/${createdSlotId}/book`,
      headers: { cookie: studentAlphaToken },
      payload: {
        studentId: studentAlpha.id
      }
    });
    assert.strictEqual(res.statusCode, 400);
  });

  console.log('\n--- SECTION 4: WEBHOOKS & RAZORPAY INGESTION ---');

  await runTest('4.1 Ingest payment.captured webhook for Student Course Batch Enrollment', async () => {
    // Create new student to enroll
    const newStudentUser = await prisma.user.create({
      data: {
        email: `webhook_student_${Date.now()}@example.com`,
        passwordHash: 'dummy_hash',
        firstName: 'Webhook',
        lastName: 'Enrollment',
        role: 'STUDENT',
        organizationId: orgAlpha.id
      }
    });
    const newStudent = await prisma.student.create({
      data: {
        userId: newStudentUser.id,
        studentCode: `STU-WH-${Date.now().toString().slice(-6)}`
      }
    });

    const paymentId = `pay_${Date.now()}`;
    const orderId = `order_${Date.now()}`;

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/webhooks/razorpay',
      payload: {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: paymentId,
              order_id: orderId,
              status: 'captured',
              amount: 1500000, // ₹15,000.00
              currency: 'INR',
              notes: {
                batch_id: batchAlpha.id,
                student_id: newStudent.id
              }
            }
          }
        }
      }
    });

    assert.strictEqual(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.status, 'ok');

    // Verify enrollment created
    const enrollment = await prisma.enrollment.findFirst({
      where: { studentId: newStudent.id, batchId: batchAlpha.id }
    });
    assert.ok(enrollment, 'LMS enrollment not created by webhook');
    assert.strictEqual(enrollment.feePaid, 15000);
  });

  await runTest('4.2 Webhook Idempotency: Duplicate payment event skipped', async () => {
    const dupEventId = `evt_dup_${Date.now()}`;
    const payload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: `pay_dup_${Date.now()}`,
            order_id: `order_dup_${Date.now()}`,
            status: 'captured',
            amount: 500000,
            currency: 'INR'
          }
        }
      }
    };

    // First call
    const res1 = await app.inject({
      method: 'POST',
      url: '/api/v1/webhooks/razorpay',
      headers: { 'x-razorpay-event-id': dupEventId },
      payload
    });
    assert.strictEqual(res1.statusCode, 200);

    // Second duplicate call with same event ID
    const res2 = await app.inject({
      method: 'POST',
      url: '/api/v1/webhooks/razorpay',
      headers: { 'x-razorpay-event-id': dupEventId },
      payload
    });
    assert.strictEqual(res2.statusCode, 200);
    const json2 = JSON.parse(res2.body);
    assert.strictEqual(json2.data.status, 'skipped_duplicate');
  });

  console.log('\n--- SECTION 5: CROSS-TENANT ISOLATION IN STUDIO & CONTROL PLANE ---');

  await runTest('5.1 Tenant Beta Admin cannot modify or delete Tenant Alpha Quiz', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/lms/quizzes/${createdQuizId}`,
      headers: { cookie: adminBetaToken }
    });
    assert.strictEqual(res.statusCode, 403, `Expected 403, got ${res.statusCode}`);
  });

  await runTest('5.2 Tenant Beta Student cannot book Tenant Alpha Educator Office Hours', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/academy/office-hours/${createdSlotId}/book`,
      headers: { cookie: `echo_session=${app.jwt.sign({ id: studentBetaUser!.id, email: studentBetaUser!.email, role: 'STUDENT', organizationId: orgBeta!.id })}` },
      payload: {
        studentId: studentBeta!.id
      }
    });
    assert.strictEqual(res.statusCode, 403, `Expected 403, got ${res.statusCode}`);
  });

  console.log('\n===============================================================');
  console.log(`📊 PHASE 5 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================\n');

  await app.close();
  await prisma.$disconnect();

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error running Phase 5 tests:', err);
  process.exit(1);
});
