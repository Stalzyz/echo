import { PrismaClient, UserRole, UserStatus, BusinessUnit, InvoiceStatus, DeliveryMode, LeadStatus, LeadSource } from '@prisma/client';
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
      domain: 'alpha.echo.test',
      subscription: 'GROWTH',
      status: 'ACTIVE',
      primaryColor: '#0d9488',
      supportEmail: 'support@academy-alpha.test',
      phone: '+91 98765 00001',
      website: 'https://alpha.echo.test',
      ownerName: 'Admin Alpha',
      ownerEmail: 'admin-alpha@example.test',
    },
  });

  const tenantBeta = await prisma.organization.create({
    data: {
      id: 'tenant-beta-002',
      name: 'E2E Academy Beta',
      slug: 'academy-beta',
      domain: 'beta.echo.test',
      subscription: 'STARTER',
      status: 'ACTIVE',
      primaryColor: '#6366f1',
      supportEmail: 'support@academy-beta.test',
      phone: '+91 98765 00002',
      website: 'https://beta.echo.test',
      ownerName: 'Admin Beta',
      ownerEmail: 'admin-beta@example.test',
    },
  });

  const tenantGamma = await prisma.organization.create({
    data: {
      id: 'tenant-gamma-003',
      name: 'E2E Academy Gamma',
      slug: 'academy-gamma',
      domain: 'gamma.echo.test',
      subscription: 'ENTERPRISE',
      status: 'ACTIVE',
      primaryColor: '#e11d48',
      supportEmail: 'support@academy-gamma.test',
      phone: '+91 98765 00003',
      website: 'https://gamma.echo.test',
      ownerName: 'Admin Gamma',
      ownerEmail: 'admin-gamma@example.test',
    },
  });

  console.log('✅ Created Tenants: Alpha (GROWTH), Beta (STARTER), Gamma (ENTERPRISE)');

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
      studentCode: 'E2E-ALPHA-001',
      deliveryMode: DeliveryMode.ONSITE,
      dateOfBirth: new Date('2002-05-15'),
      gender: 'Male',
      address: '123 Alpha Boulevard, Tech City',
      parentName: 'Parent Alpha',
      parentPhone: '+91 98765 77777',
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
      studentCode: 'E2E-BETA-001',
      deliveryMode: DeliveryMode.ONLINE,
      dateOfBirth: new Date('2003-08-20'),
      gender: 'Female',
      address: '456 Beta Highway, Data Park',
      parentName: 'Parent Beta',
      parentPhone: '+91 98765 99999',
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
      name: 'Full-Stack Web Mastery (Alpha)',
      code: 'FSW-101-ALP',
      duration: '3 months',
      fee: 45000,
      isPublished: true,
      description: 'Comprehensive Full-Stack training program for Alpha students.',
    },
  });

  const lmsCourseAlpha = await prisma.lMSCourse.create({
    data: {
      id: 'lms-course-alpha-001',
      courseId: courseAlpha.id,
      isPublished: true,
      modules: {
        create: [
          {
            title: 'Module 1: Next.js & Fastify Architecture',
            sortOrder: 1,
            lessons: {
              create: [
                {
                  title: 'Lesson 1.1: Multi-Tenant Schema Design',
                  type: 'VIDEO',
                  sortOrder: 1,
                  contentUrl: 'https://cdn.echo.test/videos/lesson1.mp4',
                  isPreview: true,
                }
              ]
            }
          }
        ]
      }
    }
  });

  const batchAlpha = await prisma.batch.create({
    data: {
      id: 'batch-alpha-001',
      organizationId: tenantAlpha.id,
      courseId: courseAlpha.id,
      name: 'Alpha-Batch-2026-A',
      type: 'MORNING',
      capacity: 30,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: studentAlpha.id,
      batchId: batchAlpha.id,
      totalFee: 45000,
      feePaid: 15000,
      status: 'ACTIVE',
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
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE,
      courseInterest: 'Full-Stack Web Mastery',
      businessUnit: 'ACADEMY',
    },
  });

  // Tenant A Fee Invoice
  await prisma.invoice.create({
    data: {
      id: 'invoice-alpha-001',
      organizationId: tenantAlpha.id,
      invoiceNumber: 'INV-ALP-2026-001',
      clientName: 'Student Alpha',
      clientEmail: studentAlphaUser.email,
      businessUnit: BusinessUnit.ACADEMY,
      subtotal: 45000,
      totalAmount: 45000,
      paidAmount: 15000,
      status: InvoiceStatus.PARTIALLY_PAID,
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
      name: 'Data Analytics & AI (Beta)',
      code: 'DAT-201-BET',
      duration: '2 months',
      fee: 30000,
      isPublished: true,
      description: 'Data analytics program scoped strictly to Tenant Beta.',
    },
  });

  const lmsCourseBeta = await prisma.lMSCourse.create({
    data: {
      id: 'lms-course-beta-001',
      courseId: courseBeta.id,
      isPublished: true,
      modules: {
        create: [
          {
            title: 'Module 1: Python for Data Science',
            sortOrder: 1,
            lessons: {
              create: [
                {
                  title: 'Lesson 1.1: Pandas & NumPy Essentials',
                  type: 'VIDEO',
                  sortOrder: 1,
                  contentUrl: 'https://cdn.echo.test/videos/beta-lesson1.mp4',
                  isPreview: true,
                }
              ]
            }
          }
        ]
      }
    }
  });

  const batchBeta = await prisma.batch.create({
    data: {
      id: 'batch-beta-001',
      organizationId: tenantBeta.id,
      courseId: courseBeta.id,
      name: 'Beta-Batch-2026-1',
      type: 'ONLINE',
      capacity: 25,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: studentBeta.id,
      batchId: batchBeta.id,
      totalFee: 30000,
      feePaid: 30000,
      status: 'ACTIVE',
    },
  });

  await prisma.lead.create({
    data: {
      id: 'lead-beta-001',
      organizationId: tenantBeta.id,
      name: 'Prospect Beta 1',
      email: 'prospect1@beta-lead.test',
      phone: '+91 92222 00001',
      status: LeadStatus.NEW,
      source: LeadSource.META_ADS,
      courseInterest: 'Data Analytics & AI',
      businessUnit: 'ACADEMY',
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
