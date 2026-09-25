import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SubscriptionEntitlementService } from "@/lib/services/subscription-entitlement.service"
import { SubscriptionStatus } from "@grekam/db"

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organizationId = session.user.organizationId
    const sub = await SubscriptionEntitlementService.getOrganizationSubscription(organizationId)
    const now = new Date()

    const updated = await prisma.$transaction(async (tx) => {
      const s = await tx.tenantSubscription.update({
        where: { id: sub.id },
        data: {
          cancelAtPeriodEnd: false,
          cancelledAt: null,
          status: SubscriptionStatus.ACTIVE,
          updatedAt: now
        },
        include: { plan: true }
      })

      await tx.subscriptionEvent.create({
        data: {
          subscriptionId: sub.id,
          organizationId,
          eventType: "REACTIVATED",
          fromStatus: sub.status,
          toStatus: SubscriptionStatus.ACTIVE,
          reason: "Pending cancellation reversed by user. Subscription resumed.",
          source: "VENDOR",
          actorId: session.user.id
        }
      })

      return s
    })

    return NextResponse.json({ success: true, message: "Subscription resumed successfully!", subscription: updated })
  } catch (error: any) {
    console.error("Error resuming subscription:", error)
    return NextResponse.json({ error: error.message || "Failed to resume subscription" }, { status: 500 })
  }
}
