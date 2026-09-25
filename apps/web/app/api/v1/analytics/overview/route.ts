import { prisma } from  "@/lib/prisma"
import { NextResponse } from  "next/server"
import { auth } from  "@/auth"
import { getTenantFilter } from  "@/lib/tenant"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantFilter = await getTenantFilter()

    // 1. Total Students for this tenant
    const totalStudents = await prisma.user.count({
      where: {
        role: "STUDENT",
        ...(tenantFilter.organizationId ? { organizationId: tenantFilter.organizationId } : {})
      }
    })

    // 2. Total Courses for this tenant
    const activeCourses = await prisma.course.count({
      where: {
        isPublished: true,
        ...(tenantFilter.organizationId ? { organizationId: tenantFilter.organizationId } : {})
      }
    })

    // 3. Total Pending Courses awaiting approval for this tenant
    const pendingCourses = await prisma.course.findMany({
      where: {
        isPublished: false,
        ...(tenantFilter.organizationId ? { organizationId: tenantFilter.organizationId } : {})
      },
      select: {
        id: true,
        name: true,
        code: true,
        createdAt: true,
        lmsCourse: { select: { thumbnail: true } }
      }
    })

    // 4. Calculate Revenue for this tenant from fee installments
    const paidInstallments = await prisma.feeInstallment.aggregate({
      _sum: { paidAmount: true },
      where: tenantFilter.organizationId ? {
        enrollment: {
          student: {
            user: { organizationId: tenantFilter.organizationId }
          }
        }
      } : {}
    })

    const totalRevenue = paidInstallments._sum.paidAmount || 0

    // 5. Fetch Organization details for branding header
    let organizationName = "Echo LMS"
    const targetOrgId = (tenantFilter.organizationId && tenantFilter.organizationId !== '__NO_ACCESS__')
      ? tenantFilter.organizationId
      : session.user.organizationId

    if (targetOrgId) {
      const org = await prisma.organization.findUnique({
        where: { id: targetOrgId },
        select: { name: true }
      })
      if (org?.name) organizationName = org.name
    }

    return NextResponse.json({
      success: true,
      tenantId: targetOrgId || null,
      organizationName,
      metrics: {
        revenueCollected: totalRevenue,
        totalStudents,
        activeCourses,
        openTickets: 0
      },
      pendingCourses: pendingCourses.map(c => ({
        id: c.id,
        title: c.name,
        code: c.code,
        submittedAt: c.createdAt.toISOString()
      }))
    })
  } catch (error: any) {
    console.error("Error fetching analytics overview:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch analytics overview" }, { status: 500 })
  }
}
