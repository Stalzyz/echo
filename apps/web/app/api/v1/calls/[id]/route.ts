import { NextRequest, NextResponse } from  "next/server"
import { prisma } from  "@/lib/prisma"
import { auth } from  "../../../../../auth"

// GET /api/v1/calls/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const callRecord = await prisma.callRecord.findUnique({
      where: { id },
      include: {
        lead: true,
        counsellor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true
          }
        },
        intelligence: true
      }
    })

    if (!callRecord) {
      return NextResponse.json({ error: "Call record not found" }, { status: 404 })
    }

    return NextResponse.json({ data: callRecord })
  } catch (error: any) {
    console.error("Error fetching call:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch call" }, { status: 500 })
  }
}

// DELETE /api/v1/calls/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.callRecord.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting call record:", error)
    return NextResponse.json({ error: error.message || "Failed to delete call record" }, { status: 500 })
  }
}
