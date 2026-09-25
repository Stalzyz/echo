import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Bell,
  Settings,
} from "lucide-react"

export type Role = "SUPER_ADMIN" | "MANAGER" | "STAFF" | "CLIENT" | "STUDENT" | "VENDOR" | "INTERN"

export interface NavChild {
  title: string
  href: string
  feature?: string
  badge?: string
}

export interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: Role[]
  resource?: string
  feature?: string
  children?: NavChild[]
}

export const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "MANAGER", "STAFF", "STUDENT", "INTERN"],
  },
  {
    title: "Academy Admin",
    href: "/dashboard/academy/admissions",
    icon: GraduationCap,
    resource: "ACADEMY",
    roles: ["SUPER_ADMIN", "MANAGER"],
    children: [
      { title: "Admissions CRM", href: "/dashboard/academy/admissions", feature: "crmPipelines" },
      { title: "Form Builder", href: "/dashboard/academy/forms", feature: "crmPipelines" },
      { title: "Walk-ins Kiosk", href: "/dashboard/academy/walk-ins", feature: "walkInKiosk" },
      { title: "Demo Sessions", href: "/dashboard/academy/demo-sessions", feature: "crmPipelines" },
      { title: "Campus Students", href: "/dashboard/academy/students/onsite", feature: "coreLms" },
      { title: "Remote Students", href: "/dashboard/academy/students/online", feature: "coreLms" },
      { title: "Global Leaderboard", href: "/dashboard/academy/leaderboard", feature: "coreLms" },
      { title: "Campus Faculty", href: "/dashboard/academy/educators/onsite", feature: "coreLms" },
      { title: "Office Hours", href: "/dashboard/studio/office-hours", feature: "mentorship" },
      { title: "Remote Instructors", href: "/dashboard/academy/educators/online", feature: "coreLms" },
      { title: "Fee Collection", href: "/dashboard/academy/fees", feature: "feesEmi" },
      { title: "Student EMI Plans", href: "/dashboard/academy/fees/emi", feature: "feesEmi" },
      { title: "Batches", href: "/dashboard/academy/batches", feature: "coreLms" },
      { title: "Live Projects", href: "/dashboard/academy/projects", feature: "coreLms" },
      { title: "Internships", href: "/dashboard/academy/internships", feature: "coreLms" },
      { title: "Placements", href: "/dashboard/academy/placements", feature: "coreLms" },
      { title: "Marketplace", href: "/dashboard/academy/marketplace", feature: "whitelabel" },
      { title: "Visual Automations", href: "/dashboard/academy/automation", feature: "whatsappAuto" },
      { title: "WhatsApp Templates", href: "/dashboard/academy/whatsapp", feature: "whatsappAuto" },
      { title: "Coupons & Offers", href: "/dashboard/academy/coupons", feature: "coreLms" },
      { title: "Storefront Theme", href: "/dashboard/website/theme", feature: "whitelabel" },
      { title: "1:1 Consultations", href: "/dashboard/academy/consultations", feature: "mentorship" },
      { title: "Webinars & Funnels", href: "/dashboard/academy/webinars", feature: "webinars" },
      { title: "Social Community", href: "/dashboard/academy/community", feature: "coreLms" },
      { title: "Referrals", href: "/dashboard/academy/referrals", feature: "referrals" },
      { title: "AI Risk Engine", href: "/dashboard/academy/risk", feature: "callIntelligence" },
    ],
  },

  {
    title: "Teaching Studio",
    href: "/dashboard/studio",
    icon: GraduationCap,
    roles: ["SUPER_ADMIN", "MANAGER", "STAFF"],
  },
  {
    title: "Student Portal",
    href: "/student/assignments",
    icon: BookOpen,
    roles: ["SUPER_ADMIN", "MANAGER", "STAFF", "STUDENT", "INTERN"],
    children: [
      { title: "Assignments & Submissions", href: "/student/assignments" },
      { title: "Digital Passport", href: "/student/cuid-student-demo" },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN"],
    children: [
      { title: "Branding & Theme", href: "/dashboard/settings", feature: "whitelabel" },
      { title: "Storefront Builder", href: "/dashboard/website/theme", feature: "whitelabel" },
      { title: "Roles & Permissions", href: "/dashboard/settings/roles" },
      { title: "Finance & Currency", href: "/dashboard/settings/finance" },
      { title: "Integrations", href: "/dashboard/settings/integrations" },
    ],
  },
]

export const getNavItemsByRole = (
  role: string, 
  customPermissions?: string[], 
  planFeatures?: Record<string, boolean | undefined> | null,
  isSuperAdmin: boolean = false
) => {
  return navigation
    .filter((item) => {
      if (customPermissions && customPermissions.length > 0 && item.resource) {
        if (!customPermissions.includes(item.resource)) return false
      }
      if (item.feature && !isSuperAdmin && planFeatures && planFeatures[item.feature] === false) {
        return false
      }
      return item.roles.includes(role as Role)
    })
    .map((item) => {
      if (!item.children) return item
      
      const filteredChildren = item.children.filter((child) => {
        if (!isSuperAdmin && planFeatures && child.feature) {
          // If the feature is explicitly false in the subscription plan, do not show it
          return planFeatures[child.feature] !== false
        }
        return true
      })

      return {
        ...item,
        children: filteredChildren
      }
    })
}
