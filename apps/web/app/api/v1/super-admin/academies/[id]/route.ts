import { prisma } from  "@/lib/prisma"
import { NextResponse } from  "next/server"
import { auth } from  "@/auth"

// DELETE /api/v1/super-admin/academies/[id] - Permanently delete an academy vendor with full cascade
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'Super Admin' || session?.user?.impersonatedBySuperAdmin

    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized. Super Admin privileges required." }, { status: 403 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Academy ID is required" }, { status: 400 })
    }

    const org = await prisma.organization.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, role: true } }
      }
    })

    if (!org) {
      return NextResponse.json({ error: "Academy not found" }, { status: 404 })
    }

    // Atomic cascade deletion of all related tenant resources
    await prisma.$transaction(async (tx) => {
      // 1. Delete SaaS Billing, Invoices, Payments, Events & Overrides
      await tx.organizationEntitlementOverride.deleteMany({ where: { organizationId: id } })
      await tx.organizationUsageCounter.deleteMany({ where: { organizationId: id } })
      await tx.subscriptionPayment.deleteMany({ where: { organizationId: id } })
      await tx.subscriptionInvoice.deleteMany({ where: { organizationId: id } })
      await tx.subscriptionEvent.deleteMany({ where: { organizationId: id } })
      await tx.tenantSubscription.deleteMany({ where: { organizationId: id } })

      // 2. Delete LMS data (Enrollments, Batches, Lessons, Modules, Courses)
      const courses = await tx.course.findMany({ where: { organizationId: id }, select: { id: true } })
      const courseIds = courses.map(c => c.id)

      if (courseIds.length > 0) {
        // Delete batch enrollments, installments & sessions
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

        // Delete LMS course hierarchy
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

      // 3. Delete CRM Leads & Activities
      const leads = await tx.lead.findMany({ where: { organizationId: id }, select: { id: true } })
      const leadIds = leads.map(l => l.id)
      if (leadIds.length > 0) {
        await tx.callRecord.deleteMany({ where: { leadId: { in: leadIds } } })
        await tx.leadActivity.deleteMany({ where: { leadId: { in: leadIds } } })
        await tx.lead.deleteMany({ where: { id: { in: leadIds } } })
      }

      // 4. Delete Walk-Ins, Demo Sessions, Forms & Submissions
      const forms = await tx.enquiryForm.findMany({ where: { organizationId: id }, select: { id: true } })
      const formIds = forms.map(f => f.id)
      if (formIds.length > 0) {
        await tx.formSubmission.deleteMany({ where: { formId: { in: formIds } } })
        await tx.enquiryForm.deleteMany({ where: { id: { in: formIds } } })
      }
      await tx.demoRegistration.deleteMany({ where: { demoSession: { organizationId: id } } })
      await tx.demoSession.deleteMany({ where: { organizationId: id } })
      await tx.walkIn.deleteMany({ where: { organizationId: id } })

      // 5. Delete Campus Events, Placement Jobs & Projects
      await tx.campusEvent.deleteMany({ where: { organizationId: id } })
      await tx.placementJob.deleteMany({ where: { company: { organizationId: id } } })
      await tx.placementCompany.deleteMany({ where: { organizationId: id } })
      await tx.academyProject.deleteMany({ where: { organizationId: id } })

      // 6. Delete Organization Users (Students, Educators, Staff, Admins)
      const userIds = org.users.map(u => u.id)
      if (userIds.length > 0) {
        await tx.student.deleteMany({ where: { userId: { in: userIds } } })
        await tx.educator.deleteMany({ where: { userId: { in: userIds } } })
        await tx.employee.deleteMany({ where: { userId: { in: userIds } } })
        await tx.auditLog.deleteMany({ where: { userId: { in: userIds } } })
        await tx.session.deleteMany({ where: { userId: { in: userIds } } })
        await tx.user.deleteMany({ where: { id: { in: userIds } } })
      }

      // 7. Delete the Organization record
      await tx.organization.delete({
        where: { id }
      })
    })

    return NextResponse.json({
      success: true,
      message: `Academy '${org.name}' and all associated data deleted permanently.`
    })
  } catch (error: any) {
    console.error("Error deleting academy permanently:", error)
    return NextResponse.json({ error: error.message || "Failed to delete academy" }, { status: 500 })
  }
}
