import { NextResponse } from  "next/server"
import { auth } from  "@/auth"
import { cookies } from  "next/headers"

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Clear impersonation cookie ONLY.
    // We do NOT touch user.organizationId in the database —
    // the Super Admin's record must remain with organizationId=null at all times.
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
