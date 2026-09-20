"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Layers, LayoutDashboard, Building2, Package, FileText, 
  Globe, Settings, ExternalLink, ShieldCheck
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "Vendors & Academies", href: "/dashboard/vendors", icon: Building2 },
    { title: "Package Builder", href: "/dashboard/packages", icon: Package },
    { title: "Payments & Invoices", href: "/dashboard/invoices", icon: FileText },
    { title: "Whitelabel & Domains", href: "/dashboard/whitelabel", icon: Globe },
    { title: "System Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 z-40 shadow-xs select-none">
      
      {/* Top Brand Header */}
      <div>
        <div className="h-20 px-6 border-b border-slate-200/80 flex items-center justify-between bg-white">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <Layers className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">Echo <span className="text-teal-600">Admin</span></span>
              <span className="block text-[9px] text-teal-700 font-bold uppercase tracking-wider">Super Admin • Port 4400</span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              SaaS Management
            </div>
            <nav className="space-y-1 font-semibold text-sm">
              {navItems.map(item => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                      isActive 
                        ? "bg-teal-600 text-white font-extrabold shadow-sm shadow-teal-600/20" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{item.title}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Public Platform
            </div>
            <nav className="space-y-1 font-semibold text-sm">
              <Link
                href="/"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                  pathname === "/" 
                    ? "bg-teal-600 text-white font-extrabold shadow-sm" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                
                <span>Public Landing Page</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom User & Cross-App Link */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
        <a 
          href="http://localhost:4444/dashboard" 
          target="_blank" 
          rel="noreferrer" 
          className="w-full py-2.5 px-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-between shadow-xs"
        >
          <span>Academy CRM (Port 4444)</span>
          <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
        </a>

        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
            SA
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">Stalin Kumar</div>
            <div className="text-[9px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200/80 inline-block mt-0.5">
              SUPER ADMIN
            </div>
          </div>
        </div>
      </div>

    </aside>
  )
}
