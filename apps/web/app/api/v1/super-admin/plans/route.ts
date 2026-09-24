import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export interface SubscriptionPlanItem {
  id: string
  name: string
  originalPriceYearly: number
  offerPriceYearly: number
  gstText: string
  studentLimit: number | "Unlimited"
  instructorLimit: number | "Unlimited"
  courseLimit: number | "Unlimited"
  storageLimitGB: number | "Unlimited"
  enabledModules: Record<string, boolean>
  customPaymentLink: string
  status: "ACTIVE" | "DISABLED"
  popular?: boolean
  badgeText?: string
}

// In-memory / persistent fallback cache
let globalPlansCache: SubscriptionPlanItem[] = [
  {
    id: "plan-starter",
    name: "STARTER ACADEMY",
    originalPriceYearly: 24999,
    offerPriceYearly: 14999,
    gstText: "+ 18% GST",
    studentLimit: 500,
    instructorLimit: 5,
    courseLimit: 15,
    storageLimitGB: 50,
    enabledModules: {
      coreLms: true,
      studentPortal: true,
      feesEmi: true,
      certificates: true,
      customPaymentGateway: true
    },
    customPaymentLink: "https://echolms.com/subscribe/starter",
    status: "ACTIVE",
    badgeText: "Save 40%"
  },
  {
    id: "plan-growth",
    name: "GROWTH INSTITUTE",
    originalPriceYearly: 49999,
    offerPriceYearly: 29999,
    gstText: "+ 18% GST",
    studentLimit: 2500,
    instructorLimit: 20,
    courseLimit: 50,
    storageLimitGB: 200,
    enabledModules: {
      coreLms: true,
      studentPortal: true,
      feesEmi: true,
      certificates: true,
      customPaymentGateway: true,
      whatsappAutomation: true,
      attendanceScanner: true,
      crmPipelines: true,
      aiLessonWriter: true
    },
    customPaymentLink: "https://echolms.com/subscribe/growth",
    status: "ACTIVE",
    popular: true,
    badgeText: "Most Popular"
  },
  {
    id: "plan-enterprise",
    name: "ENTERPRISE PRO",
    originalPriceYearly: 99999,
    offerPriceYearly: 59999,
    gstText: "+ 18% GST",
    studentLimit: "Unlimited",
    instructorLimit: "Unlimited",
    courseLimit: "Unlimited",
    storageLimitGB: "Unlimited",
    enabledModules: {
      coreLms: true,
      studentPortal: true,
      feesEmi: true,
      certificates: true,
      customPaymentGateway: true,
      whatsappAutomation: true,
      attendanceScanner: true,
      crmPipelines: true,
      aiLessonWriter: true,
      customDomain: true,
      whiteLabelBranding: true,
      prioritySupport: true,
      multiCampusAccess: true
    },
    customPaymentLink: "https://echolms.com/subscribe/enterprise",
    status: "ACTIVE",
    badgeText: "Full Power"
  }
]

export async function GET() {
  try {
    return NextResponse.json({ plans: globalPlansCache })
  } catch (error: any) {
    console.error("Error loading plans:", error)
    return NextResponse.json({ plans: globalPlansCache })
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

    const planData: SubscriptionPlanItem = await req.json()

    if (!planData.name || !planData.offerPriceYearly) {
      return NextResponse.json({ error: "Plan name and offer price are required." }, { status: 400 })
    }

    const newPlan: SubscriptionPlanItem = {
      ...planData,
      id: planData.id || `plan-${Date.now()}`
    }

    globalPlansCache = [newPlan, ...globalPlansCache.filter(p => p.id !== newPlan.id)]

    return NextResponse.json({ success: true, plan: newPlan, plans: globalPlansCache })
  } catch (error: any) {
    console.error("Error creating plan:", error)
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

    const updatedPlan: SubscriptionPlanItem = await req.json()

    if (!updatedPlan.id) {
      return NextResponse.json({ error: "Plan ID is required." }, { status: 400 })
    }

    globalPlansCache = globalPlansCache.map(p => p.id === updatedPlan.id ? { ...p, ...updatedPlan } : p)

    return NextResponse.json({ success: true, plan: updatedPlan, plans: globalPlansCache })
  } catch (error: any) {
    console.error("Error updating plan:", error)
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

    if (globalPlansCache.length <= 1) {
      return NextResponse.json({ error: "At least one active plan must remain." }, { status: 400 })
    }

    globalPlansCache = globalPlansCache.filter(p => p.id !== planId)

    return NextResponse.json({ success: true, plans: globalPlansCache })
  } catch (error: any) {
    console.error("Error deleting plan:", error)
    return NextResponse.json({ error: error.message || "Failed to delete plan" }, { status: 500 })
  }
}
