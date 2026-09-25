import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cookieStore = await cookies()
    const impersonatedTenantId = cookieStore.get("echo_impersonate_tenant")?.value
    const isSuperAdmin = session.user.role === "SUPER_ADMIN" || session.user.role === "Super Admin"
    const tenantId = isSuperAdmin
      ? (impersonatedTenantId || session.user.organizationId || null)
      : (session.user.organizationId || null)

    const body = await req.json()
    const {
      courseName,
      courseCode,
      courseDuration,
      courseFee,
      batchName,
      batchType,
      startDate,
      endDate,
      capacity,
      educatorId
    } = body

    if (!courseName || !courseCode) {
      return NextResponse.json({ error: "Course name and course code are required." }, { status: 400 })
    }

    if (tenantId) {
      const { SubscriptionEntitlementService } = await import("@/lib/services/subscription-entitlement.service")
      await SubscriptionEntitlementService.assertWithinLimit(tenantId, "courses", 1)
      await SubscriptionEntitlementService.assertWithinLimit(tenantId, "batches", 1)
    }

    const feeNum = typeof courseFee === "number" ? courseFee : parseFloat(courseFee) || 0
    const capNum = typeof capacity === "number" ? capacity : parseInt(capacity, 10) || 20

    const start = startDate ? new Date(startDate) : new Date()
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    const validStart = isNaN(start.getTime()) ? new Date() : start
    const validEnd = isNaN(end.getTime()) ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : end

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create or find base Course scoped to tenant
      let course = await tx.course.findFirst({
        where: {
          code: courseCode,
          organizationId: tenantId || null,
        }
      })

      if (!course) {
        course = await tx.course.create({
          data: {
            name: courseName,
            code: courseCode,
            duration: courseDuration || "3 Months",
            fee: feeNum,
            isPublished: true,
            organizationId: tenantId || null,
          }
        })
      }

      // 2. Ensure LMS Course exists for curriculum builder & catalog
      const existingLms = await tx.lMSCourse.findUnique({
        where: { courseId: course.id }
      })
      if (!existingLms) {
        await tx.lMSCourse.create({
          data: {
            courseId: course.id,
            isPublished: true,
            draftStatus: "PUBLISHED",
          }
        })
      }

      // 3. Create initial Batch
      const name = batchName?.trim() || `${courseName} - Batch 1`
      const batch = await tx.batch.create({
        data: {
          courseId: course.id,
          name,
          type: batchType || "MORNING",
          startDate: validStart,
          endDate: validEnd,
          capacity: capNum,
          educatorId: educatorId || undefined,
          organizationId: tenantId || null,
        },
        include: {
          course: { select: { name: true, code: true } },
          educator: { select: { user: { select: { firstName: true, lastName: true, email: true } } } },
          _count: { select: { enrollments: true, sessions: true } },
        }
      })

      return batch
    })

    return NextResponse.json(result, { status: 201 })
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({
        error: "BadRequest",
        message: "A course with this code already exists in your academy."
      }, { status: 400 })
    }
    console.error("Error creating course with batch:", err)
    return NextResponse.json({
      error: "InternalServerError",
      message: err.message || "Failed to create course and batch"
    }, { status: 500 })
  }
}
