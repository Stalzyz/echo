import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { status } = await req.json()
    if (!['ACTIVE', 'SUSPENDED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    const updatedOrg = await prisma.organization.update({
      where: { id: params.id },
      data: { status }
    })

    return NextResponse.json({
      success: true,
      message: `Academy '${updatedOrg.name}' status updated to ${status}`,
      organization: updatedOrg
    })
  } catch (error: any) {
    console.error("Error updating academy status:", error)
    return NextResponse.json({ error: error.message || "Failed to update academy status" }, { status: 500 })
  }
}
