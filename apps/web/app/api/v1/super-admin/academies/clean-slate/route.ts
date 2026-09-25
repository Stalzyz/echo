import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"
import { SubscriptionEntitlementService } from "@/lib/services/subscription-entitlement.service"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'Super Admin' || session?.user?.impersonatedBySuperAdmin

    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized. Super Admin privileges required." }, { status: 403 })
    }

    await SubscriptionEntitlementService.ensureDefaultPlansExist()

    const result = await prisma.$transaction(async (tx) => {
      // 1. Ensure the Pristine Demo Organization (Echo Academy) exists
      let demoOrg = await tx.organization.findFirst({
        where: {
          OR: [
            { slug: "echo-academy" },
            { slug: "apex-code" },
            { name: "Echo Academy" },
            { name: "Apex Coding Academy" }
          ]
        }
      })

      if (!demoOrg) {
        demoOrg = await tx.organization.create({
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
        })
      } else {
        // Clear any potential slug/domain collision from other orgs first
        await tx.$executeRawUnsafe(`
          UPDATE "organization" 
          SET "slug" = 'purged-' || id, 
              "domain" = 'purged-' || id || '.echolms.com' 
          WHERE ("slug" = 'echo-academy' OR "domain" = 'echo-academy.echolms.com') 
            AND "id" != '${demoOrg.id}';
        `)

        demoOrg = await tx.organization.update({
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
        })
      }

      // 2. Fetch all other organizations that are NOT the demo academy
      const otherOrgs = await tx.organization.findMany({
        where: { id: { not: demoOrg.id } },
        select: { id: true, name: true }
      })

      const otherOrgIds = otherOrgs.map(o => o.id)

      if (otherOrgIds.length > 0) {
        const idsList = otherOrgIds.map(id => `'${id}'`).join(',')
        
        await tx.$executeRawUnsafe(`
          DELETE FROM "organization_entitlement_overrides" WHERE "organizationId" IN (${idsList});
          DELETE FROM "organization_usage_counters" WHERE "organizationId" IN (${idsList});
          DELETE FROM "subscription_payments" WHERE "organizationId" IN (${idsList});
          DELETE FROM "subscription_invoices" WHERE "organizationId" IN (${idsList});
          DELETE FROM "subscription_events" WHERE "organizationId" IN (${idsList});
          DELETE FROM "tenant_subscriptions" WHERE "organizationId" IN (${idsList});
          DELETE FROM "proposals" WHERE "organizationId" IN (${idsList});
          DELETE FROM "invoices" WHERE "organizationId" IN (${idsList});
          DELETE FROM "projects" WHERE "organizationId" IN (${idsList});
          DELETE FROM "forum_categories" WHERE "organizationId" IN (${idsList});

          DELETE FROM "fee_installments" WHERE "enrollmentId" IN (SELECT id FROM "enrollments" WHERE "batchId" IN (SELECT id FROM "batches" WHERE "organizationId" IN (${idsList})));
          DELETE FROM "enrollments" WHERE "batchId" IN (SELECT id FROM "batches" WHERE "organizationId" IN (${idsList}));
          DELETE FROM "batch_sessions" WHERE "batchId" IN (SELECT id FROM "batches" WHERE "organizationId" IN (${idsList}));
          DELETE FROM "batches" WHERE "organizationId" IN (${idsList});

          DELETE FROM "lms_lessons" WHERE "moduleId" IN (SELECT id FROM "lms_modules" WHERE "lmsCourseId" IN (SELECT id FROM "lms_courses" WHERE "courseId" IN (SELECT id FROM "courses" WHERE "organizationId" IN (${idsList}))));
          DELETE FROM "lms_modules" WHERE "lmsCourseId" IN (SELECT id FROM "lms_courses" WHERE "courseId" IN (SELECT id FROM "courses" WHERE "organizationId" IN (${idsList})));
          DELETE FROM "lms_courses" WHERE "courseId" IN (SELECT id FROM "courses" WHERE "organizationId" IN (${idsList}));
          DELETE FROM "certificates" WHERE "courseId" IN (SELECT id FROM "courses" WHERE "organizationId" IN (${idsList}));
          DELETE FROM "quizzes" WHERE "courseId" IN (SELECT id FROM "courses" WHERE "organizationId" IN (${idsList}));
          DELETE FROM "courses" WHERE "organizationId" IN (${idsList});

          DELETE FROM "call_records" WHERE "leadId" IN (SELECT id FROM "leads" WHERE "organizationId" IN (${idsList}));
          DELETE FROM "lead_activities" WHERE "leadId" IN (SELECT id FROM "leads" WHERE "organizationId" IN (${idsList}));
          DELETE FROM "leads" WHERE "organizationId" IN (${idsList});
          DELETE FROM "form_submissions" WHERE "formId" IN (SELECT id FROM "enquiry_forms" WHERE "organizationId" IN (${idsList}));
          DELETE FROM "enquiry_forms" WHERE "organizationId" IN (${idsList});
          DELETE FROM "demo_registrations" WHERE "demoSessionId" IN (SELECT id FROM "demo_sessions" WHERE "organizationId" IN (${idsList}));
          DELETE FROM "demo_sessions" WHERE "organizationId" IN (${idsList});
          DELETE FROM "walk_ins" WHERE "organizationId" IN (${idsList});

          DELETE FROM "campus_events" WHERE "organizationId" IN (${idsList});
          DELETE FROM "placement_jobs" WHERE "companyId" IN (SELECT id FROM "placement_companies" WHERE "organizationId" IN (${idsList}));
          DELETE FROM "placement_companies" WHERE "organizationId" IN (${idsList});
          DELETE FROM "academy_projects" WHERE "organizationId" IN (${idsList});

          DELETE FROM "students" WHERE "userId" IN (SELECT id FROM "users" WHERE "organizationId" IN (${idsList}) AND "role" != 'SUPER_ADMIN');
          DELETE FROM "educators" WHERE "userId" IN (SELECT id FROM "users" WHERE "organizationId" IN (${idsList}) AND "role" != 'SUPER_ADMIN');
          DELETE FROM "employees" WHERE "userId" IN (SELECT id FROM "users" WHERE "organizationId" IN (${idsList}) AND "role" != 'SUPER_ADMIN');
          DELETE FROM "sessions" WHERE "userId" IN (SELECT id FROM "users" WHERE "organizationId" IN (${idsList}) AND "role" != 'SUPER_ADMIN');
          DELETE FROM "users" WHERE "organizationId" IN (${idsList}) AND "role" != 'SUPER_ADMIN';

          DELETE FROM "organization" WHERE "id" IN (${idsList});
        `)
      }

      // 3. Ensure Demo Accounts Exist
      const passwordHash = "$2b$10$s0bAH5frbigHJnR3HvS70upJ/Ml8VrF9dGV7Pd.IlrmtX3BuUjFEi"

      await tx.user.upsert({
        where: { email: "demo.academy@echo.in" },
        update: { passwordHash, role: "ADMIN", status: "ACTIVE", firstName: "Echo", lastName: "Director", organizationId: demoOrg.id },
        create: { email: "demo.academy@echo.in", passwordHash, role: "ADMIN", status: "ACTIVE", firstName: "Echo", lastName: "Director", organizationId: demoOrg.id }
      })

      const stu = await tx.user.upsert({
        where: { email: "demo.student@echo.in" },
        update: { passwordHash, role: "STUDENT", status: "ACTIVE", firstName: "Alex", lastName: "Martin", organizationId: demoOrg.id },
        create: { email: "demo.student@echo.in", passwordHash, role: "STUDENT", status: "ACTIVE", firstName: "Alex", lastName: "Martin", organizationId: demoOrg.id }
      })

      await tx.student.upsert({
        where: { userId: stu.id },
        update: { studentCode: "STU-ECHO-001", learningLanguage: "English" },
        create: { userId: stu.id, studentCode: "STU-ECHO-001", learningLanguage: "English" }
      })

      const edu = await tx.user.upsert({
        where: { email: "demo.educator@echo.in" },
        update: { passwordHash, role: "EDUCATOR", status: "ACTIVE", firstName: "Dr. Priya", lastName: "Menon", organizationId: demoOrg.id },
        create: { email: "demo.educator@echo.in", passwordHash, role: "EDUCATOR", status: "ACTIVE", firstName: "Dr. Priya", lastName: "Menon", organizationId: demoOrg.id }
      })

      await tx.educator.upsert({
        where: { userId: edu.id },
        update: { designation: "Lead Faculty & Curriculum Director", company: "Echo Academy" },
        create: { userId: edu.id, designation: "Lead Faculty & Curriculum Director", company: "Echo Academy" }
      })

      return {
        demoOrg,
        deletedCount: otherOrgs.length,
        deletedNames: otherOrgs.map(o => o.name)
      }
    })

    return NextResponse.json({
      success: true,
      message: `Clean slate executed successfully! Preserved pristine Demo Academy '${result.demoOrg.name}', deleted ${result.deletedCount} dummy vendor(s).`,
      demoAcademy: result.demoOrg,
      deletedVendors: result.deletedNames
    })
  } catch (error: any) {
    console.error("Error executing clean slate:", error)
    return NextResponse.json({ error: error.message || "Failed to execute clean slate" }, { status: 500 })
  }
}
