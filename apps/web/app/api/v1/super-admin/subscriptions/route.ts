import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'Super Admin' || session?.user?.impersonatedBySuperAdmin

    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 })
    }

    const orgs = await prisma.organization.findMany({
      include: {
        users: {
          select: { id: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const subscriptions = orgs.map(org => {
      const studentCount = org.users.filter(u => u.role === 'STUDENT').length
      let mrr = 2499
      if (org.subscription === 'ENTERPRISE') mrr = 6999
      else if (org.subscription === 'GROWTH' || org.subscription === 'PRO') mrr = 2999
      else if (org.subscription === 'STARTER') mrr = 1499

      return {
        id: `sub-${org.id}`,
        academyId: org.id,
        academyName: org.name,
        slug: org.slug,
        ownerEmail: org.ownerEmail || 'N/A',
        plan: org.subscription || 'GROWTH',
        status: org.status || 'ACTIVE',
        billingCycle: 'Yearly Billed',
        mrr: `₹${mrr.toLocaleString()}`,
        students: studentCount,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: org.createdAt.toISOString()
      }
    })

    return NextResponse.json({ subscriptions })
  } catch (error: any) {
    console.error("Error fetching super admin subscriptions:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch subscriptions" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'Super Admin' || session?.user?.impersonatedBySuperAdmin

    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { academyId, subscription, status } = body

    if (!academyId) {
      return NextResponse.json({ error: "Academy ID is required" }, { status: 400 })
    }

    const updatedOrg = await prisma.organization.update({
      where: { id: academyId },
      data: {
        ...(subscription && { subscription }),
        ...(status && { status })
      }
    })

    return NextResponse.json({ success: true, organization: updatedOrg })
  } catch (error: any) {
    console.error("Error updating subscription:", error)
    return NextResponse.json({ error: error.message || "Failed to update subscription" }, { status: 500 })
  }
}
