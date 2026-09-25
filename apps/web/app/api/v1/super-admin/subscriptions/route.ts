import { prisma } from  "@/lib/prisma"
import { NextResponse } from  "next/server"
import { auth } from  "@/auth"
import { SubscriptionEntitlementService } from  "@/lib/services/subscription-entitlement.service"
import { SubscriptionStatus } from  "@grekam/db"

export async function GET() {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'Super Admin' || session?.user?.impersonatedBySuperAdmin

    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 })
    }

    await SubscriptionEntitlementService.ensureDefaultPlansExist()

    const orgs = await prisma.organization.findMany({
      include: {
        tenantSubscription: {
          include: {
            plan: true,
            events: {
              take: 5,
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        entitlementOverrides: true,
        users: {
          select: { id: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const subscriptions = await Promise.all(orgs.map(async (org) => {
      let sub: any = org.tenantSubscription
      if (!sub) {
        sub = await SubscriptionEntitlementService.getOrganizationSubscription(org.id)
      }

      const studentCount = org.users.filter(u => u.role === 'STUDENT').length
      const staffCount = org.users.filter(u => ['ADMIN', 'MANAGER', 'STAFF', 'EDUCATOR'].includes(u.role)).length
      
      const mrr = sub?.plan?.monthlyPrice || Math.round((sub?.plan?.offerPriceYearly || sub?.plan?.yearlyPrice || 29999) / 12)

      return {
        id: sub.id,
        academyId: org.id,
        academyName: org.name,
        slug: org.slug,
        ownerEmail: org.ownerEmail || 'N/A',
        ownerPhone: org.ownerPhone || 'N/A',
        planId: sub.planId,
        planName: sub.plan.name,
        status: sub.status,
        billingCycle: sub.billingCycle === 'YEARLY' ? 'Yearly Billed' : 'Monthly Billed',
        mrr: `₹${mrr.toLocaleString()}`,
        students: studentCount,
        studentLimit: sub.plan.maxStudents === -1 ? "Unlimited" : sub.plan.maxStudents,
        staff: staffCount,
        staffLimit: sub.plan.maxStaff === -1 ? "Unlimited" : sub.plan.maxStaff,
        trialEnd: sub.trialEnd?.toISOString() || null,
        gracePeriodEnd: sub.gracePeriodEnd?.toISOString() || null,
        nextBillingDate: sub.currentPeriodEnd.toISOString().split('T')[0],
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        createdAt: sub.createdAt.toISOString(),
        recentEvents: sub.events || [],
        overrides: org.entitlementOverrides || []
      }
    }))

    return NextResponse.json({ subscriptions })
  } catch (error: any) {
    console.error("Error fetching super admin subscriptions:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch subscriptions" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'Super Admin' || session?.user?.impersonatedBySuperAdmin

    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { 
      academyId, 
      action, // "CHANGE_PLAN" | "CHANGE_STATUS" | "GRANT_EXTENSION" | "SET_OVERRIDE"
      planId, 
      status, 
      extensionDays, 
      overrideFeature, 
      overrideEnabled, 
      customLimit, 
      reason 
    } = body

    if (!academyId) {
      return NextResponse.json({ error: "Academy ID is required" }, { status: 400 })
    }

    const currentSub = await SubscriptionEntitlementService.getOrganizationSubscription(academyId)

    // Handle specific Super Admin action
    if (action === "CHANGE_PLAN" && planId) {
      const updated = await SubscriptionEntitlementService.changePlan({
        organizationId: academyId,
        newPlanId: planId,
        actorId: session.user.id || "super-admin",
        reason: reason || "Plan migrated by Super Admin"
      })
      return NextResponse.json({ success: true, subscription: updated })
    }

    if (action === "CHANGE_STATUS" && status) {
      const updated = await SubscriptionEntitlementService.transitionStatus({
        organizationId: academyId,
        toStatus: status as SubscriptionStatus,
        reason: reason || "Status updated by Super Admin",
        source: "SUPER_ADMIN",
        actorId: session.user.id || "super-admin"
      })
      return NextResponse.json({ success: true, subscription: updated })
    }

    if (action === "GRANT_EXTENSION" && extensionDays) {
      const days = parseInt(extensionDays) || 7
      const newPeriodEnd = new Date(currentSub.currentPeriodEnd.getTime() + days * 24 * 60 * 60 * 1000)

      const updated = await prisma.tenantSubscription.update({
        where: { id: currentSub.id },
        data: {
          currentPeriodEnd: newPeriodEnd,
          status: SubscriptionStatus.ACTIVE
        },
        include: { plan: true }
      })

      await prisma.subscriptionEvent.create({
        data: {
          subscriptionId: currentSub.id,
          organizationId: academyId,
          eventType: "MANUAL_OVERRIDE",
          fromStatus: currentSub.status,
          toStatus: SubscriptionStatus.ACTIVE,
          reason: reason || `Granted ${days}-day billing extension by Super Admin`,
          source: "SUPER_ADMIN",
          actorId: session.user.id || "super-admin"
        }
      })

      return NextResponse.json({ success: true, subscription: updated })
    }

    if (action === "SET_OVERRIDE" && overrideFeature) {
      const override = await prisma.organizationEntitlementOverride.upsert({
        where: {
          organizationId_featureKey: {
            organizationId: academyId,
            featureKey: overrideFeature
          }
        },
        update: {
          isEnabled: overrideEnabled !== undefined ? overrideEnabled : true,
          customLimit: customLimit !== undefined ? customLimit : null,
          reason: reason || "Manual entitlement override by Super Admin",
          grantedByUserId: session.user.id || "super-admin",
          updatedAt: new Date()
        },
        create: {
          organizationId: academyId,
          featureKey: overrideFeature,
          isEnabled: overrideEnabled !== undefined ? overrideEnabled : true,
          customLimit: customLimit !== undefined ? customLimit : null,
          reason: reason || "Manual entitlement override by Super Admin",
          grantedByUserId: session.user.id || "super-admin"
        }
      })

      return NextResponse.json({ success: true, override })
    }

    // Default fallback update
    if (status) {
      const updated = await SubscriptionEntitlementService.transitionStatus({
        organizationId: academyId,
        toStatus: status as SubscriptionStatus,
        reason: reason || "Super Admin update",
        source: "SUPER_ADMIN",
        actorId: session.user.id || "super-admin"
      })
      return NextResponse.json({ success: true, subscription: updated })
    }

    return NextResponse.json({ error: "No valid update action specified" }, { status: 400 })
  } catch (error: any) {
    console.error("Error updating subscription:", error)
    return NextResponse.json({ error: error.message || "Failed to update subscription" }, { status: 500 })
  }
}
