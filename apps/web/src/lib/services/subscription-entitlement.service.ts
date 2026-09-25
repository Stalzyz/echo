import { prisma } from "@/lib/prisma"
import { SubscriptionStatus, BillingCycle, SubscriptionInvoiceStatus, PaymentStatus } from "@grekam/db"

export interface PlanFeatureMap {
  coreLms?: boolean
  studentPortal?: boolean
  feesEmi?: boolean
  certificates?: boolean
  whatsappAuto?: boolean
  emailMarketing?: boolean
  webinars?: boolean
  whitelabel?: boolean
  mentorship?: boolean
  walkInKiosk?: boolean
  referrals?: boolean
  customPaymentGateway?: boolean
  crmPipelines?: boolean
  attendanceScanner?: boolean
  aiLessonWriter?: boolean
  callIntelligence?: boolean
  customDomain?: boolean
  apiAccess?: boolean
  [key: string]: boolean | undefined
}

export interface PlanLimits {
  maxStudents: number // -1 = unlimited, 0 = disabled, >0 = explicit cap
  maxInstructors: number
  maxCourses: number
  maxBatches: number
  maxStorageGB: number
  maxWhatsAppMessages: number
  maxAiRequests: number
  maxCallMinutes: number
  maxCustomDomains: number
  maxAutomations: number
  maxStaff: number
}

// Initial plan templates for seeding if not already present
export const DEFAULT_SAAS_PLANS = [
  {
    id: "plan-starter",
    slug: "starter-academy",
    name: "STARTER ACADEMY",
    description: "Ideal for individual tutors & boutique coaching centers starting digital learning.",
    billingType: "RECURRING",
    monthlyPrice: 1999,
    yearlyPrice: 24999,
    offerPriceYearly: 14999,
    currency: "INR",
    taxRate: 18.0,
    gstText: "+ 18% GST",
    trialDays: 14,
    gracePeriodDays: 7,
    sortOrder: 1,
    isActive: true,
    isPopular: false,
    badgeText: "Save 40%",
    customPaymentLink: "https://echolms.com/subscribe/starter",
    maxStudents: 500,
    maxInstructors: 5,
    maxCourses: 15,
    maxBatches: 20,
    maxStorageGB: 50,
    maxWhatsAppMessages: 1000,
    maxAiRequests: 500,
    maxCallMinutes: 100,
    maxCustomDomains: 0,
    maxAutomations: 3,
    maxStaff: 5,
    features: {
      coreLms: true,
      studentPortal: true,
      feesEmi: true,
      certificates: true,
      customPaymentGateway: true,
      crmPipelines: true,
      attendanceScanner: true,
      whatsappAuto: false,
      emailMarketing: false,
      webinars: false,
      whitelabel: false,
      mentorship: false,
      walkInKiosk: false,
      referrals: false,
      aiLessonWriter: false,
      callIntelligence: false,
      customDomain: false
    }
  },
  {
    id: "plan-growth",
    slug: "growth-institute",
    name: "GROWTH INSTITUTE",
    description: "For expanding institutes that need WhatsApp automation, CRM pipelines & AI lesson writers.",
    billingType: "RECURRING",
    monthlyPrice: 3999,
    yearlyPrice: 49999,
    offerPriceYearly: 29999,
    currency: "INR",
    taxRate: 18.0,
    gstText: "+ 18% GST",
    trialDays: 14,
    gracePeriodDays: 7,
    sortOrder: 2,
    isActive: true,
    isPopular: true,
    badgeText: "Most Popular Choice",
    customPaymentLink: "https://echolms.com/subscribe/growth",
    maxStudents: 2500,
    maxInstructors: 20,
    maxCourses: 50,
    maxBatches: 100,
    maxStorageGB: 250,
    maxWhatsAppMessages: 10000,
    maxAiRequests: 5000,
    maxCallMinutes: 1000,
    maxCustomDomains: 1,
    maxAutomations: 15,
    maxStaff: 25,
    features: {
      coreLms: true,
      studentPortal: true,
      feesEmi: true,
      certificates: true,
      customPaymentGateway: true,
      whatsappAuto: true,
      emailMarketing: true,
      webinars: true,
      whitelabel: true,
      mentorship: true,
      referrals: true,
      crmPipelines: true,
      attendanceScanner: true,
      aiLessonWriter: true,
      callIntelligence: true,
      customDomain: true,
      walkInKiosk: false
    }
  },
  {
    id: "plan-enterprise",
    slug: "enterprise-multi-branch",
    name: "ENTERPRISE PRO",
    description: "Complete unconstrained platform suite with full whitelabeling, multi-branch & unlimited capacity.",
    billingType: "RECURRING",
    monthlyPrice: 7999,
    yearlyPrice: 99999,
    offerPriceYearly: 69999,
    currency: "INR",
    taxRate: 18.0,
    gstText: "+ 18% GST",
    trialDays: 30,
    gracePeriodDays: 14,
    sortOrder: 3,
    isActive: true,
    isPopular: false,
    badgeText: "Full Enterprise Suite",
    customPaymentLink: "https://echolms.com/subscribe/enterprise",
    maxStudents: -1, // Unlimited
    maxInstructors: -1,
    maxCourses: -1,
    maxBatches: -1,
    maxStorageGB: -1,
    maxWhatsAppMessages: -1,
    maxAiRequests: -1,
    maxCallMinutes: -1,
    maxCustomDomains: -1,
    maxAutomations: -1,
    maxStaff: -1,
    features: {
      coreLms: true,
      studentPortal: true,
      feesEmi: true,
      certificates: true,
      customPaymentGateway: true,
      whatsappAuto: true,
      emailMarketing: true,
      webinars: true,
      whitelabel: true,
      mentorship: true,
      walkInKiosk: true,
      referrals: true,
      crmPipelines: true,
      attendanceScanner: true,
      aiLessonWriter: true,
      callIntelligence: true,
      customDomain: true,
      apiAccess: true
    }
  }
]

