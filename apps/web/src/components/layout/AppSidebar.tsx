"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/context/OrganizationContext";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
  Laptop,
  Calendar,
  Trophy,
  DollarSign,
  Video,
  MessageSquare,
  ClipboardList,
  Briefcase,
  Award,
  TrendingUp,
  Settings,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  ShieldAlert,
  Percent,
  Building2,
  Globe,
  CreditCard,
  RefreshCw,
  Receipt,
  Palette,
  Cpu,
  BarChart3,
  LogOut,
  Phone,
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  children?: { title: string; href: string; icon?: React.ElementType }[];
}

const superAdminSidebarGroups: { groupName: string; items: SidebarItem[] }[] = [
  {
    groupName: "GECHO Super Admin",
    items: [
      { title: "Dashboard", href: "/dashboard/super-admin", icon: LayoutDashboard },
      { title: "Academies", href: "/dashboard/super-admin/academies", icon: Building2 },
      { title: "Users", href: "/dashboard/super-admin/users", icon: Users },
      { title: "Plans & Billing", href: "/dashboard/super-admin/plans", icon: CreditCard },
      { title: "Subscriptions", href: "/dashboard/super-admin/subscriptions", icon: RefreshCw },
      { title: "Payments", href: "/dashboard/super-admin/payments", icon: Receipt },
      { title: "Courses", href: "/dashboard/super-admin/courses", icon: BookOpen },
      { title: "Branding", href: "/dashboard/super-admin/branding", icon: Palette },
      { title: "Integrations", href: "/dashboard/super-admin/integrations", icon: Cpu },
      { title: "Reports", href: "/dashboard/super-admin/reports", icon: BarChart3 },
      { title: "Settings", href: "/dashboard/super-admin/settings", icon: Settings },
    ],
  },
];

