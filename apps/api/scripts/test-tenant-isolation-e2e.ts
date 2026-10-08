import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// 1. Force load E2E environment with override: true
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

// Ensure database URL points to echo_lms_e2e
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes('echo_lms_e2e')) {
  // If not loaded, construct localhost connection
  process.env.DATABASE_URL = "postgresql://echo:Photoshop09%40.@localhost:5432/echo_lms_e2e?schema=public";
}

const dbUrl = process.env.DATABASE_URL || '';
if (!dbUrl.includes('echo_lms_e2e') && !dbUrl.includes('_test') && !dbUrl.includes('_e2e')) {
  console.error(`❌ [SECURITY ABORT] DATABASE_URL does not point to echo_lms_e2e! Got: ${dbUrl}`);
  process.exit(1);
}

process.env.AUTH_SECRET = process.env.AUTH_SECRET || "echo_jwt_secret_key_2026";
process.env.NODE_ENV = 'test';

import { encode } from '@auth/core/jwt';
import { buildApp } from '../src/app';

interface TestUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string | null;
  cookieHeader: string;
}

async function createAuthCookie(user: { id: string; email: string; name: string; role: string; organizationId: string | null }): Promise<string> {
  const token = await encode({
    token: {
      id: user.id,
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    },
    secret: process.env.AUTH_SECRET || "echo_jwt_secret_key_2026",
    salt: 'authjs.session-token',
  });
  return `authjs.session-token=${token}`;
}