export class SubscriptionEntitlementService {
  /**
   * Seed default plans if not already created
   */
  static async ensureDefaultPlansExist() {
    for (const plan of DEFAULT_SAAS_PLANS) {
      const existing = await prisma.saaSPlan.findUnique({
        where: { slug: plan.slug }
      })
      if (!existing) {
        await prisma.saaSPlan.create({
          data: {
            id: plan.id,
            slug: plan.slug,
            name: plan.name,
            description: plan.description,
            billingType: plan.billingType,
            monthlyPrice: plan.monthlyPrice,
            yearlyPrice: plan.yearlyPrice,
            offerPriceYearly: plan.offerPriceYearly,
            currency: plan.currency,
            taxRate: plan.taxRate,
            gstText: plan.gstText,
            trialDays: plan.trialDays,
            gracePeriodDays: plan.gracePeriodDays,
            sortOrder: plan.sortOrder,
            isActive: plan.isActive,
            isPopular: plan.isPopular,
            badgeText: plan.badgeText,
            customPaymentLink: plan.customPaymentLink,
            maxStudents: plan.maxStudents,
            maxInstructors: plan.maxInstructors,
            maxCourses: plan.maxCourses,
            maxBatches: plan.maxBatches,
            maxStorageGB: plan.maxStorageGB,
            maxWhatsAppMessages: plan.maxWhatsAppMessages,
            maxAiRequests: plan.maxAiRequests,
            maxCallMinutes: plan.maxCallMinutes,
            maxCustomDomains: plan.maxCustomDomains,
            maxAutomations: plan.maxAutomations,
            maxStaff: plan.maxStaff,
            features: plan.features
          }
        })
      }
    }
  }

