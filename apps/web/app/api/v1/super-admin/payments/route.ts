import { prisma } from  "@/lib/prisma"
import { NextResponse } from  "next/server"
import { auth } from  "@/auth"

export async function GET() {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'Super Admin' || session?.user?.impersonatedBySuperAdmin

    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 })
    }

    const dbInstallments = await prisma.feeInstallment.findMany({
      take: 50,
      include: {
        enrollment: {
          include: {
            student: {
              include: {
                user: {
                  include: {
                    organization: {
                      select: { name: true, slug: true }
                    }
                  }
                }
              }
            },
            batch: {
              include: {
                course: { select: { name: true } }
              }
            }
          }
        }
      },
      orderBy: { dueDate: 'desc' }
    })

    const payments = dbInstallments.map(inst => ({
      id: inst.id,
      academyName: inst.enrollment?.student?.user?.organization?.name || 'Academy',
      studentName: inst.enrollment?.student?.user ? `${inst.enrollment.student.user.firstName} ${inst.enrollment.student.user.lastName}` : 'Student',
      courseName: inst.enrollment?.batch?.course?.name || 'Course',
      amount: inst.amount,
      paidAmount: inst.paidAmount,
      paymentStatus: inst.status,
      dueDate: inst.dueDate.toISOString().split('T')[0],
      paymentGateway: 'Razorpay / UPI'
    }))

    return NextResponse.json({ payments })
  } catch (error: any) {
    console.error("Error fetching super admin payments:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch payments" }, { status: 500 })
  }
}