const sidebarGroups: { groupName: string; items: SidebarItem[] }[] = [
  {
    groupName: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    groupName: "Academy Admin",
    items: [
      {
        title: "Admissions CRM",
        href: "/dashboard/academy/admissions",
        icon: Users,
      },
      {
        title: "Call Intelligence",
        href: "/dashboard/academy/calls",
        icon: Phone,
      },
      {
        title: "Form Builder",
        href: "/dashboard/academy/forms",
        icon: FileText,
      },
      {
        title: "Walk-ins Kiosk",
        href: "/dashboard/academy/walk-ins",
        icon: Laptop,
      },
      {
        title: "Demo Sessions",
        href: "/dashboard/academy/demo-sessions",
        icon: Calendar,
      },
      {
        title: "Campus Students",
        href: "/dashboard/academy/students/onsite",
        icon: GraduationCap,
      },
      {
        title: "Remote Students",
        href: "/dashboard/academy/students/online",
        icon: GraduationCap,
      },
      {
        title: "Campus Faculty",
        href: "/dashboard/academy/educators/onsite",
        icon: Users,
      },
      {
        title: "Remote Instructors",
        href: "/dashboard/academy/educators/online",
        icon: Users,
      },
      {
        title: "Fee Collection",
        href: "/dashboard/academy/fees",
        icon: DollarSign,
      },
      {
        title: "Student EMI Plans",
        href: "/dashboard/academy/fees/emi",
        icon: DollarSign,
      },
      {
        title: "Batches & Courses",
        href: "/dashboard/academy/batches",
        icon: ClipboardList,
      },
      {
        title: "Live Projects",
        href: "/dashboard/academy/projects",
        icon: Briefcase,
      },
      {
        title: "Internships",
        href: "/dashboard/academy/internships",
        icon: Briefcase,
      },
      {
        title: "Placements",
        href: "/dashboard/academy/placements",
        icon: Award,
      },
      {
        title: "Webinars & Funnels",
        href: "/dashboard/academy/webinars",
        icon: Video,
      },
      {
        title: "Social Community",
        href: "/dashboard/academy/community",
        icon: MessageSquare,
      },
      {
        title: "WhatsApp Messages",
        href: "/dashboard/academy/whatsapp",
        icon: MessageSquare,
      },
      {
        title: "Visual Automations",
        href: "/dashboard/academy/automation",
        icon: Layers,
      },
      {
        title: "Global Leaderboard",
        href: "/dashboard/academy/leaderboard",
        icon: Trophy,
      },
    ],
  },
  {
    groupName: "Studio & Content",
    items: [
      {
        title: "Teaching Studio",
        href: "/dashboard/studio",
        icon: BookOpen,
        children: [
          { title: "Studio Dashboard", href: "/dashboard/studio" },
          { title: "My Students", href: "/dashboard/studio/students" },
          { title: "My Courses", href: "/dashboard/studio/courses" },
          { title: "Course Builder", href: "/dashboard/studio/course-builder" },
          { title: "Quiz Builder", href: "/dashboard/studio/quiz-builder" },
          { title: "Assignments", href: "/dashboard/studio/assignments" },
          { title: "Certificates", href: "/dashboard/studio/certificates" },
          { title: "Analytics", href: "/dashboard/studio/analytics" },
          { title: "Live Studio", href: "/dashboard/studio/live" },
          { title: "Office Hours", href: "/dashboard/studio/office-hours" },
        ],
      },
      {
        title: "Office Hours",
        href: "/dashboard/studio/office-hours",
        icon: Calendar,
      },
    ],
  },
  {
    groupName: "System",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        children: [
          { title: "Branding & Theme", href: "/dashboard/settings" },
          { title: "Company Details", href: "/dashboard/settings/organization" },
          { title: "Finance & Currency", href: "/dashboard/settings/finance" },
          { title: "Roles & Permissions", href: "/dashboard/settings/roles" },
          { title: "Integrations & API", href: "/dashboard/settings/integrations" },
          { title: "Audit Logs", href: "/dashboard/settings/audit-logs" },
          { title: "Security & Auth", href: "/dashboard/settings/security" },
        ],
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const org = useOrganization();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Settings: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const scrollToGroup = (groupId: string) => {
    setTimeout(() => {
      const el = document.getElementById(groupId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  useEffect(() => {
    const handleAnchor = (e: Event) => {
      const customEvt = e as CustomEvent<string>;
      const sectionName = customEvt.detail;
      let groupId = "";

      if (sectionName === "Main" || sectionName === "Dashboard") {
        groupId = "sidebar-group-main";
      } else if (sectionName === "Academy Admin") {
        groupId = "sidebar-group-academy-admin";
      } else if (sectionName === "Teaching Studio" || sectionName === "Studio & Content") {
        groupId = "sidebar-group-studio-content";
        setOpenGroups((prev) => ({ ...prev, "Teaching Studio": true }));
      } else if (sectionName === "Settings" || sectionName === "System") {
        groupId = "sidebar-group-system";
        setOpenGroups((prev) => ({ ...prev, Settings: true }));
      }

      if (groupId) {
        scrollToGroup(groupId);
      }
    };

    window.addEventListener("anchor-sidebar", handleAnchor);
    return () => {
      window.removeEventListener("anchor-sidebar", handleAnchor);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/dashboard") {
      scrollToGroup("sidebar-group-main");
    } else if (pathname?.startsWith("/dashboard/academy")) {
      scrollToGroup("sidebar-group-academy-admin");
    } else if (pathname?.startsWith("/dashboard/studio")) {
      setOpenGroups((prev) => ({ ...prev, "Teaching Studio": true }));
      scrollToGroup("sidebar-group-studio-content");
    } else if (pathname?.startsWith("/dashboard/settings")) {
      setOpenGroups((prev) => ({ ...prev, Settings: true }));
      scrollToGroup("sidebar-group-system");
    }
  }, [pathname]);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("sidebar_collapsed", String(nextState));
  };

  const toggleSubgroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isSuperAdminPlatform =
    (session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "Super Admin") &&
    !session?.user?.impersonatedBySuperAdmin;

  const activeGroups =
    isSuperAdminPlatform || pathname?.startsWith("/dashboard/super-admin")
      ? superAdminSidebarGroups
      : sidebarGroups;

  const orgName = isSuperAdminPlatform
    ? "Echo Super Admin"
    : org?.name && !org.name.includes("Grekam")
    ? org.name
    : "Echo LMS";

  return (
    <aside
      className={cn(
        "hidden md:flex h-full bg-white border-r border-slate-200 flex-col justify-between shrink-0 transition-all duration-300 relative z-40 select-none shadow-xs",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <Link
          href={isSuperAdminPlatform ? "/dashboard/super-admin" : "/dashboard"}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs overflow-hidden p-1">
            <img
              src={isSuperAdminPlatform ? "/echo_logo.png" : org?.logoUrl || org?.academyLogoUrl || "/echo_logo.png"}
              alt={orgName}
              className="w-full h-full object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-black tracking-tight text-slate-900 truncate">
                {orgName}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wide truncate",
                  isSuperAdminPlatform ? "text-amber-600" : "text-teal-600"
                )}
              >
                {isSuperAdminPlatform ? "Platform Control" : "Enterprise LMS"}
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div id="sidebar-scroll-container" className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
        {activeGroups.map((group, idx) => {
          const groupId = `sidebar-group-${group.groupName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
          return (
            <div key={idx} id={groupId} className="space-y-1 scroll-mt-4">
              {!isCollapsed && (
                <div className="px-3 mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {group.groupName}
                </div>
              )}

            {group.items.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isSubOpen = openGroups[item.title];

              return (
                <div key={item.title} className="space-y-1">
                  {hasChildren && !isCollapsed ? (
                    <button
                      onClick={() => toggleSubgroup(item.title)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-700 hover:bg-slate-100",
                        isActive && "bg-slate-50 text-primary"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-slate-500" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        className={cn("w-3.5 h-3.5 transition-transform", isSubOpen && "rotate-180")}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      title={isCollapsed ? item.title : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group relative",
                        isActive
                          ? "bg-primary text-white shadow-sm shadow-primary/20"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                      style={isActive ? { backgroundColor: "var(--primary)" } : {}}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                        )}
                      />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  )}

                  {/* Render Subchildren if expanded */}
                  {hasChildren && isSubOpen && !isCollapsed && (
                    <div className="pl-7 space-y-1 pt-1 border-l-2 border-slate-100 ml-5">
                      {item.children?.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "block px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                              isSubActive
                                ? "bg-primary/10 text-primary font-bold"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-slate-200 bg-slate-50 shrink-0 space-y-2">
          <button
            onClick={() => signOut({ callbackUrl: isSuperAdminPlatform ? "/super-admin/login" : "/auth/login" })}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors shadow-2xs"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="truncate">Sign Out</span>
          </button>
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500">
              {isSuperAdminPlatform ? "Echo Control Plane" : "Echo OS Engine v2.5"}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-slate-200 bg-slate-50 flex flex-col items-center gap-2 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: isSuperAdminPlatform ? "/super-admin/login" : "/auth/login" })}
            title="Sign Out"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
        </div>
      )}
    </aside>
  );
}
