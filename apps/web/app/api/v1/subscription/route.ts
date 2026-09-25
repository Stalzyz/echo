import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SubscriptionEntitlementService } from "@/lib/services/subscription-entitlement.service"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organizationId = session.user.organizationId
    if (!organizationId) {
      return NextResponse.json({ error: "No organization associated with this account" }, { status: 400 })
    }

    const sub = await SubscriptionEntitlementService.getOrganizationSubscription(organizationId)
    
    // Fetch live usage counters
    const studentsUsage = await SubscriptionEntitlementService.getUsage(organizationId, "students")
    const staffUsage = await SubscriptionEntitlementService.getUsage(organizationId, "staff")
    const coursesUsage = await SubscriptionEntitlementService.getUsage(organizationId, "courses")
    const batchesUsage = await SubscriptionEntitlementService.getUsage(organizationId, "batches")
    const whatsappUsage = await SubscriptionEntitlementService.getUsage(organizationId, "whatsapp_messages")
    const aiUsage = await SubscriptionEntitlementService.getUsage(organizationId, "ai_requests")
    const storageUsage = await SubscriptionEntitlementService.getUsage(organizationId, "storage_mb")

    // Fetch invoices
    const invoices = await prisma.subscriptionInvoice.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 20
    })

    // Fetch payments
    const payments = await prisma.subscriptionPayment.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 20
    })

    // Fetch audit events
    const auditEvents = await prisma.subscriptionEvent.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 10
    })

    // Fetch available plans for upgrade/downgrade selection
    const allPlans = await prisma.saaSPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    })

    return NextResponse.json({
      subscription: {
        id: sub.id,
        status: sub.status,
        billingCycle: sub.billingCycle,
        startDate: sub.startDate,
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        trialEnd: sub.trialEnd,
        gracePeriodEnd: sub.gracePeriodEnd,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        cancelledAt: sub.cancelledAt,
        suspendedAt: sub.suspendedAt,
        plan: sub.plan,
        provider: sub.provider
      },
      usage: {
        students: { current: studentsUsage, limit: sub.plan.maxStudents },
        staff: { current: staffUsage, limit: sub.plan.maxStaff },
        courses: { current: coursesUsage, limit: sub.plan.maxCourses },
        batches: { current: batchesUsage, limit: sub.plan.maxBatches },
        whatsapp: { current: whatsappUsage, limit: sub.plan.maxWhatsAppMessages },
        ai: { current: aiUsage, limit: sub.plan.maxAiRequests },
        storageGB: { current: Math.round(storageUsage / 1024), limit: sub.plan.maxStorageGB }
      },
      invoices,
      payments,
      auditEvents,
      availablePlans: allPlans
    })
  } catch (error: any) {
    console.error("Error loading tenant subscription:", error)
    return NextResponse.json({ error: error.message || "Failed to load subscription" }, { status: 500 })
  }
}
