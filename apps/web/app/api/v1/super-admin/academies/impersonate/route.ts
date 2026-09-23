import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'Super Admin'

    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 })
    }

    const { academyId } = await req.json()
    if (!academyId) {
      return NextResponse.json({ error: "Academy ID is required" }, { status: 400 })
    }

    const organization = await prisma.organization.findUnique({
      where: { id: academyId },
      include: {
        users: {
          where: { role: 'ADMIN' }
        }
      }
    })

    if (!organization) {
      return NextResponse.json({ error: "Academy not found" }, { status: 404 })
    }

    const targetUser = organization.users[0] || await prisma.user.findFirst({
      where: { organizationId: academyId }
    })

    // Update Super Admin user's active organizationId in database for persistence
    await prisma.user.update({
      where: { id: session.user.id },
      data: { organizationId: organization.id }
    })

    // Set HTTP cookie for tenant context
    const cookieStore = await cookies()
    cookieStore.set("echo_impersonate_tenant", organization.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return NextResponse.json({
      success: true,
      message: `Impersonating Admin of ${organization.name}`,
      impersonatedUser: targetUser ? {
        id: targetUser.id,
        email: targetUser.email,
        name: `${targetUser.firstName} ${targetUser.lastName}`,
        role: targetUser.role
      } : null,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug
      },
      originalSuperAdmin: {
        id: session.user.id,
        email: session.user.email
      }
    })
  } catch (error: any) {
    console.error("Error impersonating academy:", error)
    return NextResponse.json({ error: error.message || "Failed to impersonate academy" }, { status: 500 })
  }
}
