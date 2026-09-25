import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SubscriptionEntitlementService } from "@/lib/services/subscription-entitlement.service"

export async function GET() {
  try {
    await SubscriptionEntitlementService.ensureDefaultPlansExist()

    const dbPlans = await prisma.saaSPlan.findMany({
      orderBy: { sortOrder: 'asc' }
    })

    // Format for UI consumption
    const plans = dbPlans.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      billingType: p.billingType,
      monthlyPrice: p.monthlyPrice,
      originalPriceYearly: p.yearlyPrice,
      offerPriceYearly: p.offerPriceYearly || p.yearlyPrice,
      gstText: p.gstText || "+ 18% GST",
      currency: p.currency,
      taxRate: p.taxRate,
      trialDays: p.trialDays,
      gracePeriodDays: p.gracePeriodDays,
      studentLimit: p.maxStudents === -1 ? "Unlimited" : p.maxStudents,
      instructorLimit: p.maxInstructors === -1 ? "Unlimited" : p.maxInstructors,
      courseLimit: p.maxCourses === -1 ? "Unlimited" : p.maxCourses,
      storageLimitGB: p.maxStorageGB === -1 ? "Unlimited" : p.maxStorageGB,
      enabledModules: (p.features as Record<string, boolean>) || {},
      customPaymentLink: p.customPaymentLink || "",
      status: p.isActive ? "ACTIVE" : "DISABLED",
      popular: p.isPopular,
      badgeText: p.badgeText || undefined
    }))

    return NextResponse.json({ plans })
  } catch (error: any) {
    console.error("Error loading SaaS plans from DB:", error)
    return NextResponse.json({ error: error.message || "Failed to load plans" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'Super Admin' || session?.user?.impersonatedBySuperAdmin

    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 })
    }

    const planData = await req.json()

    if (!planData.name || (!planData.offerPriceYearly && !planData.yearlyPrice)) {
      return NextResponse.json({ error: "Plan name and yearly price are required." }, { status: 400 })
    }

    const slug = (planData.slug || planData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/-+/g, '-').replace(/^-|-$/g, '')
    const yearlyPrice = planData.originalPriceYearly || planData.yearlyPrice || 24999
    const offerPriceYearly = planData.offerPriceYearly || yearlyPrice

    const newPlan = await prisma.saaSPlan.create({
      data: {
        id: planData.id || `plan-${Date.now()}`,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        name: planData.name,
        description: planData.description || null,
        billingType: planData.billingType || "RECURRING",
        monthlyPrice: planData.monthlyPrice || Math.round(offerPriceYearly / 12),
        yearlyPrice,
        offerPriceYearly,
        gstText: planData.gstText || "+ 18% GST",
        currency: planData.currency || "INR",
        taxRate: planData.taxRate || 18.0,
        trialDays: planData.trialDays || 14,
        gracePeriodDays: planData.gracePeriodDays || 7,
        maxStudents: planData.studentLimit === "Unlimited" ? -1 : (parseInt(planData.studentLimit) || 500),
        maxInstructors: planData.instructorLimit === "Unlimited" ? -1 : (parseInt(planData.instructorLimit) || 5),
        maxCourses: planData.courseLimit === "Unlimited" ? -1 : (parseInt(planData.courseLimit) || 15),
        maxStorageGB: planData.storageLimitGB === "Unlimited" ? -1 : (parseInt(planData.storageLimitGB) || 50),
        features: planData.enabledModules || {},
        customPaymentLink: planData.customPaymentLink || null,
        isActive: planData.status !== "DISABLED",
        isPopular: !!planData.popular,
        badgeText: planData.badgeText || null
      }
    })

    return NextResponse.json({ success: true, plan: newPlan })
  } catch (error: any) {
    console.error("Error creating SaaS plan:", error)
    return NextResponse.json({ error: error.message || "Failed to create plan" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'Super Admin' || session?.user?.impersonatedBySuperAdmin

    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 })
    }

    const updatedPlan = await req.json()

    if (!updatedPlan.id) {
      return NextResponse.json({ error: "Plan ID is required." }, { status: 400 })
    }

    const updated = await prisma.saaSPlan.update({
      where: { id: updatedPlan.id },
      data: {
        name: updatedPlan.name,
        description: updatedPlan.description,
        yearlyPrice: updatedPlan.originalPriceYearly || updatedPlan.yearlyPrice,
        offerPriceYearly: updatedPlan.offerPriceYearly,
        gstText: updatedPlan.gstText,
        trialDays: updatedPlan.trialDays,
        gracePeriodDays: updatedPlan.gracePeriodDays,
        maxStudents: updatedPlan.studentLimit === "Unlimited" ? -1 : (parseInt(updatedPlan.studentLimit) || 500),
        maxInstructors: updatedPlan.instructorLimit === "Unlimited" ? -1 : (parseInt(updatedPlan.instructorLimit) || 5),
        maxCourses: updatedPlan.courseLimit === "Unlimited" ? -1 : (parseInt(updatedPlan.courseLimit) || 15),
        maxStorageGB: updatedPlan.storageLimitGB === "Unlimited" ? -1 : (parseInt(updatedPlan.storageLimitGB) || 50),
        features: updatedPlan.enabledModules,
        customPaymentLink: updatedPlan.customPaymentLink,
        isActive: updatedPlan.status !== "DISABLED",
        isPopular: !!updatedPlan.popular,
        badgeText: updatedPlan.badgeText
      }
    })

    return NextResponse.json({ success: true, plan: updated })
  } catch (error: any) {
    console.error("Error updating SaaS plan:", error)
    return NextResponse.json({ error: error.message || "Failed to update plan" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'Super Admin' || session?.user?.impersonatedBySuperAdmin

    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const planId = searchParams.get("id")

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required." }, { status: 400 })
    }

    // Check if there are active subscribers attached to this plan
    const activeSubCount = await prisma.tenantSubscription.count({
      where: { planId }
    })

    if (activeSubCount > 0) {
      // Soft-deactivate instead of hard-deleting to preserve tenant integrity
      await prisma.saaSPlan.update({
        where: { id: planId },
        data: { isActive: false }
      })
      return NextResponse.json({ 
        success: true, 
        message: `Plan has ${activeSubCount} active subscriber(s). Plan has been deactivated for new subscriptions while preserving existing customer agreements.` 
      })
    }

    await prisma.saaSPlan.delete({
      where: { id: planId }
    })

    return NextResponse.json({ success: true, message: "Plan deleted successfully." })
  } catch (error: any) {
    console.error("Error deleting SaaS plan:", error)
    return NextResponse.json({ error: error.message || "Failed to delete plan" }, { status: 500 })
  }
}
