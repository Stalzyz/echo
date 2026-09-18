"use client"

import { 
  Activity, Users, DollarSign, TrendingUp, AlertCircle, 
  GraduationCap, Sparkles, Building2, Layers, CheckCircle2, ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function SuperAdminOverviewPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header Banner */}
      <div className="pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              STANDALONE SUPER ADMIN SUITE • PORT 4400
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" /> Multi-Tenant Control
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            SaaS Platform Overview
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Global operational health, MRR growth, vendor provisioning, and custom domain routing.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/vendors" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-teal-600/20 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Manage Vendors
          </Link>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">Monthly Recurring Revenue</h3>
            <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono tracking-tight text-slate-900 mb-1">$14,850</div>
          <div className="text-xs font-bold text-emerald-700">+22.4% vs last month</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">Active Academies</h3>
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono tracking-tight text-slate-900 mb-1">65 Vendors</div>
          <div className="text-xs font-bold text-slate-500">58 Active • 7 In Trial</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">Total Hosted Learners</h3>
            <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono tracking-tight text-slate-900 mb-1">124,500</div>
          <div className="text-xs font-bold text-slate-500">Across 65 tenants</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">Custom Domains</h3>
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono tracking-tight text-slate-900 mb-1">52 Verified</div>
          <div className="text-xs font-bold text-emerald-700">SSL Auto-Provisioned</div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/dashboard/vendors" className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-teal-400 hover:shadow-md transition-all group">
          <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center justify-between">
            Vendor Directory <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-500">Onboard new academies, assign plans, suspend or reactivate accounts.</p>
        </Link>

        <Link href="/dashboard/packages" className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-teal-400 hover:shadow-md transition-all group">
          <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center justify-between">
            Package Builder <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-500">Configure Starter, Pro, Enterprise tiers, student caps, and feature toggles.</p>
        </Link>

        <Link href="/dashboard/invoices" className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-teal-400 hover:shadow-md transition-all group">
          <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center justify-between">
            Payments & Invoices <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-500">View tax invoices, payment gateway receipts, and print GST bills.</p>
        </Link>

        <Link href="/dashboard/whitelabel" className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-teal-400 hover:shadow-md transition-all group">
          <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center justify-between">
            Whitelabel Engine <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-500">Check CNAME DNS resolution, SSL certificates, and custom branding.</p>
        </Link>
      </div>

    </div>
  )
}
