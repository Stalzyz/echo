import { NextRequest, NextResponse } from  "next/server"
import { prisma } from  "@/lib/prisma"
import { auth } from  "../../../../../auth"

// GET /api/v1/calls/search?q=placement
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") || searchParams.get("query") || ""

    if (!query.trim()) {
      return NextResponse.json({ data: [], total: 0 })
    }

    const calls = await prisma.callRecord.findMany({
      where: {
        OR: [
          { transcriptText: { contains: query, mode: "insensitive" } },
          { notes: { contains: query, mode: "insensitive" } }
        ]
      },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            courseInterest: true
          }
        },
        counsellor: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        intelligence: true
      },
      orderBy: { startedAt: "desc" },
      take: 50
    })

    // Extract matching snippets around the query term
    const results = calls.map(call => {
      const text = call.transcriptText || call.notes || ""
      const lowerText = text.toLowerCase()
      const lowerQuery = query.toLowerCase()
      const index = lowerText.indexOf(lowerQuery)
      
      let snippet = text
      if (index !== -1) {
        const start = Math.max(0, index - 60)
        const end = Math.min(text.length, index + lowerQuery.length + 60)
        snippet = (start > 0 ? "..." : "") + text.substring(start, end) + (end < text.length ? "..." : "")
      }

      return {
        id: call.id,
        startedAt: call.startedAt,
        durationSeconds: call.durationSeconds,
        lead: call.lead,
        counsellor: call.counsellor,
        temperature: call.intelligence?.temperature || "WARM",
        matchedTerm: query,
        snippet,
        recordingUrl: call.recordingUrl
      }
    })

    return NextResponse.json({ data: results, total: results.length })
  } catch (error: any) {
    console.error("Error searching calls:", error)
    return NextResponse.json({ error: error.message || "Failed to search calls" }, { status: 500 })
  }
}
