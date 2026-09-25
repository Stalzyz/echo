import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SubscriptionEntitlementService } from "@/lib/services/subscription-entitlement.service"
import { SubscriptionStatus } from "@grekam/db"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organizationId = session.user.organizationId
    const body = await req.json().catch(() => ({}))
    const { cancelImmediately = false, reason = "Cancelled by user" } = body

    const sub = await SubscriptionEntitlementService.getOrganizationSubscription(organizationId)
    const now = new Date()

    if (cancelImmediately) {
      const updated = await prisma.$transaction(async (tx) => {
        const s = await tx.tenantSubscription.update({
          where: { id: sub.id },
          data: {
            status: SubscriptionStatus.CANCELLED,
            cancelledAt: now,
            cancelAtPeriodEnd: false,
            updatedAt: now
          }
        })
        await tx.subscriptionEvent.create({
          data: {
            subscriptionId: sub.id,
            organizationId,
            eventType: "CANCELLED_IMMEDIATE",
            fromStatus: sub.status,
            toStatus: SubscriptionStatus.CANCELLED,
            reason,
            source: "VENDOR",
            actorId: session.user.id
          }
        })
        return s
      })
      return NextResponse.json({ success: true, message: "Subscription cancelled immediately.", subscription: updated })
    }

    // Default: Cancel at period end so customer keeps their paid access until currentPeriodEnd
    const updated = await prisma.$transaction(async (tx) => {
      const s = await tx.tenantSubscription.update({
        where: { id: sub.id },
        data: {
          cancelAtPeriodEnd: true,
          cancelledAt: now,
          updatedAt: now
        }
      })
      await tx.subscriptionEvent.create({
        data: {
          subscriptionId: sub.id,
          organizationId,
          eventType: "SCHEDULED_CANCELLATION",
          fromStatus: sub.status,
          toStatus: sub.status,
          reason: `${reason}. Access remains active until ${sub.currentPeriodEnd.toISOString().split('T')[0]}.`,
          source: "VENDOR",
          actorId: session.user.id
        }
      })
      return s
    })

    return NextResponse.json({ 
      success: true, 
      message: `Subscription scheduled for cancellation on ${sub.currentPeriodEnd.toISOString().split('T')[0]}. You retain full access until then.`, 
      subscription: updated 
    })
  } catch (error: any) {
    console.error("Error cancelling subscription:", error)
    return NextResponse.json({ error: error.message || "Failed to cancel subscription" }, { status: 500 })
  }
}
