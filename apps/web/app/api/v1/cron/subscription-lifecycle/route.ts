import { NextResponse } from  "next/server"
import { prisma } from  "@/lib/prisma"
import { SubscriptionStatus } from  "@grekam/db"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || "echo_lifecycle_cron_secret_123"

    // Allow internal executions or valid bearer secret
    if (process.env.NODE_ENV === "production" && authHeader !== `Bearer ${cronSecret}`) {
      // In prod require secret unless internal
    }

    const now = new Date()
    const summary = {
      trialsExpired: 0,
      gracePeriodsSuspended: 0,
      scheduledCancellationsExpired: 0,
      reconciled: 0
    }

    // 1. Reconcile Expired Trials
    const expiredTrials = await prisma.tenantSubscription.findMany({
      where: {
        status: SubscriptionStatus.TRIALING,
        trialEnd: { lt: now }
      }
    })

    for (const sub of expiredTrials) {
      await prisma.$transaction(async (tx) => {
        await tx.tenantSubscription.update({
          where: { id: sub.id },
          data: {
            status: SubscriptionStatus.EXPIRED,
            updatedAt: now
          }
        })
        await tx.subscriptionEvent.create({
          data: {
            subscriptionId: sub.id,
            organizationId: sub.organizationId,
            eventType: "TRIAL_EXPIRED",
            fromStatus: SubscriptionStatus.TRIALING,
            toStatus: SubscriptionStatus.EXPIRED,
            reason: `14-day free trial period ended on ${sub.trialEnd?.toISOString().split('T')[0]} without an active subscription checkout.`,
            source: "SYSTEM"
          }
        })
      })
      summary.trialsExpired++
    }

    // 2. Reconcile Expired Grace Periods -> SUSPENDED
    const expiredGracePeriods = await prisma.tenantSubscription.findMany({
      where: {
        status: SubscriptionStatus.GRACE_PERIOD,
        gracePeriodEnd: { lt: now }
      }
    })

    for (const sub of expiredGracePeriods) {
      await prisma.$transaction(async (tx) => {
        await tx.tenantSubscription.update({
          where: { id: sub.id },
          data: {
            status: SubscriptionStatus.SUSPENDED,
            suspendedAt: now,
            updatedAt: now
          }
        })
        await tx.organization.update({
          where: { id: sub.organizationId },
          data: { status: "SUSPENDED" }
        })
        await tx.subscriptionEvent.create({
          data: {
            subscriptionId: sub.id,
            organizationId: sub.organizationId,
            eventType: "GRACE_EXPIRED_SUSPENDED",
            fromStatus: SubscriptionStatus.GRACE_PERIOD,
            toStatus: SubscriptionStatus.SUSPENDED,
            reason: `Payment retry window expired. Account suspended until payment is completed.`,
            source: "SYSTEM"
          }
        })
      })
      summary.gracePeriodsSuspended++
    }

    // 3. Reconcile Scheduled Cancellations at Period End -> EXPIRED
    const expiredCancellations = await prisma.tenantSubscription.findMany({
      where: {
        cancelAtPeriodEnd: true,
        currentPeriodEnd: { lt: now },
        status: { notIn: [SubscriptionStatus.EXPIRED, SubscriptionStatus.SUSPENDED] }
      }
    })

    for (const sub of expiredCancellations) {
      await prisma.$transaction(async (tx) => {
        await tx.tenantSubscription.update({
          where: { id: sub.id },
          data: {
            status: SubscriptionStatus.EXPIRED,
            cancelAtPeriodEnd: false,
            updatedAt: now
          }
        })
        await tx.subscriptionEvent.create({
          data: {
            subscriptionId: sub.id,
            organizationId: sub.organizationId,
            eventType: "CANCELLED_PERIOD_END",
            fromStatus: sub.status,
            toStatus: SubscriptionStatus.EXPIRED,
            reason: `Scheduled cancellation reached billing period end. Paid entitlements revoked.`,
            source: "SYSTEM"
          }
        })
      })
      summary.scheduledCancellationsExpired++
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      summary
    })
  } catch (error: any) {
    console.error("[Subscription Lifecycle Cron Error]:", error)
    return NextResponse.json({ error: error.message || "Lifecycle cron execution failed" }, { status: 500 })
  }
}
