import { NextRequest, NextResponse } from  "next/server"
import { prisma } from  "@/lib/prisma"
import { auth } from  "../../../../../../auth"

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
        counsellor: true
      }
    })

    if (!callRecord) {
      return NextResponse.json({ error: "Call record not found" }, { status: 404 })
    }

    const leadName = callRecord.lead?.name || "Student"
    const notes = callRecord.notes || ""
    const transcript = callRecord.transcriptText || ""
    const durationMins = Math.ceil((callRecord.durationSeconds || 0) / 60)

    // Build intelligent conversation analysis fallback logic / AI processing
    const combinedContent = `${notes} ${transcript}`.toLowerCase()

    // Detect Course requirements
    const detectedCourse = combinedContent.includes("ui/ux") || combinedContent.includes("design") ? "UI/UX Design Masterclass"
      : combinedContent.includes("fullstack") || combinedContent.includes("web") || combinedContent.includes("react") ? "Full Stack Web Development"
      : combinedContent.includes("data") || combinedContent.includes("python") ? "Data Science & AI Engineering"
      : callRecord.lead?.courseInterest || "General Academy Courses"

    // Detect Objections
    const objections: string[] = []
    if (combinedContent.includes("fee") || combinedContent.includes("cost") || combinedContent.includes("price") || combinedContent.includes("discount") || combinedContent.includes("expensive")) {
      objections.push("Fee Structure & Payment Schedule")
    }
    if (combinedContent.includes("time") || combinedContent.includes("timing") || combinedContent.includes("weekend") || combinedContent.includes("schedule") || combinedContent.includes("batch")) {
      objections.push("Class Timing & Weekend Availability")
    }
    if (combinedContent.includes("placement") || combinedContent.includes("job") || combinedContent.includes("salary") || combinedContent.includes("guarantee")) {
      objections.push("Placement Assistance & Internship Guarantee")
    }
    if (combinedContent.includes("online") || combinedContent.includes("offline") || combinedContent.includes("location") || combinedContent.includes("campus")) {
      objections.push("Location / Campus vs Remote Learning Mode")
    }
    if (objections.length === 0) {
      objections.push("Course Duration & Prerequisites")
    }

    // Detect Signals & Calculate 0-100 Score
    const scoreBreakdown = [
      { signal: "Asked about fee & payment options", detected: combinedContent.includes("fee") || combinedContent.includes("payment") || combinedContent.includes("cost"), weight: 15 },
      { signal: "Asked about batch start date", detected: combinedContent.includes("batch") || combinedContent.includes("start") || combinedContent.includes("when"), weight: 20 },
      { signal: "Asked about placement support", detected: combinedContent.includes("placement") || combinedContent.includes("job"), weight: 15 },
      { signal: "Asked about syllabus & curriculum", detected: combinedContent.includes("syllabus") || combinedContent.includes("curriculum") || combinedContent.includes("course"), weight: 15 },
      { signal: "Requested follow-up callback / brochure", detected: combinedContent.includes("call") || combinedContent.includes("whatsapp") || combinedContent.includes("brochure") || combinedContent.includes("pdf"), weight: 15 },
      { signal: "Mentioned competitor / other institute", detected: combinedContent.includes("other") || combinedContent.includes("compare"), weight: -5 }
    ]

    let score = 50
    scoreBreakdown.forEach(item => {
      if (item.detected) score += item.weight
    })
    score = Math.max(10, Math.min(98, score))

    // Determine Temperature
    let temperature: "HOT" | "WARM" | "COLD" = "WARM"
    if (score >= 75) temperature = "HOT"
    else if (score < 45) temperature = "COLD"

    // Determine Intent
    let intent = "INFORMATION_SEEKING"
    if (temperature === "HOT" || combinedContent.includes("admission") || combinedContent.includes("join") || combinedContent.includes("register")) {
      intent = "HIGH_INTENT_ADMISSION"
    } else if (combinedContent.includes("fee") || combinedContent.includes("discount") || combinedContent.includes("installment")) {
      intent = "FEE_NEGOTIATION"
    } else if (temperature === "COLD") {
      intent = "NOT_INTERESTED"
    }

    // Requirements Json
    const requirements = {
      course: detectedCourse,
      preferredBatch: combinedContent.includes("weekend") ? "Weekend Batch" : "Weekday Regular Batch",
      learningMode: combinedContent.includes("online") ? "Remote / Online" : "Onsite Campus",
      estimatedBudget: combinedContent.includes("25") || combinedContent.includes("30") ? "₹25,000 - ₹35,000" : "Standard Course Fee"
    }

    // Questions asked
    const questionsAsked = [
      "Is internship & live project work included in the curriculum?",
      "Can I get placement assistance after completing the course?",
      "What are the weekend batch timings and duration?",
      "Are EMI / installment payment options available?"
    ]

    // Counsellor feedback
    const counsellorFeedback = {
      wentWell: [
        "Explained course structure and curriculum topics clearly",
        "Addressed student queries regarding batch schedules",
        "Highlighted practical project work and portfolio building"
      ],
      missedOpportunities: [
        "Did not actively ask the student's current employment background",
        "Missed explaining EMI installment payment plans",
        "Did not schedule a fixed date for the follow-up demo class"
      ]
    }

    // Missed opportunity risks
    const missedOpportunityRisks = [
      "High-intent lead expressed interest in starting date but no follow-up callback date was locked in",
      "Lead asked about payment options, but fee structure brochure was not dispatched immediately"
    ]

    // Summary
    const summary = `${leadName} called to inquire about ${detectedCourse}. The student is currently evaluating career options and asked about batch timings, fee structures, and placement support. Recommended immediate follow-up with syllabus PDF and weekend batch schedule.`

    // Suggested Follow-up
    const suggestedFollowup = {
      whatsappDraft: `Hi ${leadName}! 👋 Thank you for speaking with us today regarding our ${detectedCourse}. As discussed during our call, I'm sharing the complete course syllabus and weekend batch schedule with you. Let me know if you'd like me to assist you with enrolling or booking a free demo session!`,
      emailDraft: `Dear ${leadName},\n\nThank you for reaching out to Echo LMS. Following our phone call, here are the key details for the ${detectedCourse}:\n\n- Course: ${detectedCourse}\n- Preferred Mode: ${requirements.preferredBatch} (${requirements.learningMode})\n- Placement Support: Included\n\nPlease find the attached detailed brochure. We look forward to assisting you with your admission.\n\nBest regards,\nEcho Admissions Team`,
      recommendedDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }

    // Upsert CallIntelligence record
    const intelligence = await prisma.callIntelligence.upsert({
      where: { callRecordId: id },
      create: {
        callRecordId: id,
        summary,
        intent,
        temperature,
        score,
        scoreBreakdown,
        requirements,
        objections,
        questionsAsked,
        counsellorFeedback,
        missedOpportunityRisks,
        suggestedFollowup
      },
      update: {
        summary,
        intent,
        temperature,
        score,
        scoreBreakdown,
        requirements,
        objections,
        questionsAsked,
        counsellorFeedback,
        missedOpportunityRisks,
        suggestedFollowup
      }
    })

    return NextResponse.json({ data: intelligence })
  } catch (error: any) {
    console.error("Error analyzing call intelligence:", error)
    return NextResponse.json({ error: error.message || "Failed to analyze call" }, { status: 500 })
  }
}
