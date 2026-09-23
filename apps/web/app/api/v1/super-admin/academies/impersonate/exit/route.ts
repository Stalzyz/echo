import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Reset Super Admin organizationId to null in DB
    await prisma.user.update({
      where: { id: session.user.id },
      data: { organizationId: null }
    })

    // Clear impersonation cookie
    const cookieStore = await cookies()
    cookieStore.delete("echo_impersonate_tenant")

    return NextResponse.json({
      success: true,
      message: "Exited tenant impersonation mode. Returned to Super Admin global view."
    })
  } catch (error: any) {
    console.error("Error exiting impersonation:", error)
    return NextResponse.json({ error: error.message || "Failed to exit impersonation" }, { status: 500 })
  }
}