async function runTenantIsolationSuite() {
  console.log(`\n===============================================================`);
  console.log(`🛡️  ECHO LMS — PHASE 3: MULTI-TENANT ISOLATION & IDOR AUDIT`);
  console.log(`===============================================================\n`);
  console.log(`🎯 Target DB: ${dbUrl}`);

  const app = await buildApp({ logger: false });
  await app.ready();

  let passed = 0;
  let failed = 0;

  function assertTest(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name}${details ? ` -> ${details}` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Fetch seeded test fixtures from echo_lms_e2e
    const dbUsers = await app.prisma.user.findMany({
      where: {
        email: {
          in: [
            'superadmin-e2e@example.test',
            'admin-alpha@example.test',
            'admin-beta@example.test',
            'student-alpha@example.test',
            'student-beta@example.test'
          ]
        }
      }
    });

    const userMap = new Map<string, any>();
    for (const u of dbUsers) userMap.set(u.email, u);

    const superAdminUser = userMap.get('superadmin-e2e@example.test');
    const adminAlphaUser = userMap.get('admin-alpha@example.test');
    const adminBetaUser = userMap.get('admin-beta@example.test');
    const studentAlphaUser = userMap.get('student-alpha@example.test');
    const studentBetaUser = userMap.get('student-beta@example.test');

    if (!adminAlphaUser || !adminBetaUser || !superAdminUser) {
      throw new Error(`Required seed users not found in echo_lms_e2e! Run npm run test:e2e:db:reset first.`);
    }

    const authAdminAlpha = await createAuthCookie({
      id: adminAlphaUser.id,
      email: adminAlphaUser.email,
      name: `${adminAlphaUser.firstName} ${adminAlphaUser.lastName}`,
      role: adminAlphaUser.role,
      organizationId: adminAlphaUser.organizationId,
    });

    const authAdminBeta = await createAuthCookie({
      id: adminBetaUser.id,
      email: adminBetaUser.email,
      name: `${adminBetaUser.firstName} ${adminBetaUser.lastName}`,
      role: adminBetaUser.role,
      organizationId: adminBetaUser.organizationId,
    });

    const authSuperAdmin = await createAuthCookie({
      id: superAdminUser.id,
      email: superAdminUser.email,
      name: `${superAdminUser.firstName} ${superAdminUser.lastName}`,
      role: superAdminUser.role,
      organizationId: null,
    });

    const authStudentAlpha = await createAuthCookie({
      id: studentAlphaUser.id,
      email: studentAlphaUser.email,
      name: `${studentAlphaUser.firstName} ${studentAlphaUser.lastName}`,
      role: studentAlphaUser.role,
      organizationId: studentAlphaUser.organizationId,
    });

    // -------------------------------------------------------------
    // TEST SUITE 1: CRM Leads Isolation & IDOR Protection
    // -------------------------------------------------------------
    console.log(`\n📋 [Test Suite 1] CRM Leads Multi-Tenant Isolation & IDOR`);
    
    // 1.1 List leads as Admin Beta
    const betaLeadsRes = await app.inject({
      method: 'GET',
      url: '/api/v1/crm/leads',
      headers: { cookie: authAdminBeta }
    });
    const betaLeadsData = JSON.parse(betaLeadsRes.body);
    const hasAlphaLeadInBetaList = betaLeadsData.data?.some((l: any) => l.organizationId === 'tenant-alpha-001' || l.id === 'lead-alpha-001');
    assertTest('Admin Beta GET /leads does NOT leak Alpha leads', !hasAlphaLeadInBetaList && betaLeadsRes.statusCode === 200);

    // 1.2 Direct IDOR read of Alpha lead by Admin Beta
    const idorLeadReadRes = await app.inject({
      method: 'GET',
      url: '/api/v1/crm/leads/lead-alpha-001',
      headers: { cookie: authAdminBeta }
    });
    assertTest('Admin Beta GET /leads/lead-alpha-001 rejected with 403 Forbidden', idorLeadReadRes.statusCode === 403);

    // 1.3 Direct IDOR update of Alpha lead by Admin Beta
    const idorLeadUpdateRes = await app.inject({
      method: 'PATCH',
      url: '/api/v1/crm/leads/lead-alpha-001',
      headers: { cookie: authAdminBeta },
      payload: { name: 'Hacked by Beta' }
    });
    assertTest('Admin Beta PATCH /leads/lead-alpha-001 rejected with 403 Forbidden', idorLeadUpdateRes.statusCode === 403);

    // 1.4 Direct IDOR delete of Alpha lead by Admin Beta
    const idorLeadDeleteRes = await app.inject({
      method: 'DELETE',
      url: '/api/v1/crm/leads/lead-alpha-001',
      headers: { cookie: authAdminBeta }
    });
    assertTest('Admin Beta DELETE /leads/lead-alpha-001 rejected with 403 Forbidden', idorLeadDeleteRes.statusCode === 403);

    // 1.5 Legitimate access of Alpha lead by Admin Alpha
    const alphaLeadReadRes = await app.inject({
      method: 'GET',
      url: '/api/v1/crm/leads/lead-alpha-001',
      headers: { cookie: authAdminAlpha }
    });
    assertTest('Admin Alpha GET /leads/lead-alpha-001 succeeds (200 OK)', alphaLeadReadRes.statusCode === 200);

    // -------------------------------------------------------------
    // TEST SUITE 2: Finance & Invoices Isolation & IDOR Protection
    // -------------------------------------------------------------
    console.log(`\n💰 [Test Suite 2] Finance & Invoices Isolation & IDOR`);

    // 2.1 List invoices as Admin Beta
    const betaInvoicesRes = await app.inject({
      method: 'GET',
      url: '/api/v1/finance/invoices',
      headers: { cookie: authAdminBeta }
    });
    const betaInvoicesData = JSON.parse(betaInvoicesRes.body);
    const hasAlphaInvoiceInBetaList = betaInvoicesData.data?.some((i: any) => i.organizationId === 'tenant-alpha-001' || i.id === 'invoice-alpha-001');
    assertTest('Admin Beta GET /invoices does NOT leak Alpha invoices', !hasAlphaInvoiceInBetaList && betaInvoicesRes.statusCode === 200);

    // 2.2 Direct IDOR read of Alpha invoice by Admin Beta
    const idorInvoiceReadRes = await app.inject({
      method: 'GET',
      url: '/api/v1/finance/invoices/invoice-alpha-001',
      headers: { cookie: authAdminBeta }
    });
    assertTest('Admin Beta GET /invoices/invoice-alpha-001 rejected with 403 Forbidden', idorInvoiceReadRes.statusCode === 403);

    // 2.3 Direct IDOR PDF download of Alpha invoice by Admin Beta
    const idorInvoicePdfRes = await app.inject({
      method: 'GET',
      url: '/api/v1/finance/invoices/invoice-alpha-001/pdf',
      headers: { cookie: authAdminBeta }
    });
    assertTest('Admin Beta GET /invoices/invoice-alpha-001/pdf rejected with 403 Forbidden', idorInvoicePdfRes.statusCode === 403);

    // 2.4 CSV Export tenant filter
    const betaCsvRes = await app.inject({
      method: 'GET',
      url: '/api/v1/finance/invoices/export.csv',
      headers: { cookie: authAdminBeta }
    });
    const csvContainsAlpha = betaCsvRes.body.includes('INV-ALP-2026-001');
    assertTest('Admin Beta GET /invoices/export.csv contains zero Alpha records', !csvContainsAlpha && betaCsvRes.statusCode === 200);

    // 2.5 Direct IDOR update of Alpha invoice by Admin Beta
    const idorInvoicePatchRes = await app.inject({
      method: 'PATCH',
      url: '/api/v1/finance/invoices/invoice-alpha-001',
      headers: { cookie: authAdminBeta },
      payload: { clientName: 'Tampered Client Name' }
    });
    assertTest('Admin Beta PATCH /invoices/invoice-alpha-001 rejected with 403 Forbidden', idorInvoicePatchRes.statusCode === 403);

    // 2.6 Direct IDOR delete of Alpha invoice by Admin Beta
    const idorInvoiceDeleteRes = await app.inject({
      method: 'DELETE',
      url: '/api/v1/finance/invoices/invoice-alpha-001',
      headers: { cookie: authAdminBeta }
    });
    assertTest('Admin Beta DELETE /invoices/invoice-alpha-001 rejected with 403 Forbidden', idorInvoiceDeleteRes.statusCode === 403);

    // 2.7 Legitimate access of Alpha invoice by Admin Alpha
    const alphaInvoiceReadRes = await app.inject({
      method: 'GET',
      url: '/api/v1/finance/invoices/invoice-alpha-001',
      headers: { cookie: authAdminAlpha }
    });
    assertTest('Admin Alpha GET /invoices/invoice-alpha-001 succeeds (200 OK)', alphaInvoiceReadRes.statusCode === 200);

    // -------------------------------------------------------------
    // TEST SUITE 3: LMS Courses Isolation & IDOR Protection
    // -------------------------------------------------------------
    console.log(`\n🎓 [Test Suite 3] LMS Courses Isolation & IDOR`);

    const alphaLmsCourse = await app.prisma.lMSCourse.findFirst({
      where: { course: { organizationId: 'tenant-alpha-001' } }
    });

    if (alphaLmsCourse) {
      // 3.1 List courses as Admin Beta
      const betaCoursesRes = await app.inject({
        method: 'GET',
        url: '/api/v1/lms/courses',
        headers: { cookie: authAdminBeta }
      });
      const betaCoursesData = JSON.parse(betaCoursesRes.body);
      const hasAlphaCourseInBeta = betaCoursesData.courses?.some((c: any) => c.course?.organizationId === 'tenant-alpha-001' || c.id === alphaLmsCourse.id);
      assertTest('Admin Beta GET /lms/courses does NOT leak Alpha courses', !hasAlphaCourseInBeta && betaCoursesRes.statusCode === 200);

      // 3.2 IDOR read of Alpha LMS course by Admin Beta
      const idorCourseReadRes = await app.inject({
        method: 'GET',
        url: `/api/v1/lms/courses/${alphaLmsCourse.id}`,
        headers: { cookie: authAdminBeta }
      });
      assertTest(`Admin Beta GET /lms/courses/${alphaLmsCourse.id} rejected with 403`, idorCourseReadRes.statusCode === 403);

      // 3.3 IDOR patch of Alpha LMS course by Admin Beta
      const idorCoursePatchRes = await app.inject({
        method: 'PATCH',
        url: `/api/v1/lms/courses/${alphaLmsCourse.id}`,
        headers: { cookie: authAdminBeta },
        payload: { name: 'Compromised Course' }
      });
      assertTest(`Admin Beta PATCH /lms/courses/${alphaLmsCourse.id} rejected with 403`, idorCoursePatchRes.statusCode === 403);

      // 3.4 IDOR delete of Alpha LMS course by Admin Beta
      const idorCourseDeleteRes = await app.inject({
        method: 'DELETE',
        url: `/api/v1/lms/courses/${alphaLmsCourse.id}`,
        headers: { cookie: authAdminBeta }
      });
      assertTest(`Admin Beta DELETE /lms/courses/${alphaLmsCourse.id} rejected with 403`, idorCourseDeleteRes.statusCode === 403);

      // 3.5 Legitimate read by Admin Alpha
      const alphaCourseReadRes = await app.inject({
        method: 'GET',
        url: `/api/v1/lms/courses/${alphaLmsCourse.id}`,
        headers: { cookie: authAdminAlpha }
      });
      assertTest(`Admin Alpha GET /lms/courses/${alphaLmsCourse.id} succeeds (200 OK)`, alphaCourseReadRes.statusCode === 200);
    }

    // -------------------------------------------------------------
    // TEST SUITE 4: Student Records & Boundary Isolation
    // -------------------------------------------------------------
    console.log(`\n🧑‍🎓 [Test Suite 4] Students Isolation & Role Boundaries`);

    const alphaStudent = await app.prisma.student.findFirst({
      where: { user: { organizationId: 'tenant-alpha-001' } }
    });

    if (alphaStudent) {
      // 4.1 Admin Beta listing students
      const betaStudentsRes = await app.inject({
        method: 'GET',
        url: '/api/v1/academy/students',
        headers: { cookie: authAdminBeta }
      });
      const betaStudentsData = JSON.parse(betaStudentsRes.body);
      const hasAlphaStudentInBeta = betaStudentsData.data?.some((s: any) => s.id === alphaStudent.id || s.user?.organizationId === 'tenant-alpha-001');
      assertTest('Admin Beta GET /academy/students does NOT leak Alpha students', !hasAlphaStudentInBeta && betaStudentsRes.statusCode === 200);

      // 4.2 Admin Beta IDOR read of Alpha student
      const idorStudentReadRes = await app.inject({
        method: 'GET',
        url: `/api/v1/academy/students/${alphaStudent.id}`,
        headers: { cookie: authAdminBeta }
      });
      assertTest(`Admin Beta GET /academy/students/${alphaStudent.id} rejected with 403`, idorStudentReadRes.statusCode === 403);

      // 4.3 Legitimate read by Admin Alpha
      const alphaStudentReadRes = await app.inject({
        method: 'GET',
        url: `/api/v1/academy/students/${alphaStudent.id}`,
        headers: { cookie: authAdminAlpha }
      });
      assertTest(`Admin Alpha GET /academy/students/${alphaStudent.id} succeeds (200 OK)`, alphaStudentReadRes.statusCode === 200);
    }

    // -------------------------------------------------------------
    // TEST SUITE 5: Settings, Header Spoofing & RBAC Isolation
    // -------------------------------------------------------------
    console.log(`\n⚙️  [Test Suite 5] Organization Settings, Header Spoofing & RBAC`);

    // 5.1 Admin Beta reads own org branding
    const betaOrgRes = await app.inject({
      method: 'GET',
      url: '/api/v1/settings/organization',
      headers: { cookie: authAdminBeta }
    });
    const betaOrgData = JSON.parse(betaOrgRes.body);
    assertTest('Admin Beta GET /settings/organization returns Beta Academy (tenant-beta-002)', betaOrgData.id === 'tenant-beta-002' && betaOrgRes.statusCode === 200);

    // 5.2 Header Spoofing: Admin Beta passes x-tenant-id: tenant-alpha-001
    const spoofHeaderRes = await app.inject({
      method: 'GET',
      url: '/api/v1/settings/organization',
      headers: {
        cookie: authAdminBeta,
        'x-tenant-id': 'tenant-alpha-001'
      }
    });
    const spoofHeaderData = JSON.parse(spoofHeaderRes.body);
    assertTest('Spoofed x-tenant-id header by non-superadmin is IGNORED (remains Beta)', spoofHeaderData.id === 'tenant-beta-002');

    // 5.3 Cookie Spoofing: Admin Beta passes echo_impersonate_tenant=tenant-alpha-001
    const spoofCookieRes = await app.inject({
      method: 'GET',
      url: '/api/v1/settings/organization',
      headers: {
        cookie: `${authAdminBeta}; echo_impersonate_tenant=tenant-alpha-001`
      }
    });
    const spoofCookieData = JSON.parse(spoofCookieRes.body);
    assertTest('Spoofed impersonation cookie by non-superadmin is IGNORED (remains Beta)', spoofCookieData.id === 'tenant-beta-002');

    // 5.4 RBAC assignable users isolation
    const assignableUsersRes = await app.inject({
      method: 'GET',
      url: '/api/v1/settings/roles/assignable-users',
      headers: { cookie: authAdminBeta }
    });
    const assignableData = JSON.parse(assignableUsersRes.body);
    const hasAlphaUserInAssignable = assignableData.users?.some((u: any) => u.email === 'admin-alpha@example.test' || u.email === 'student-alpha@example.test');
    assertTest('Admin Beta GET /roles/assignable-users returns only Beta users', !hasAlphaUserInAssignable && assignableUsersRes.statusCode === 200);

    // -------------------------------------------------------------
    // TEST SUITE 6: Super Admin Global Access & Safe Impersonation
    // -------------------------------------------------------------
    console.log(`\n👑 [Test Suite 6] Super Admin Control Plane & Impersonation`);

    // 6.1 Super Admin global leads aggregation
    const saLeadsRes = await app.inject({
      method: 'GET',
      url: '/api/v1/crm/leads',
      headers: { cookie: authSuperAdmin }
    });
    const saLeadsData = JSON.parse(saLeadsRes.body);
    const hasBothTenants = saLeadsData.data?.some((l: any) => l.organizationId === 'tenant-alpha-001') &&
                          saLeadsData.data?.some((l: any) => l.organizationId === 'tenant-beta-002');
    assertTest('Super Admin without impersonation sees all multi-tenant leads', hasBothTenants && saLeadsRes.statusCode === 200);

    // 6.2 Super Admin with legitimate impersonation
    const saImpersonateRes = await app.inject({
      method: 'GET',
      url: '/api/v1/crm/leads',
      headers: {
        cookie: `${authSuperAdmin}; echo_impersonate_tenant=tenant-alpha-001`
      }
    });
    const saImpersonateData = JSON.parse(saImpersonateRes.body);
    const onlyAlphaLeads = saImpersonateData.data?.every((l: any) => l.organizationId === 'tenant-alpha-001');
    assertTest('Super Admin with echo_impersonate_tenant=tenant-alpha-001 filters strictly to Alpha', onlyAlphaLeads && saImpersonateRes.statusCode === 200);

  } catch (err) {
    console.error(`💥 Fatal error during Phase 3 isolation suite:`, err);
    failed++;
  } finally {
    await app.close();
  }

  console.log(`\n===============================================================`);
  console.log(`📊 PHASE 3 AUDIT RESULTS:`);
  console.log(`   ✅ Passed Tests: ${passed}`);
  console.log(`   ❌ Failed Tests: ${failed}`);
  console.log(`===============================================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log(`🎉 [SUCCESS] Phase 3 Multi-Tenant Isolation & IDOR Audit PASSED!\n`);
    process.exit(0);
  }
}

runTenantIsolationSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
