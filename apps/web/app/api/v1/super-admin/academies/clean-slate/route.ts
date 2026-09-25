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
      // 1. Ensure the Pristine Demo Organization (Apex Coding Academy) exists
      let demoOrg = await tx.organization.findFirst({
        where: {
          OR: [
            { slug: "apex-code" },
            { name: "Apex Coding Academy" }
          ]
        }
      })

      if (!demoOrg) {
        demoOrg = await tx.organization.create({
          data: {
            name: "Apex Coding Academy",
            slug: "apex-code",
            domain: "apex-code.echolms.com",
            ownerName: "Apex Academy Director",
            ownerEmail: "demo.academy@echo.in",
            ownerPhone: "+91 9876543210",
            subscription: "GROWTH",
            status: "ACTIVE",
            primaryColor: "#0d9488",
            secondaryColor: "#115e59",
            accentColor: "#f59e0b"
          }
        })
      } else {
        demoOrg = await tx.organization.update({
          where: { id: demoOrg.id },
          data: {
            name: "Apex Coding Academy",
            slug: "apex-code",
            domain: "apex-code.echolms.com",
            ownerName: "Apex Academy Director",
            ownerEmail: "demo.academy@echo.in",
            subscription: "GROWTH",
            status: "ACTIVE"
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
        // Cascade delete billing for other orgs
        await tx.organizationEntitlementOverride.deleteMany({ where: { organizationId: { in: otherOrgIds } } })
        await tx.organizationUsageCounter.deleteMany({ where: { organizationId: { in: otherOrgIds } } })
        await tx.subscriptionPayment.deleteMany({ where: { organizationId: { in: otherOrgIds } } })
        await tx.subscriptionInvoice.deleteMany({ where: { organizationId: { in: otherOrgIds } } })
        await tx.subscriptionEvent.deleteMany({ where: { organizationId: { in: otherOrgIds } } })
        await tx.tenantSubscription.deleteMany({ where: { organizationId: { in: otherOrgIds } } })

        // Cascade delete LMS courses for other orgs
        const courses = await tx.course.findMany({ where: { organizationId: { in: otherOrgIds } }, select: { id: true } })
        const courseIds = courses.map(c => c.id)
        if (courseIds.length > 0) {
          const batches = await tx.batch.findMany({ where: { courseId: { in: courseIds } }, select: { id: true } })
          const batchIds = batches.map(b => b.id)
          if (batchIds.length > 0) {
            const enrollments = await tx.enrollment.findMany({ where: { batchId: { in: batchIds } }, select: { id: true } })
            const enrollmentIds = enrollments.map(e => e.id)
            if (enrollmentIds.length > 0) {
              await tx.feeInstallment.deleteMany({ where: { enrollmentId: { in: enrollmentIds } } })
              await tx.enrollment.deleteMany({ where: { id: { in: enrollmentIds } } })
            }
            await tx.batchSession.deleteMany({ where: { batchId: { in: batchIds } } })
            await tx.batch.deleteMany({ where: { id: { in: batchIds } } })
          }

          const lmsCourses = await tx.lMSCourse.findMany({ where: { courseId: { in: courseIds } }, select: { id: true } })
          const lmsCourseIds = lmsCourses.map(l => l.id)
          if (lmsCourseIds.length > 0) {
            const lmsModules = await tx.lMSModule.findMany({ where: { lmsCourseId: { in: lmsCourseIds } }, select: { id: true } })
            const moduleIds = lmsModules.map(m => m.id)
            if (moduleIds.length > 0) {
              await tx.lessonProgress.deleteMany({ where: { lesson: { moduleId: { in: moduleIds } } } })
              await tx.lMSLesson.deleteMany({ where: { moduleId: { in: moduleIds } } })
              await tx.lMSModule.deleteMany({ where: { id: { in: moduleIds } } })
            }
            await tx.lMSCourse.deleteMany({ where: { id: { in: lmsCourseIds } } })
          }

          await tx.certificate.deleteMany({ where: { courseId: { in: courseIds } } })
          await tx.quiz.deleteMany({ where: { courseId: { in: courseIds } } })
          await tx.course.deleteMany({ where: { id: { in: courseIds } } })
        }

        // Cascade delete CRM Leads for other orgs
        const leads = await tx.lead.findMany({ where: { organizationId: { in: otherOrgIds } }, select: { id: true } })
        const leadIds = leads.map(l => l.id)
        if (leadIds.length > 0) {
          await tx.callRecord.deleteMany({ where: { leadId: { in: leadIds } } })
          await tx.leadActivity.deleteMany({ where: { leadId: { in: leadIds } } })
          await tx.lead.deleteMany({ where: { id: { in: leadIds } } })
        }

        // Cascade delete other modules
        const forms = await tx.enquiryForm.findMany({ where: { organizationId: { in: otherOrgIds } }, select: { id: true } })
        const formIds = forms.map(f => f.id)
        if (formIds.length > 0) {
          await tx.formSubmission.deleteMany({ where: { formId: { in: formIds } } })
          await tx.enquiryForm.deleteMany({ where: { id: { in: formIds } } })
        }
        await tx.demoRegistration.deleteMany({ where: { demoSession: { organizationId: { in: otherOrgIds } } } })
        await tx.demoSession.deleteMany({ where: { organizationId: { in: otherOrgIds } } })
        await tx.walkIn.deleteMany({ where: { organizationId: { in: otherOrgIds } } })
        await tx.campusEvent.deleteMany({ where: { organizationId: { in: otherOrgIds } } })
        await tx.placementJob.deleteMany({ where: { company: { organizationId: { in: otherOrgIds } } } })
        await tx.placementCompany.deleteMany({ where: { organizationId: { in: otherOrgIds } } })
        await tx.academyProject.deleteMany({ where: { organizationId: { in: otherOrgIds } } })

        // Cascade delete users belonging strictly to other orgs (never delete SUPER_ADMIN)
        const otherUsers = await tx.user.findMany({
          where: {
            organizationId: { in: otherOrgIds },
            role: { not: "SUPER_ADMIN" }
          },
          select: { id: true }
        })
        const otherUserIds = otherUsers.map(u => u.id)
        if (otherUserIds.length > 0) {
          await tx.student.deleteMany({ where: { userId: { in: otherUserIds } } })
          await tx.educator.deleteMany({ where: { userId: { in: otherUserIds } } })
          await tx.employee.deleteMany({ where: { userId: { in: otherUserIds } } })
          await tx.auditLog.deleteMany({ where: { userId: { in: otherUserIds } } })
          await tx.session.deleteMany({ where: { userId: { in: otherUserIds } } })
          await tx.user.deleteMany({ where: { id: { in: otherUserIds } } })
        }

        // Delete all other organizations
        await tx.organization.deleteMany({
          where: { id: { in: otherOrgIds } }
        })
      }

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
