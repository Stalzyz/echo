const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting Clean Slate on database...");

  // 1. Ensure Echo Academy exists
  let demoOrg = await prisma.organization.findFirst({
    where: {
      OR: [
        { slug: "echo-academy" },
        { slug: "apex-code" },
        { name: "Echo Academy" },
        { name: "Apex Coding Academy" }
      ]
    }
  });

  if (!demoOrg) {
    demoOrg = await prisma.organization.create({
      data: {
        name: "Echo Academy",
        slug: "echo-academy",
        domain: "echo-academy.echolms.com",
        ownerName: "Echo Academy Director",
        ownerEmail: "demo.academy@echo.in",
        ownerPhone: "+91 9876543210",
        subscription: "GROWTH",
        status: "ACTIVE",
        primaryColor: "#0f766e",
        secondaryColor: "#1e1b4b",
        accentColor: "#6366f1"
      }
    });
  } else {
    demoOrg = await prisma.organization.update({
      where: { id: demoOrg.id },
      data: {
        name: "Echo Academy",
        slug: "echo-academy",
        domain: "echo-academy.echolms.com",
        ownerName: "Echo Academy Director",
        ownerEmail: "demo.academy@echo.in",
        subscription: "GROWTH",
        status: "ACTIVE",
        primaryColor: "#0f766e",
        secondaryColor: "#1e1b4b",
        accentColor: "#6366f1"
      }
    });
  }

  console.log(`Demo Org secured: ${demoOrg.name} (${demoOrg.id})`);

  // 1.1 Ensure Default SaaS Plans Exist
  const defaultPlans = [
    {
      id: "plan-starter",
      slug: "starter-academy",
      name: "STARTER ACADEMY",
      description: "Ideal for individual tutors & boutique coaching centers starting digital learning.",
      billingType: "RECURRING",
      monthlyPrice: 1999,
      yearlyPrice: 24999,
      offerPriceYearly: 14999,
      currency: "INR",
      taxRate: 18.0,
      gstText: "+ 18% GST",
      trialDays: 14,
      gracePeriodDays: 7,
      sortOrder: 1,
      isActive: true,
      isPopular: false,
      badgeText: "Save 40%",
      maxStudents: 500,
      maxInstructors: 5,
      maxCourses: 15,
      maxBatches: 20,
      maxStorageGB: 50,
      maxWhatsAppMessages: 1000,
      maxAiRequests: 500,
      maxCallMinutes: 100,
      maxCustomDomains: 0,
      maxAutomations: 3,
      maxStaff: 5,
      features: {
        coreLms: true,
        studentPortal: true,
        feesEmi: true,
        certificates: true,
        customPaymentGateway: true,
        crmPipelines: true,
        attendanceScanner: true,
        whatsappAuto: false,
        emailMarketing: false,
        webinars: false,
        whitelabel: false,
        mentorship: false,
        walkInKiosk: false,
        referrals: false,
        aiLessonWriter: false,
        callIntelligence: false,
        customDomain: false
      }
    },
    {
      id: "plan-growth",
      slug: "growth-institute",
      name: "GROWTH INSTITUTE",
      description: "For expanding institutes that need WhatsApp automation, CRM pipelines & AI lesson writers.",
      billingType: "RECURRING",
      monthlyPrice: 3999,
      yearlyPrice: 49999,
      offerPriceYearly: 29999,
      currency: "INR",
      taxRate: 18.0,
      gstText: "+ 18% GST",
      trialDays: 14,
      gracePeriodDays: 7,
      sortOrder: 2,
      isActive: true,
      isPopular: true,
      badgeText: "Most Popular Choice",
      maxStudents: 2500,
      maxInstructors: 20,
      maxCourses: 50,
      maxBatches: 100,
      maxStorageGB: 250,
      maxWhatsAppMessages: 10000,
      maxAiRequests: 5000,
      maxCallMinutes: 1000,
      maxCustomDomains: 1,
      maxAutomations: 15,
      maxStaff: 25,
      features: {
        coreLms: true,
        studentPortal: true,
        feesEmi: true,
        certificates: true,
        customPaymentGateway: true,
        whatsappAuto: true,
        emailMarketing: true,
        webinars: true,
        whitelabel: true,
        mentorship: true,
        referrals: true,
        crmPipelines: true,
        attendanceScanner: true,
        aiLessonWriter: true,
        callIntelligence: true,
        customDomain: true,
        walkInKiosk: false
      }
    },
    {
      id: "plan-enterprise",
      slug: "enterprise-multi-branch",
      name: "ENTERPRISE PRO",
      description: "Complete unconstrained platform suite with full whitelabeling, multi-branch & unlimited capacity.",
      billingType: "RECURRING",
      monthlyPrice: 7999,
      yearlyPrice: 99999,
      offerPriceYearly: 69999,
      currency: "INR",
      taxRate: 18.0,
      gstText: "+ 18% GST",
      trialDays: 30,
      gracePeriodDays: 14,
      sortOrder: 3,
      isActive: true,
      isPopular: false,
      badgeText: "Full Enterprise Suite",
      maxStudents: -1,
      maxInstructors: -1,
      maxCourses: -1,
      maxBatches: -1,
      maxStorageGB: -1,
      maxWhatsAppMessages: -1,
      maxAiRequests: -1,
      maxCallMinutes: -1,
      maxCustomDomains: -1,
      maxAutomations: -1,
      maxStaff: -1,
      features: {
        coreLms: true,
        studentPortal: true,
        feesEmi: true,
        certificates: true,
        customPaymentGateway: true,
        whatsappAuto: true,
        emailMarketing: true,
        webinars: true,
        whitelabel: true,
        mentorship: true,
        walkInKiosk: true,
        referrals: true,
        crmPipelines: true,
        attendanceScanner: true,
        aiLessonWriter: true,
        callIntelligence: true,
        customDomain: true,
        apiAccess: true
      }
    }
  ];

  for (const plan of defaultPlans) {
    await prisma.saaSPlan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan
    });
  }

  // 1.2 Ensure Demo Org has an active GROWTH plan subscription
  const growthPlan = await prisma.saaSPlan.findUnique({ where: { slug: "growth-institute" } });
  if (growthPlan) {
    await prisma.tenantSubscription.upsert({
      where: { organizationId: demoOrg.id },
      update: {
        planId: growthPlan.id,
        status: "ACTIVE",
        billingCycle: "MONTHLY",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      create: {
        organizationId: demoOrg.id,
        planId: growthPlan.id,
        status: "ACTIVE",
        billingCycle: "MONTHLY",
        startDate: new Date(),
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    });
  }

  const otherOrgs = await prisma.organization.findMany({
    where: { id: { not: demoOrg.id } },
    select: { id: true, name: true, slug: true }
  });

  console.log(`Found ${otherOrgs.length} dummy/other organizations to remove.`);

  const otherOrgIds = otherOrgs.map(o => o.id);

  if (otherOrgIds.length > 0) {
    // Let's use raw SQL cascading deletes or ordered deletions to guarantee 100% success
    await prisma.$executeRawUnsafe(`
      -- 1. Billing & Subscriptions
      DELETE FROM "organization_entitlement_overrides" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "organization_usage_counters" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "subscription_payments" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "subscription_invoices" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "subscription_events" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "tenant_subscriptions" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});

      -- 2. Proposals & Projects & Invoices
      DELETE FROM "proposals" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "invoices" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "projects" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "forum_categories" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});

      -- 3. LMS Batches, Enrollments, Fee Installments
      DELETE FROM "fee_installments" WHERE "enrollmentId" IN (SELECT id FROM "enrollments" WHERE "batchId" IN (SELECT id FROM "batches" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')})));
      DELETE FROM "enrollments" WHERE "batchId" IN (SELECT id FROM "batches" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}));
      DELETE FROM "batch_sessions" WHERE "batchId" IN (SELECT id FROM "batches" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}));
      DELETE FROM "batches" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});

      -- 4. LMS Courses, Modules, Lessons
      DELETE FROM "lms_lessons" WHERE "moduleId" IN (SELECT id FROM "lms_modules" WHERE "lmsCourseId" IN (SELECT id FROM "lms_courses" WHERE "courseId" IN (SELECT id FROM "courses" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')} vendor_id_placeholder)));
      DELETE FROM "lms_modules" WHERE "lmsCourseId" IN (SELECT id FROM "lms_courses" WHERE "courseId" IN (SELECT id FROM "courses" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')})));
      DELETE FROM "lms_courses" WHERE "courseId" IN (SELECT id FROM "courses" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}));
      DELETE FROM "certificates" WHERE "courseId" IN (SELECT id FROM "courses" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}));
      DELETE FROM "quizzes" WHERE "courseId" IN (SELECT id FROM "courses" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}));
      DELETE FROM "courses" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});

      -- 5. CRM Leads, Forms, Walk-Ins, Demo Sessions
      DELETE FROM "call_records" WHERE "leadId" IN (SELECT id FROM "leads" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}));
      DELETE FROM "lead_activities" WHERE "leadId" IN (SELECT id FROM "leads" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}));
      DELETE FROM "leads" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "form_submissions" WHERE "formId" IN (SELECT id FROM "enquiry_forms" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}));
      DELETE FROM "enquiry_forms" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "demo_registrations" WHERE "demoSessionId" IN (SELECT id FROM "demo_sessions" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}));
      DELETE FROM "demo_sessions" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "walk_ins" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});

      -- 6. Events, Placements, Projects
      DELETE FROM "campus_events" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "placement_jobs" WHERE "companyId" IN (SELECT id FROM "placement_companies" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}));
      DELETE FROM "placement_companies" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
      DELETE FROM "academy_projects" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});

      -- 7. Users strictly belonging to these orgs (excluding SUPER_ADMIN)
      DELETE FROM "students" WHERE "userId" IN (SELECT id FROM "users" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}) AND "role" != 'SUPER_ADMIN');
      DELETE FROM "educators" WHERE "userId" IN (SELECT id FROM "users" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}) AND "role" != 'SUPER_ADMIN');
      DELETE FROM "employees" WHERE "userId" IN (SELECT id FROM "users" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}) AND "role" != 'SUPER_ADMIN');
      DELETE FROM "sessions" WHERE "userId" IN (SELECT id FROM "users" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}) AND "role" != 'SUPER_ADMIN');
      DELETE FROM "users" WHERE "organizationId" IN (${otherOrgIds.map(id => `'${id}'`).join(',')}) AND "role" != 'SUPER_ADMIN';

      -- 8. Delete the Organizations
      DELETE FROM "organization" WHERE "id" IN (${otherOrgIds.map(id => `'${id}'`).join(',')});
    `.replace(' vendor_id_placeholder', ''));

    console.log(`Successfully purged ${otherOrgs.length} dummy organization(s) and all linked data!`);
  }

  // 3. Ensure demo users exist
  const passwordHash = "$2b$10$s0bAH5frbigHJnR3HvS70upJ/Ml8VrF9dGV7Pd.IlrmtX3BuUjFEi";

  await prisma.user.upsert({
    where: { email: "demo.academy@echo.in" },
    update: { passwordHash, role: "ADMIN", status: "ACTIVE", firstName: "Echo", lastName: "Director", organizationId: demoOrg.id },
    create: { email: "demo.academy@echo.in", passwordHash, role: "ADMIN", status: "ACTIVE", firstName: "Echo", lastName: "Director", organizationId: demoOrg.id }
  });

  const stu = await prisma.user.upsert({
    where: { email: "demo.student@echo.in" },
    update: { passwordHash, role: "STUDENT", status: "ACTIVE", firstName: "Alex", lastName: "Martin", organizationId: demoOrg.id },
    create: { email: "demo.student@echo.in", passwordHash, role: "STUDENT", status: "ACTIVE", firstName: "Alex", lastName: "Martin", organizationId: demoOrg.id }
  });

  await prisma.student.upsert({
    where: { userId: stu.id },
    update: { studentCode: "STU-ECHO-001", learningLanguage: "English" },
    create: { userId: stu.id, studentCode: "STU-ECHO-001", learningLanguage: "English" }
  });

  const edu = await prisma.user.upsert({
    where: { email: "demo.educator@echo.in" },
    update: { passwordHash, role: "EDUCATOR", status: "ACTIVE", firstName: "Dr. Priya", lastName: "Menon", organizationId: demoOrg.id },
    create: { email: "demo.educator@echo.in", passwordHash, role: "EDUCATOR", status: "ACTIVE", firstName: "Dr. Priya", lastName: "Menon", organizationId: demoOrg.id }
  });

  await prisma.educator.upsert({
    where: { userId: edu.id },
    update: { designation: "Lead Faculty & Curriculum Director", company: "Echo Academy" },
    create: { userId: edu.id, designation: "Lead Faculty & Curriculum Director", company: "Echo Academy" }
  });

  console.log("Clean slate completed successfully with 1 Demo Academy and 3 Demo Users!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
