"use client"

import { useOrganization } from "@/context/OrganizationContext"
import { useSession } from "next-auth/react"

export interface PlanDetails {
  planName: string
  enabledModules: Record<string, boolean>
  hasFeature: (moduleKey: string) => boolean
  studentLimit: number | "Unlimited"
  courseLimit: number | "Unlimited"
}

const DEFAULT_STARTER_MODULES: Record<string, boolean> = {
  coreLms: true,
  studentPortal: true,
  feesEmi: true,
  certificates: true,
  customPaymentGateway: true,
  whatsappAuto: false,
  emailMarketing: false,
  webinars: false,
  whitelabel: false,
  mentorship: false,
  walkInKiosk: false,
  referrals: false
}

const GROWTH_MODULES: Record<string, boolean> = {
  coreLms: true,
  studentPortal: true,
  feesEmi: true,
  certificates: true,
  customPaymentGateway: true,
  whatsappAuto: true,
  emailMarketing: true,
  webinars: true,
  whitelabel: true,
  mentorship: false,
  walkInKiosk: false,
  referrals: true
}

const ALL_MODULES: Record<string, boolean> = {
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
  referrals: true
}

export function usePlan(): PlanDetails {
  const org = useOrganization()
  const { data: session } = useSession()

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "Super Admin"

  // Super admins have access to all features across all modules
  if (isSuperAdmin) {
    return {
      planName: "PLATFORM_SUPER_ADMIN",
      enabledModules: ALL_MODULES,
      hasFeature: () => true,
      studentLimit: "Unlimited",
      courseLimit: "Unlimited"
    }
  }

  const rawSub = (org as any)?.subscription?.toUpperCase() || "STARTER"

  let planName = "STARTER"
  let modules = DEFAULT_STARTER_MODULES
  let studentLimit: number | "Unlimited" = 500
  let courseLimit: number | "Unlimited" = 15

  if (rawSub === "ENTERPRISE" || rawSub === "CUSTOM") {
    planName = "ENTERPRISE"
    modules = ALL_MODULES
    studentLimit = "Unlimited"
    courseLimit = "Unlimited"
  } else if (rawSub === "GROWTH" || rawSub === "PRO") {
    planName = "GROWTH"
    modules = GROWTH_MODULES
    studentLimit = 2500
    courseLimit = 50
  } else {
    planName = "STARTER"
    modules = DEFAULT_STARTER_MODULES
    studentLimit = 500
    courseLimit = 15
  }

  return {
    planName,
    enabledModules: modules,
    hasFeature: (moduleKey: string) => !!modules[moduleKey],
    studentLimit,
    courseLimit
  }
}
