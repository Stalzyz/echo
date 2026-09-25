import { NextRequest, NextResponse } from  "next/server"
import { prisma } from  "@/lib/prisma"
import { auth } from  "../../../../../../auth"

// POST /api/v1/calls/[id]/sync-crm - 1-Click Sync Call Intel to CRM
export async function POST(
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
        intelligence: true
      }
    })

    if (!callRecord || !callRecord.leadId) {
      return NextResponse.json({ error: "Call record or linked lead not found" }, { status: 404 })
    }

    const intel = callRecord.intelligence
    if (!intel) {
      return NextResponse.json({ error: "Call intelligence not generated yet. Analyze call first." }, { status: 400 })
    }

    const reqData = (intel.requirements as any) || {}
    const objData = (intel.objections as any) || []

    // Map AI temperature & intent to CRM LeadStatus
    let newLeadStatus: any = callRecord.lead?.status || "INTERESTED"
    if (intel.temperature === "HOT") {
      newLeadStatus = "INTERESTED"
    } else if (intel.intent === "HIGH_INTENT_ADMISSION") {
      newLeadStatus = "QUALIFIED"
    } else if (intel.temperature === "COLD" || intel.intent === "NOT_INTERESTED") {
      newLeadStatus = "DISQUALIFIED"
    }

    // Update Lead in DB
    const updatedLead = await prisma.lead.update({
      where: { id: callRecord.leadId },
      data: {
        status: newLeadStatus,
        score: intel.score,
        courseInterest: reqData.course || callRecord.lead?.courseInterest,
        notes: `AI Call Intel (${new Date().toLocaleDateString()}): ${intel.summary}\nObjections: ${objData.join(", ")}`
      }
    })

    // Add LeadActivity log
    await prisma.leadActivity.create({
      data: {
        leadId: callRecord.leadId,
        type: "NOTE",
        content: `🤖 AI Call Intel Sync: Status set to ${newLeadStatus}, Lead Score updated to ${intel.score}/100. Course: ${reqData.course || "N/A"}. Key Objections: ${objData.join(", ")}`,
        userId: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      message: "Lead successfully updated in CRM from Call Intelligence",
      data: updatedLead
    })
  } catch (error: any) {
    console.error("Error syncing call intel to CRM:", error)
    return NextResponse.json({ error: error.message || "Failed to sync to CRM" }, { status: 500 })
  }
}
