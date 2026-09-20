"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Building2, Users, GraduationCap, UserCheck, RefreshCw, DollarSign, 
  TrendingUp, Plus, ArrowUpRight, Activity, Layers, ShieldCheck, CheckCircle2
} from "lucide-react"

export default function SuperAdminDashboardPage() {
  const stats = [
    { title: "Total Academies", value: "24", sub: "+3 this month", color: "text-teal-700", bg: "bg-teal-50 border-teal-200", icon: Building2 },
    { title: "Active Academies", value: "21", sub: "87.5% operational rate", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: ShieldCheck },
    { title: "Total Students", value: "14,850", sub: "Across all tenants", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: GraduationCap },
    { title: "Total Instructors", value: "312", sub: "Active faculty members", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: UserCheck },
    { title: "Active Subscriptions", value: "21", sub: "Growth & Enterprise plans", color: "text-teal-700", bg: "bg-teal-50 border-teal-200", icon: RefreshCw },
    { title: "Monthly Revenue (MRR)", value: "₹4,85,000", sub: "+22.4% vs last month", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: DollarSign },
    { title: "New Academies", value: "3", sub: "Onboarded in Sep 2026", color: "text-sky-700", bg: "bg-sky-50 border-sky-200", icon: Plus },
    { title: "Platform SLA Uptime", value: "99.98%", sub: "Global Edge Active", color: "text-teal-700", bg: "bg-teal-50 border-teal-200", icon: Activity }
  ]

  const recentActivities = [
    { academy: "Apex Tech Institute", action: "Upgraded to Enterprise Plan (₹4,999/mo)", time: "10 mins ago", type: "upgrade" },
    { academy: "Stark Photography Academy", action: "Renewed Growth Plan subscription", time: "1 hour ago", type: "renewal" },
    { academy: "Quantum Coding Labs", action: "New tenant onboarded (14-Day Free Trial)", time: "3 hours ago", type: "new" },
    { academy: "Global Civil Services Hub", action: "Custom CNAME domain learn.civilserviceshub.in verified", time: "5 hours ago", type: "domain" },
    { academy: "DesignCraft Studio", action: "Payment of ₹2,499 received via Razorpay", time: "1 day ago", type: "payment" },
  ]

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header Banner */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              Echo SAAS CONTROL CENTER
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-200 flex items-center gap-1">
               Platform Super Admin
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Platform Overview Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Real-time SaaS operational health, tenant growth, and platform revenue metrics.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/super-admin/academies" 
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add New Academy
          </Link>
        </div>
      </div>

      {/* 8 Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">{s.title}</span>
                <div className={`p-2 rounded-xl border ${s.bg} ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{s.value}</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">{s.sub}</div>
            </div>
          )
        })}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions & Platform Modules */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" /> Core SaaS Control Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickModuleLink 
                title="Academies Management" 
                desc="Manage 24 onboarded customer academies, active subscriptions & logins." 
                href="/dashboard/super-admin/academies"
                tag="24 Academies"
              />
              <QuickModuleLink 
                title="Plans & Billing" 
                desc="Configure FREE, STARTER, GROWTH & ENTERPRISE pricing tiers & limits." 
                href="/dashboard/super-admin/plans"
                tag="4 Pricing Tiers"
              />
              <QuickModuleLink 
                title="Subscriptions Lifecycle" 
                desc="Track active, trial, expired & cancelled tenant subscriptions." 
                href="/dashboard/super-admin/subscriptions"
                tag="21 Active"
              />
              <QuickModuleLink 
                title="Payments & Revenue" 
                desc="Platform transactions, Razorpay/Stripe invoices & payment gateway audit." 
                href="/dashboard/super-admin/payments"
                tag="₹4.85L MRR"
              />
              <QuickModuleLink 
                title="Branding & White Label" 
                desc="Global Echo logo, colors, custom domain CNAMEs & remove branding." 
                href="/dashboard/super-admin/branding"
                tag="White Label Engine"
              />
              <QuickModuleLink 
                title="Platform Integrations" 
                desc="Razorpay, Stripe, WhatsApp Grafty, Zoom, Meet & Storage config." 
                href="/dashboard/super-admin/integrations"
                tag="8 Enabled"
              />
            </div>
          </div>
        </div>

        {/* Recent SaaS Activity Feed */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" /> Recent SaaS Activity
          </h2>
          <div className="space-y-5">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <div>
                  <div className="font-extrabold text-slate-900 text-xs">{act.academy}</div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{act.action}</p>
                  <span className="text-[10px] text-slate-400 font-mono font-medium mt-1 block">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

function QuickModuleLink({ title, desc, href, tag }: { title: string; desc: string; href: string; tag: string }) {
  return (
    <Link 
      href={href} 
      className="p-4 rounded-2xl bg-slate-50 hover:bg-teal-50/60 border border-slate-200 hover:border-teal-200 transition-all group relative block"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">{title}</span>
        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      <span className="inline-block mt-3 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">{tag}</span>
    </Link>
  )
}
