import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "../../../../auth"
import { SubscriptionEntitlementService } from "@/lib/services/subscription-entitlement.service"

// GET /api/v1/calls - List call records with filters
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const leadId = searchParams.get("leadId")
    const counsellorId = searchParams.get("counsellorId")
    const status = searchParams.get("status")
    const temperature = searchParams.get("temperature")
    const search = searchParams.get("search")

    const where: any = {}
    if (leadId) where.leadId = leadId
    if (counsellorId) where.counsellorId = counsellorId
    if (status) where.status = status
    if (temperature) {
      where.intelligence = {
        temperature: temperature
      }
    }
    if (search) {
      where.OR = [
        { notes: { contains: search, mode: "insensitive" } },
        { transcriptText: { contains: search, mode: "insensitive" } },
        { lead: { name: { contains: search, mode: "insensitive" } } },
        { lead: { phone: { contains: search, mode: "insensitive" } } }
      ]
    }

    const calls = await prisma.callRecord.findMany({
      where,
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
            courseInterest: true
          }
        },
        counsellor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        },
        intelligence: true
      },
      orderBy: { startedAt: "desc" }
    })

    return NextResponse.json({ data: calls })
  } catch (error: any) {
    console.error("Error fetching calls:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch calls" }, { status: 500 })
  }
}

// POST /api/v1/calls - Create/log a call record
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      leadId,
      direction = "OUTBOUND",
      status = "CONNECTED",
      durationSeconds = 0,
      recordingUrl,
      notes,
      transcriptText,
      consentGiven = true
    } = body

    // Server-Side Subscription Entitlement Guard
    if (session.user.organizationId && session.user.role !== "SUPER_ADMIN") {
      await SubscriptionEntitlementService.assertEntitlement(session.user.organizationId, "callIntelligence")
      const minutesToConsume = Math.ceil(Number(durationSeconds || 60) / 60)
      await SubscriptionEntitlementService.assertWithinLimit(session.user.organizationId, "call_minutes", minutesToConsume)
      await SubscriptionEntitlementService.incrementUsage(session.user.organizationId, "call_minutes", minutesToConsume)
    }

    // Create call record
    const callRecord = await prisma.callRecord.create({
      data: {
        leadId: leadId || null,
        counsellorId: session.user.id,
        direction,
        status,
        durationSeconds: Number(durationSeconds),
        startedAt: new Date(),
        recordingUrl: recordingUrl || null,
        consentGiven: Boolean(consentGiven),
        transcriptText: transcriptText || null,
        notes: notes || null
      },
      include: {
        lead: true,
        counsellor: true
      }
    })

    // Also record lead activity if linked to lead
    if (leadId) {
      await prisma.leadActivity.create({
        data: {
          leadId,
          type: "CALL",
          content: `Call (${direction.toLowerCase()}, ${status.toLowerCase()}): ${durationSeconds}s. Notes: ${notes || "No notes"}`,
          userId: session.user.id
        }
      })
    }

    return NextResponse.json({ data: callRecord }, { status: 201 })
  } catch (error: any) {
    console.error("Error logging call:", error)
    return NextResponse.json({ error: error.message || "Failed to log call" }, { status: 500 })
  }
}