  /**
   * Get or automatically initialize a TenantSubscription for an organization.
   * Guarantees that every organization has a valid server-side subscription record.
   */
  static async getOrganizationSubscription(organizationId: string) {
    await this.ensureDefaultPlansExist()

    let sub = await prisma.tenantSubscription.findUnique({
      where: { organizationId },
      include: {
        plan: true,
        organization: {
          select: { id: true, name: true, slug: true, status: true, subscription: true }
        }
      }
    })

    if (!sub) {
      // Map legacy subscription string to appropriate SaaS plan
      const org = await prisma.organization.findUnique({
        where: { id: organizationId }
      })

      const legacySlug = org?.subscription?.toLowerCase() || "growth"
      let defaultPlan = await prisma.saaSPlan.findFirst({
        where: {
          OR: [
            { slug: { contains: legacySlug } },
            { id: { contains: legacySlug } }
          ],
          isActive: true
        }
      })

      if (!defaultPlan) {
        defaultPlan = await prisma.saaSPlan.findFirst({
          where: { isActive: true },
          orderBy: { sortOrder: "asc" }
        })
      }

      if (!defaultPlan) {
        throw new Error("No active SaaS subscription plans available in database.")
      }

      const now = new Date()
      const trialDays = defaultPlan.trialDays || 14
      const trialEnd = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000)
      const periodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)

      sub = await prisma.tenantSubscription.create({
        data: {
          organizationId,
          planId: defaultPlan.id,
          status: org?.status === "SUSPENDED" ? SubscriptionStatus.SUSPENDED : SubscriptionStatus.ACTIVE,
          billingCycle: BillingCycle.YEARLY,
          startDate: now,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          trialStart: now,
          trialEnd: trialEnd,
          provider: "MANUAL_COMP"
        },
        include: {
          plan: true,
          organization: {
            select: { id: true, name: true, slug: true, status: true, subscription: true }
          }
        }
      })

