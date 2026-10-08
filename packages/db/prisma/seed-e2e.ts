import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function assertTestDatabaseSafety() {
  const dbUrl = process.env.DATABASE_URL || '';
  console.log(`[E2E Safety Check] Validating database target: ${dbUrl.replace(/:[^:@]+@/, ':***@')}`);

  const isSafeTestDb = 
    dbUrl.includes('echo_lms_e2e') || 
    dbUrl.includes('echo_lms_test') || 
    dbUrl.endsWith('_test') || 
    dbUrl.endsWith('_e2e') ||
    process.env.NODE_ENV === 'test' ||
    process.env.E2E_SAFE_OVERRIDE === 'true';

  if (!isSafeTestDb) {
    throw new Error(
      `⛔ FATAL SAFETY ABORT: Target database does not match E2E naming convention (must contain 'echo_lms_e2e' or '_test'). Target: ${dbUrl}`
    );
  }
}

export async function resetAndSeedE2E() {
  await assertTestDatabaseSafety();

  console.log('🧹 [E2E Reset] Truncating database tables in dedicated E2E database...');

  // Safe table cleanup in reverse foreign key order
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations');

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables.map((t) => `"${t}"`).join(', ')} CASCADE;`);
    console.log(`✅ [E2E Reset] Cleaned ${tables.length} tables.`);
  } catch (err: any) {
    console.warn(`⚠️ [E2E Reset] Truncate warning, continuing with schema push: ${err.message}`);
  }

  console.log('🌱 [E2E Seed] Seeding multi-tenant test hierarchy...');
  const passwordHash = await bcrypt.hash('TestPassword123!', 10);

  // ─────────────────────────────────────────
  // 1. CREATE 3 DISTINCT TENANTS (ORGANIZATIONS)
  // ─────────────────────────────────────────
  const tenantAlpha = await prisma.organization.create({
    data: {
      id: 'tenant-alpha-001',
      name: 'E2E Academy Alpha',
      slug: 'academy-alpha',
      subdomain: 'alpha',
      customDomain: 'alpha.echo.test',
      plan: 'GROW',
      subscriptionStatus: 'ACTIVE',
      brandColor: '#0d9488',
      supportEmail: 'support@academy-alpha.test',
      contactPhone: '+91 98765 00001',
      websiteUrl: 'https://alpha.echo.test',
      primaryContactName: 'Admin Alpha',
    },
  });

  const tenantBeta = await prisma.organization.create({
    data: {
      id: 'tenant-beta-002',
      name: 'E2E Academy Beta',
      slug: 'academy-beta',
      subdomain: 'beta',
      customDomain: 'beta.echo.test',
      plan: 'START',
      subscriptionStatus: 'ACTIVE',
      brandColor: '#6366f1',
      supportEmail: 'support@academy-beta.test',
      contactPhone: '+91 98765 00002',
      websiteUrl: 'https://beta.echo.test',
      primaryContactName: 'Admin Beta',
    },
  });

  const tenantGamma = await prisma.organization.create({
    data: {
      id: 'tenant-gamma-003',
      name: 'E2E Academy Gamma',
      slug: 'academy-gamma',
      subdomain: 'gamma',
      customDomain: 'gamma.echo.test',
      plan: 'PRO',
      subscriptionStatus: 'ACTIVE',
      brandColor: '#e11d48',
      supportEmail: 'support@academy-gamma.test',
      contactPhone: '+91 98765 00003',
      websiteUrl: 'https://gamma.echo.test',
      primaryContactName: 'Admin Gamma',
    },
  });

  console.log('✅ Created Tenants: Alpha (GROW), Beta (START), Gamma (PRO)');

  // ─────────────────────────────────────────
  // 2. CREATE CONTROLLED ROLE USERS
  // ─────────────────────────────────────────
  // A. Super Admin (Global, orgId = null)
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin-e2e@example.test',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+91 99999 00000',
    },
  });

  // B. Academy Admin Alpha (Tenant A)
  const adminAlpha = await prisma.user.create({
    data: {
      email: 'admin-alpha@example.test',
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      firstName: 'Admin',
      lastName: 'Alpha',
      phone: '+91 98765 11111',
      organizationId: tenantAlpha.id,
    },
  });

  // C. Academy Admin Beta (Tenant B)
  const adminBeta = await prisma.user.create({
    data: {
      email: 'admin-beta@example.test',
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      firstName: 'Admin',
      lastName: 'Beta',
      phone: '+91 98765 22222',
      organizationId: tenantBeta.id,
    },
  });

  // D. Staff Alpha (Tenant A)
  const staffAlpha = await prisma.user.create({
    data: {
      email: 'staff-alpha@example.test',
      passwordHash,
      role: UserRole.STAFF,
      status: UserStatus.ACTIVE,
      firstName: 'Staff',
      lastName: 'Alpha',
      phone: '+91 98765 33333',
      organizationId: tenantAlpha.id,
    },
  });

  // E. Counsellor Alpha (Tenant A)
  const counsellorAlpha = await prisma.user.create({
    data: {
      email: 'counsellor-alpha@example.test',
      passwordHash,
      role: UserRole.STAFF,
      status: UserStatus.ACTIVE,
      firstName: 'Counsellor',
      lastName: 'Alpha',
      phone: '+91 98765 44444',
      organizationId: tenantAlpha.id,
    },
  });

  // F. Trainer / Educator Alpha (Tenant A)
  const trainerAlphaUser = await prisma.user.create({
    data: {
      email: 'trainer-alpha@example.test',
      passwordHash,
      role: UserRole.EDUCATOR,
      status: UserStatus.ACTIVE,
      firstName: 'Trainer',
      lastName: 'Alpha',
      phone: '+91 98765 55555',
      organizationId: tenantAlpha.id,
      educator: {
        create: {
          designation: 'Lead Full-Stack Instructor',
          bio: 'Specialist in Next.js, Node.js, and Cloud Architectures.',
          skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
          yearsExperience: 8,
        },
      },
    },
    include: { educator: true },
  });

  // G. Student Alpha (Tenant A)
  const studentAlphaUser = await prisma.user.create({
    data: {
      email: 'student-alpha@example.test',
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      firstName: 'Student',
      lastName: 'Alpha',
      phone: '+91 98765 66666',
      organizationId: tenantAlpha.id,
    },
  });

  const studentAlpha = await prisma.student.create({
    data: {
      id: 'student-alpha-id',
      userId: studentAlphaUser.id,
      organizationId: tenantAlpha.id,
      rollNo: 'E2E-ALPHA-001',
      studentType: 'ONSITE',
      dateOfBirth: new Date('2002-05-15'),
      gender: 'Male',
      address: '123 Alpha Boulevard, Tech City',
      guardianName: 'Parent Alpha',
      guardianPhone: '+91 98765 77777',
      status: 'ACTIVE',
    },
  });

  // H. Student Beta (Tenant B)
  const studentBetaUser = await prisma.user.create({
    data: {
      email: 'student-beta@example.test',
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      firstName: 'Student',
      lastName: 'Beta',
      phone: '+91 98765 88888',
      organizationId: tenantBeta.id,
    },
  });

  const studentBeta = await prisma.student.create({
    data: {
      id: 'student-beta-id',
      userId: studentBetaUser.id,
      organizationId: tenantBeta.id,
      rollNo: 'E2E-BETA-001',
      studentType: 'ONLINE',
      dateOfBirth: new Date('2003-08-20'),
      gender: 'Female',
      address: '456 Beta Highway, Data Park',
      guardianName: 'Parent Beta',
      guardianPhone: '+91 98765 99999',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created Users: Super Admin, Admins (Alpha/Beta), Staff, Counsellor, Trainer, Students (Alpha/Beta)');

  // ─────────────────────────────────────────
  // 3. TENANT A CONTROLLED BUSINESS FIXTURES
  // ─────────────────────────────────────────
  const courseAlpha = await prisma.course.create({
    data: {
      id: 'course-alpha-001',
      organizationId: tenantAlpha.id,
      title: 'Full-Stack Web Mastery (Alpha)',
      code: 'FSW-101',
      category: 'Software Engineering',
      durationHours: 120,
      fee: 45000,
      isPublished: true,
      description: 'Comprehensive Full-Stack training program for Alpha students.',
    },
  });

  const batchAlpha = await prisma.batch.create({
    data: {
      id: 'batch-alpha-001',
      organizationId: tenantAlpha.id,
      courseId: courseAlpha.id,
      name: 'Alpha-Batch-2026-A',
      code: 'BATCH-ALP-01',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      maxCapacity: 30,
      currentStudents: 1,
      mode: 'OFFLINE',
      status: 'ACTIVE',
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: studentAlpha.id,
      courseId: courseAlpha.id,
      batchId: batchAlpha.id,
      status: 'ACTIVE',
      enrolledAt: new Date(),
    },
  });

  // Tenant A Leads
  await prisma.lead.create({
    data: {
      id: 'lead-alpha-001',
      organizationId: tenantAlpha.id,
      name: 'Prospect Alpha 1',
      email: 'prospect1@alpha-lead.test',
      phone: '+91 91111 00001',
      status: 'NEW',
      source: 'WEBSITE',
      tier: 'HIGH',
      courseInterest: 'Full-Stack Web Mastery',
    },
  });

  // Tenant A Fee Invoice & Installment
  await prisma.invoice.create({
    data: {
      id: 'invoice-alpha-001',
      organizationId: tenantAlpha.id,
      invoiceNumber: 'INV-ALP-2026-001',
      clientName: 'Student Alpha',
      clientEmail: studentAlphaUser.email,
      totalAmount: 45000,
      status: 'PARTIALLY_PAID',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // ─────────────────────────────────────────
  // 4. TENANT B CONTROLLED BUSINESS FIXTURES
  // ─────────────────────────────────────────
  const courseBeta = await prisma.course.create({
    data: {
      id: 'course-beta-001',
      organizationId: tenantBeta.id,
      title: 'Data Analytics & AI (Beta)',
      code: 'DAT-201',
      category: 'Data Science',
      durationHours: 80,
      fee: 30000,
      isPublished: true,
      description: 'Data analytics program scoped strictly to Tenant Beta.',
    },
  });

  const batchBeta = await prisma.batch.create({
    data: {
      id: 'batch-beta-001',
      organizationId: tenantBeta.id,
      courseId: courseBeta.id,
      name: 'Beta-Batch-2026-1',
      code: 'BATCH-BET-01',
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      maxCapacity: 25,
      currentStudents: 1,
      mode: 'ONLINE',
      status: 'ACTIVE',
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: studentBeta.id,
      courseId: courseBeta.id,
      batchId: batchBeta.id,
      status: 'ACTIVE',
      enrolledAt: new Date(),
    },
  });

  await prisma.lead.create({
    data: {
      id: 'lead-beta-001',
      organizationId: tenantBeta.id,
      name: 'Prospect Beta 1',
      email: 'prospect1@beta-lead.test',
      phone: '+91 92222 00001',
      status: 'NEW',
      source: 'META_ADS',
      tier: 'MEDIUM',
      courseInterest: 'Data Analytics & AI',
    },
  });

  console.log('🎉 [E2E Seed] Completed deterministic multi-tenant E2E seed successfully!');

  return {
    tenants: { alpha: tenantAlpha, beta: tenantBeta, gamma: tenantGamma },
    users: {
      superAdmin,
      adminAlpha,
      adminBeta,
      staffAlpha,
      counsellorAlpha,
      trainerAlpha: trainerAlphaUser,
      studentAlpha: studentAlphaUser,
      studentBeta: studentBetaUser,
    },
  };
}

if (require.main === module) {
  resetAndSeedE2E()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ [E2E Seed Error]', err);
      process.exit(1);
    });
}
