import { prisma } from  "@/lib/prisma"
import { NextResponse } from  "next/server"
import { auth } from  "@/auth"
import { cookies } from  "next/headers"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'Super Admin'

    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 })
    }

    const body = await req.json()
    const academyId = body.academyId || body.organizationId
    if (!academyId) {
      return NextResponse.json({ error: "Academy ID or organizationId is required" }, { status: 400 })
    }

    const organization = await prisma.organization.findUnique({
      where: { id: academyId },
      include: {
        users: {
          where: { OR: [{ role: 'ADMIN' }, { role: 'MANAGER' }] }
        }
      }
    })

    if (!organization) {
      return NextResponse.json({ error: "Academy not found" }, { status: 404 })
    }

    const targetUser = organization.users[0] || await prisma.user.findFirst({
      where: { organizationId: academyId }
    })

    // IMPORTANT: We do NOT mutate the Super Admin's user.organizationId in the database.
    // Impersonation is purely cookie-driven (echo_impersonate_tenant).
    // Writing to the DB would corrupt the Super Admin's identity on next login.

    // Set HTTP cookie for tenant context — this is the ONLY mechanism for impersonation
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
