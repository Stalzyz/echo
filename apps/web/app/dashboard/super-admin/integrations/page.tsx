"use client"

import { useState } from "react"
import { 
  Cpu, CheckCircle2, AlertCircle, Settings2, Key, 
  Video, MessageSquare, Mail, HardDrive, BarChart3, DollarSign, ShieldCheck
} from "lucide-react"
import { toast } from "sonner"

interface IntegrationService {
  id: string
  name: string
  category: "Payment" | "Messaging" | "Video" | "Email" | "Storage" | "Analytics"
  status: "CONNECTED" | "DISCONNECTED"
  apiKey?: string
  lastSync?: string
}

const INITIAL_SERVICES: IntegrationService[] = [
  { id: "int-1", name: "Razorpay Payment Gateway", category: "Payment", status: "CONNECTED", apiKey: "rzp_live_9a87d6f5...", lastSync: "Live" },
  { id: "int-2", name: "Stripe International Payments", category: "Payment", status: "CONNECTED", apiKey: "pk_live_51M0x...", lastSync: "Live" },
  { id: "int-3", name: "WhatsApp Cloud API / Grafty Engine", category: "Messaging", status: "CONNECTED", apiKey: "waba_v16_grafty...", lastSync: "Live" },
  { id: "int-4", name: "Zoom Video SDK", category: "Video", status: "CONNECTED", apiKey: "zoom_jwt_99182...", lastSync: "Live" },
  { id: "int-5", name: "Google Meet API", category: "Video", status: "CONNECTED", apiKey: "gmeet_oauth_client...", lastSync: "Live" },
  { id: "int-6", name: "SendGrid / SMTP Email Server", category: "Email", status: "CONNECTED", apiKey: "SG.99a8b7c6...", lastSync: "Live" },
  { id: "int-7", name: "AWS S3 / Cloudflare R2 Storage", category: "Storage", status: "CONNECTED", apiKey: "AKIAIOSFODNN7...", lastSync: "Live" },
  { id: "int-8", name: "Google Analytics 4 (GA4)", category: "Analytics", status: "CONNECTED", apiKey: "G-99A8B7C6D5", lastSync: "Live" },
]

export default function PlatformIntegrationsPage() {
  const [services, setServices] = useState<IntegrationService[]>(INITIAL_SERVICES)

  const toggleStatus = (id: string, name: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === "CONNECTED" ? "DISCONNECTED" : "CONNECTED"
        toast.success(`Platform integration "${name}" set to ${nextStatus}`)
        return { ...s, status: nextStatus }
      }
      return s
    }))
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              Echo SAAS INTEGRATIONS
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Platform Integrations Hub</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Configure global platform keys for payment gateways, messaging, video conferencing, SMTP email & cloud storage.</p>
        </div>
      </div>

      {/* Grid of Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {services.map(s => (
          <div key={s.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider border border-slate-200">
                  {s.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  s.status === "CONNECTED" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
                }`}>
                  {s.status}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 mb-2">{s.name}</h3>
              <p className="text-xs text-slate-400 font-mono mb-4 truncate">{s.apiKey}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {s.lastSync}
              </span>
              <button 
                onClick={() => toggleStatus(s.id, s.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  s.status === "CONNECTED" ? "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700" : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {s.status === "CONNECTED" ? "Configure" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
