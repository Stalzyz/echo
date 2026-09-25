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

    const dbUsers = await prisma.user.findMany({
      include: {
        organization: {
          select: { id: true, name: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const users = dbUsers.map(u => ({
      id: u.id,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email.split('@')[0],
      email: u.email,
      phone: u.phone || 'N/A',
      role: u.role,
      academy: u.organization?.name || 'Platform Super Admin',
      status: u.status || 'ACTIVE',
      createdAt: u.createdAt.toISOString()
    }))

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error("Error fetching super admin users:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 })
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
    const { userId, status, role } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(status && { status }),
        ...(role && { role })
      }
    })

    return NextResponse.json({ success: true, user: updated })
  } catch (error: any) {
    console.error("Error updating user status:", error)
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 })
  }
}