      // Record initial audit event
      await prisma.subscriptionEvent.create({
        data: {
          subscriptionId: sub.id,
          organizationId,
          eventType: "INITIAL_PROVISION",
          toStatus: sub.status,
          toPlanId: sub.planId,
          reason: "Auto-provisioned initial tenant subscription",
          source: "SYSTEM"
        }
      })
    }

    return sub
  }

  /**
   * Check if an organization is entitled to a specific feature.
   * Takes into account:
   * 1. Super Admin feature overrides
   * 2. Subscription status (ACTIVE, TRIALING, GRACE_PERIOD allow features; SUSPENDED, EXPIRED block features)
   * 3. Plan feature flags
   */
  static async hasFeature(organizationId: string, featureKey: string): Promise<boolean> {
    // 1. Check for active explicit Entitlement Override
    const override = await prisma.organizationEntitlementOverride.findUnique({
      where: {
        organizationId_featureKey: {
          organizationId,
          featureKey
        }
      }
    })

    if (override) {
      if (override.expiresAt && override.expiresAt < new Date()) {
        // Expired override, clean it up or ignore
      } else {
        return override.isEnabled
      }
    }

    // 2. Fetch Subscription and Plan
    const sub = await this.getOrganizationSubscription(organizationId)

    // Suspended or Expired accounts lose paid feature access
    if (sub.status === SubscriptionStatus.SUSPENDED || sub.status === SubscriptionStatus.EXPIRED) {
      return false
    }

    // 3. Resolve from Plan features JSON
    const features = (sub.plan.features as PlanFeatureMap) || {}
    return !!features[featureKey]
  }

  /**
   * Get the maximum limit for a metric (-1 = unlimited, 0 = disabled, >0 = limit)
   */
  static async getLimit(organizationId: string, limitKey: keyof PlanLimits | string): Promise<number> {
    // Check override first
    const override = await prisma.organizationEntitlementOverride.findUnique({
      where: {
        organizationId_featureKey: {
          organizationId,
          featureKey: limitKey
        }
      }
    })

    if (override && override.customLimit !== null && override.customLimit !== undefined) {
      if (!override.expiresAt || override.expiresAt >= new Date()) {
        return override.customLimit
      }
    }

    const sub = await this.getOrganizationSubscription(organizationId)

    if (sub.status === SubscriptionStatus.SUSPENDED || sub.status === SubscriptionStatus.EXPIRED) {
      return 0
    }

    const plan = sub.plan as any
    if (plan[limitKey] !== undefined && typeof plan[limitKey] === "number") {
      return plan[limitKey]
    }

    return -1
  }

  /**
   * Get current usage for a specific metric
   */
  static async getUsage(organizationId: string, metric: string): Promise<number> {
    if (metric === "students") {
      return await prisma.student.count({
        where: { user: { organizationId } }
      })
    }

    if (metric === "staff" || metric === "instructors") {
      return await prisma.user.count({
        where: {
          organizationId,
          role: { in: ["ADMIN", "MANAGER", "STAFF", "EDUCATOR"] }
        }
      })
    }

    if (metric === "courses") {
      return await prisma.course.count({
        where: { organizationId }
      })
    }

    if (metric === "batches") {
      return await prisma.batch.count({
        where: { organizationId }
      })
    }

    // Check usage counters table for consumption-based metrics (whatsapp, ai, calls, storage)
    const counter = await prisma.organizationUsageCounter.findUnique({
      where: {
        organizationId_metric: {
          organizationId,
          metric
        }
      }
    })

    return counter?.currentUsage || 0
  }

  /**
   * Check if organization can consume an amount of a metric without exceeding limit
   */
  static async canConsume(organizationId: string, metric: string, amountToConsume: number = 1): Promise<{ allowed: boolean; current: number; limit: number; remaining: number | "Unlimited" }> {
    const limitMap: Record<string, string> = {
      students: "maxStudents",
      instructors: "maxInstructors",
      staff: "maxStaff",
      courses: "maxCourses",
      batches: "maxBatches",
      storage_gb: "maxStorageGB",
      whatsapp_messages: "maxWhatsAppMessages",
      ai_requests: "maxAiRequests",
      call_minutes: "maxCallMinutes",
      custom_domains: "maxCustomDomains",
      automations: "maxAutomations"
    }

    const limitKey = limitMap[metric] || metric
    const limit = await this.getLimit(organizationId, limitKey)
    const current = await this.getUsage(organizationId, metric)

    if (limit === -1) {
      return { allowed: true, current, limit: -1, remaining: "Unlimited" }
    }

    if (limit === 0) {
      return { allowed: false, current, limit: 0, remaining: 0 }
    }

    const allowed = (current + amountToConsume) <= limit
    const remaining = Math.max(0, limit - current)

    return { allowed, current, limit, remaining }
  }

  /**
   * Atomically increment a usage counter
   */
  static async incrementUsage(organizationId: string, metric: string, amount: number = 1, tx?: any) {
    const db = tx || prisma
    return await db.organizationUsageCounter.upsert({
      where: {
        organizationId_metric: {
          organizationId,
          metric
        }
      },
      update: {
        currentUsage: { increment: amount },
        updatedAt: new Date()
      },
      create: {
        organizationId,
        metric,
        currentUsage: amount,
        updatedAt: new Date()
      }
    })
  }

  /**
   * Atomically decrement a usage counter
   */
  static async decrementUsage(organizationId: string, metric: string, amount: number = 1, tx?: any) {
    const db = tx || prisma
    const counter = await db.organizationUsageCounter.findUnique({
      where: {
        organizationId_metric: {
          organizationId,
          metric
        }
      }
    })

    if (!counter) return null

    const newUsage = Math.max(0, counter.currentUsage - amount)
    return await db.organizationUsageCounter.update({
      where: {
        organizationId_metric: {
          organizationId,
          metric
        }
      },
      data: {
        currentUsage: newUsage,
        updatedAt: new Date()
      }
    })
  }

  /**
   * Comprehensive Entitlement & Limit Assertion for protected API endpoints.
   * Throws an error with clean status code payload if denied.
   */
  static async assertEntitlement(organizationId: string, featureKey: string) {
    const allowed = await this.hasFeature(organizationId, featureKey)
    if (!allowed) {
      const error: any = new Error(`Feature '${featureKey}' is not included in your current subscription plan or your account is suspended.`)
      error.statusCode = 403
      error.code = "ENTITLEMENT_REQUIRED"
      error.featureKey = featureKey
      throw error
    }
    return true
  }

  static async assertWithinLimit(organizationId: string, metric: string, requestedAmount: number = 1) {
    const { allowed, current, limit, remaining } = await this.canConsume(organizationId, metric, requestedAmount)
    if (!allowed) {
      const error: any = new Error(`Usage limit reached for '${metric}'. Current: ${current}, Limit: ${limit}. Please upgrade your subscription plan.`)
      error.statusCode = 403
      error.code = "LIMIT_EXCEEDED"
      error.metric = metric
      error.current = current
      error.limit = limit
      throw error
    }
    return true
  }

  /**
   * Upgrade or Downgrade Subscription Plan
   */
  static async changePlan(params: {
    organizationId: string
    newPlanId: string
    billingCycle?: BillingCycle
    actorId?: string
    reason?: string
  }) {
    const { organizationId, newPlanId, billingCycle = BillingCycle.YEARLY, actorId, reason } = params
    const sub = await this.getOrganizationSubscription(organizationId)
    const newPlan = await prisma.saaSPlan.findUnique({ where: { id: newPlanId } })

    if (!newPlan) {
      throw new Error(`Target subscription plan '${newPlanId}' not found.`)
    }

    const previousPlanId = sub.planId
    const now = new Date()
    const periodEnd = new Date(now.getTime() + (billingCycle === BillingCycle.MONTHLY ? 30 : 365) * 24 * 60 * 60 * 1000)

    const updatedSub = await prisma.$transaction(async (tx) => {
      const updated = await tx.tenantSubscription.update({
        where: { id: sub.id },
        data: {
          planId: newPlan.id,
          status: SubscriptionStatus.ACTIVE,
          billingCycle,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
          cancelledAt: null,
          suspendedAt: null,
          updatedAt: now
        },
        include: { plan: true }
      })

      // Sync organization.subscription field for backward compatibility
      await tx.organization.update({
        where: { id: organizationId },
        data: {
          subscription: newPlan.name,
          status: "ACTIVE"
        }
      })

      // Log subscription change event
      await tx.subscriptionEvent.create({
        data: {
          subscriptionId: sub.id,
          organizationId,
          eventType: "PLAN_CHANGE",
          fromPlanId: previousPlanId,
          toPlanId: newPlan.id,
          fromStatus: sub.status,
          toStatus: SubscriptionStatus.ACTIVE,
          reason: reason || `Plan changed from ${sub.plan.name} to ${newPlan.name}`,
          source: actorId ? "SUPER_ADMIN" : "SYSTEM",
          actorId
        }
      })

      return updated
    })

    return updatedSub
  }

  /**
   * Transition Subscription Status (ACTIVE, PAST_DUE, GRACE_PERIOD, SUSPENDED, CANCELLED, EXPIRED)
   */
  static async transitionStatus(params: {
    organizationId: string
    toStatus: SubscriptionStatus
    reason: string
    source?: string
    actorId?: string
    metadata?: any
  }) {
    const { organizationId, toStatus, reason, source = "SYSTEM", actorId, metadata } = params
    const sub = await this.getOrganizationSubscription(organizationId)
    const fromStatus = sub.status

    if (fromStatus === toStatus) return sub

    const now = new Date()
    const updateData: any = {
      status: toStatus,
      updatedAt: now
    }

    if (toStatus === SubscriptionStatus.SUSPENDED) {
      updateData.suspendedAt = now
    } else if (toStatus === SubscriptionStatus.ACTIVE) {
      updateData.suspendedAt = null
      updateData.cancelledAt = null
    } else if (toStatus === SubscriptionStatus.CANCELLED) {
      updateData.cancelledAt = now
    }

    const updatedSub = await prisma.$transaction(async (tx) => {
      const updated = await tx.tenantSubscription.update({
        where: { id: sub.id },
        data: updateData,
        include: { plan: true }
      })

      // Update organization table status
      await tx.organization.update({
        where: { id: organizationId },
        data: {
          status: toStatus === SubscriptionStatus.SUSPENDED ? "SUSPENDED" : "ACTIVE"
        }
      })

      // Audit event
      await tx.subscriptionEvent.create({
        data: {
          subscriptionId: sub.id,
          organizationId,
          eventType: "STATUS_CHANGE",
          fromStatus,
          toStatus,
          reason,
          source,
          actorId,
          metadata: metadata || null
        }
      })

      return updated
    })

    return updatedSub
  }
}
