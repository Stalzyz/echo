"use client"

import { useState } from  "react"
import { Globe, ShieldCheck, RefreshCw, Palette, CheckCircle2, AlertCircle, ExternalLink, Edit3, Image as ImageIcon, Copy, Check, X, Loader2 } from  "lucide-react"
import { toast } from  "sonner"

interface WhitelabelDomain {
  id: string
  academyName: string
  subdomain: string
  customDomain: string
  cnameVerified: boolean
  sslStatus: "ACTIVE" | "PROVISIONING" | "EXPIRED"
  primaryColor: string
  logoUrl?: string
  lastVerifiedAt: string
}

const INITIAL_DOMAINS: WhitelabelDomain[] = [
  {
    id: "wl-1",
    academyName: "Apex Tech Institute",
    subdomain: "apex.echolms.com",
    customDomain: "learn.apextech.edu",
    cnameVerified: true,
    sslStatus: "ACTIVE",
    primaryColor: "#0d9488",
    lastVerifiedAt: "2026-09-17 14:30"
  },
  {
    id: "wl-2",
    academyName: "Stark Photography Academy",
    subdomain: "starkphoto.echolms.com",
    customDomain: "academy.starkphoto.com",
    cnameVerified: true,
    sslStatus: "ACTIVE",
    primaryColor: "#f59e0b",
    lastVerifiedAt: "2026-09-16 09:12"
  },
  {
    id: "wl-3",
    academyName: "Quantum Coding Labs",
    subdomain: "quantum.echolms.com",
    customDomain: "learn.quantumlabs.io",
    cnameVerified: false,
    sslStatus: "PROVISIONING",
    primaryColor: "#6366f1",
    lastVerifiedAt: "2026-09-18 01:00"
  },
  {
    id: "wl-4",
    academyName: "Global Civil Services Hub",
    subdomain: "civilservices.echolms.com",
    customDomain: "learn.civilserviceshub.in",
    cnameVerified: true,
    sslStatus: "ACTIVE",
    primaryColor: "#059669",
    lastVerifiedAt: "2026-09-15 18:45"
  }
]

export default function WhitelabelPage() {
  const [domains, setDomains] = useState<WhitelabelDomain[]>(INITIAL_DOMAINS)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [editingDomain, setEditingDomain] = useState<WhitelabelDomain | null>(null)
  const [copied, setCopied] = useState(false)

  const handleReverify = (id: string, domainName: string) => {
    setVerifyingId(id)
    setTimeout(() => {
      setDomains(prev => prev.map(d => {
        if (d.id === id) {
          return { ...d, cnameVerified: true, sslStatus: "ACTIVE", lastVerifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) }
        }
        return d
      }))
      setVerifyingId(null)
      toast.success(`CNAME DNS record verified for ${domainName}! SSL Certificate ACTIVE.`)
    }, 1200)
  }

  const copyCNAME = () => {
    navigator.clipboard.writeText("cname.echolms.com")
    setCopied(true)
    toast.success("Target CNAME copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              WHITELABEL ENGINE
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Custom Domains & Branding</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Provision CNAME custom domain routing, SSL certificates, and custom branding for vendor academies.</p>
        </div>
      </div>

      {/* CNAME DNS Setup Guide Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Vendor Custom Domain DNS Instructions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Vendors must point their domain's CNAME DNS record to our global SaaS edge router.</p>
            <div className="mt-3 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono text-xs text-slate-800">
              <span className="text-slate-400 font-bold">TYPE: CNAME</span>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-teal-700">TARGET: cname.echolms.com</span>
              <button onClick={copyCNAME} className="ml-auto text-slate-400 hover:text-slate-700">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Auto Let's Encrypt SSL
          </div>
        </div>
      </div>

      {/* Whitelabel Mappings Directory */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-lg">Active Tenant Domain Mappings</h3>
          <span className="text-xs font-bold text-slate-500">{domains.length} Domain Allocations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Academy Vendor</th>
                <th className="py-4 px-6">Default Subdomain</th>
                <th className="py-4 px-6">Whitelabel Custom Domain</th>
                <th className="py-4 px-6">CNAME Status</th>
                <th className="py-4 px-6">SSL Status</th>
                <th className="py-4 px-6">Last Verified</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {domains.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full shrink-0 border border-slate-300" style={{ backgroundColor: d.primaryColor }} />
                      <div className="font-extrabold text-slate-900">{d.academyName}</div>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-slate-500">
                    {d.subdomain}
                  </td>

                  <td className="py-4 px-6">
                    <a href={`https://${d.customDomain}`} target="_blank" rel="noreferrer" className="font-mono font-bold text-teal-600 text-xs hover:underline flex items-center gap-1">
                      {d.customDomain} <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>

                  <td className="py-4 px-6">
                    {d.cnameVerified ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 w-fit">
                        <AlertCircle className="w-3 h-3 text-amber-600" /> Pending DNS
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      d.sslStatus === "ACTIVE" 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}>
                      {d.sslStatus}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-slate-400">
                    {d.lastVerifiedAt}
                  </td>

                  <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleReverify(d.id, d.customDomain)}
                      disabled={verifyingId === d.id}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {verifyingId === d.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      Verify DNS
                    </button>
                    <button 
                      onClick={() => { setEditingDomain(d); toast.info(`Editing branding for ${d.academyName}`); }}
                      className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Branding Theme"
                    >
                      <Palette className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
