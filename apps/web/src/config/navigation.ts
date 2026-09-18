import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Bell,
  Settings,
} from "lucide-react"

export type Role = "SUPER_ADMIN" | "MANAGER" | "STAFF" | "CLIENT" | "STUDENT" | "VENDOR" | "INTERN"

export interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: Role[]
  resource?: string
  children?: { title: string; href: string }[]
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
      { title: "Admissions CRM", href: "/dashboard/academy/admissions" },
      { title: "Form Builder", href: "/dashboard/academy/forms" },
      { title: "Walk-ins Kiosk", href: "/dashboard/academy/walk-ins" },
      { title: "Demo Sessions", href: "/dashboard/academy/demo-sessions" },
      { title: "Campus Students",   href: "/dashboard/academy/students/onsite" },
      { title: "Remote Students",   href: "/dashboard/academy/students/online" },
      { title: "Global Leaderboard", href: "/dashboard/academy/leaderboard" },
      { title: "Campus Faculty",   href: "/dashboard/academy/educators/onsite" },
      { title: "Office Hours", href: "/dashboard/studio/office-hours" },
      { title: "Remote Instructors",   href: "/dashboard/academy/educators/online" },
      { title: "Fee Collection",   href: "/dashboard/academy/fees" },
      { title: "Batches",    href: "/dashboard/academy/batches" },
      { title: "Live Projects", href: "/dashboard/academy/projects" },
      { title: "Internships", href: "/dashboard/academy/internships" },
      { title: "Placements", href: "/dashboard/academy/placements" },
      { title: "Marketplace", href: "/dashboard/academy/marketplace" },
      { title: "Visual Automations", href: "/dashboard/academy/automation" },
      { title: "WhatsApp Templates", href: "/dashboard/academy/whatsapp" },
      { title: "Coupons & Offers", href: "/dashboard/academy/coupons" },
      { title: "Storefront Theme", href: "/dashboard/website/theme" },
      { title: "1:1 Consultations", href: "/dashboard/academy/consultations" },
      { title: "Student EMI Plans", href: "/dashboard/academy/fees/emi" },
      { title: "Webinars & Funnels", href: "/dashboard/academy/webinars" },
      { title: "Social Community", href: "/dashboard/academy/community" },
      { title: "Referrals", href: "/dashboard/academy/referrals" },
      { title: "AI Risk Engine", href: "/dashboard/academy/risk" },
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
      { title: "Branding & Theme", href: "/dashboard/settings" },
      { title: "Storefront Builder", href: "/dashboard/website/theme" },
      { title: "Roles & Permissions", href: "/dashboard/settings/roles" },
      { title: "Finance & Currency", href: "/dashboard/settings/finance" },
      { title: "Integrations", href: "/dashboard/settings/integrations" },
    ],
  },
]

export const getNavItemsByRole = (role: string, customPermissions?: string[]) => {
  return navigation.filter((item) => {
    if (customPermissions && customPermissions.length > 0 && item.resource) {
      return customPermissions.includes(item.resource)
    }
    return item.roles.includes(role as Role)
  })
}
