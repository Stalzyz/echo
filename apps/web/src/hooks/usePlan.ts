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
  customDomain: false,
  apiAccess: false,
}

const GROWTH_MODULES: Record<string, boolean> = {
  coreLms: true,
  studentPortal: true,
  feesEmi: true,
  certificates: true,
  customPaymentGateway: true,
  crmPipelines: true,
  attendanceScanner: true,
  whatsappAuto: true,
  emailMarketing: true,
  webinars: true,
  whitelabel: true,
  mentorship: true,
  walkInKiosk: false,
  referrals: true,
  aiLessonWriter: true,
  callIntelligence: true,
  customDomain: true,
  apiAccess: false,
}

const ALL_MODULES: Record<string, boolean> = {
  coreLms: true,
  studentPortal: true,
  feesEmi: true,
  certificates: true,
  customPaymentGateway: true,
  crmPipelines: true,
  attendanceScanner: true,
  whatsappAuto: true,
  emailMarketing: true,
  webinars: true,
  whitelabel: true,
  mentorship: true,
  walkInKiosk: true,
  referrals: true,
  aiLessonWriter: true,
  callIntelligence: true,
  customDomain: true,
  apiAccess: true,
}

export function usePlan(): PlanDetails {
  const org = useOrganization()
  const { data: session } = useSession()

  // Only global Super Admin viewing platform mode (NOT in tenant context, NOT impersonating) gets full bypass
  const isSuperAdminGlobal =
    (session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "Super Admin") &&
    !session?.user?.organizationId &&
    !session?.user?.impersonatedBySuperAdmin

  if (isSuperAdminGlobal) {
    return {
      planName: "PLATFORM_SUPER_ADMIN",
      enabledModules: ALL_MODULES,
      hasFeature: () => true,
      studentLimit: "Unlimited",
      courseLimit: "Unlimited"
    }
  }

  // Use database plan if available
  const planObj = org?.plan
  const planSlug = (planObj?.slug || org?.subscription || "STARTER").toUpperCase()

  let fallbackModules = DEFAULT_STARTER_MODULES
  let studentLimit: number | "Unlimited" = 500
  let courseLimit: number | "Unlimited" = 15

  if (planSlug.includes("ENTERPRISE") || planSlug.includes("CUSTOM")) {
    fallbackModules = ALL_MODULES
    studentLimit = planObj?.maxStudents === -1 ? "Unlimited" : (planObj?.maxStudents ?? "Unlimited")
    courseLimit = planObj?.maxCourses === -1 ? "Unlimited" : (planObj?.maxCourses ?? "Unlimited")
  } else if (planSlug.includes("GROWTH") || planSlug.includes("PRO")) {
    fallbackModules = GROWTH_MODULES
    studentLimit = planObj?.maxStudents ?? 2500
    courseLimit = planObj?.maxCourses ?? 50
  } else {
    fallbackModules = DEFAULT_STARTER_MODULES
    studentLimit = planObj?.maxStudents ?? 500
    courseLimit = planObj?.maxCourses ?? 15
  }

  const featuresMap = (planObj?.features as Record<string, boolean>) || fallbackModules

  const hasFeature = (moduleKey: string): boolean => {
    if (featuresMap && typeof featuresMap[moduleKey] === "boolean") {
      return featuresMap[moduleKey]
    }
    return !!fallbackModules[moduleKey]
  }

  return {
    planName: planObj?.name || org?.subscription || "STARTER",
    enabledModules: featuresMap,
    hasFeature,
    studentLimit,
    courseLimit
  }
}
