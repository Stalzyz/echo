"use client"

import { useState } from "react"
import { BookOpen, Users, DollarSign, Award, Video, MessageSquare, Shield, Sparkles, CheckCircle2, TrendingUp, Layers, Flame, ArrowRight, Zap, RefreshCw } from "lucide-react"
import { BragGeneratorModal, BragData } from "@/components/BragGeneratorModal"

export default function PublicDemoDashboardPage() {
  const [bragModal, setBragModal] = useState<{ isOpen: boolean; data: BragData }>({
    isOpen: false,
    data: { type: "COURSE", title: "" }
  })

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500 selection:text-white flex flex-col font-sans">
      
      {/* Top Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-teal-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-white text-base">
              e
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">echo</span>
              <span className="text-[10px] font-mono font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">
                PUBLIC DEMO SHOWCASE
              </span>
            </div>
            <p className="text-xs text-slate-400">Academy Operating System • All Modules Unlocked</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE DEMO ACTIVE
          </div>
          <button
            onClick={() =>
              setBragModal({
                isOpen: true,
                data: {
                  type: "COURSE",
                  title: "Fullstack Web & AI Masterclass",
                  authorOrAcademy: "echo Academy",
                  priceOrId: "₹24,999/yr",
                  highlights: ["Webinar Conversion Funnels", "Customizable Packages", "Automated EMI Rules"],
                  linkUrl: "https://echo.grekam.in"
                }
              })
            }
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" /> ⚡ Launch Brag Modal
          </button>
        </div>
      </header>

      {/* Main Showcase Container */}
      <main className="p-8 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Section 1: Super Admin & Revenue Metrics */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-purple-400" /> Super Admin & Platform Metrics
            </h2>
            <span className="text-xs text-slate-400 font-mono">Real-time Academy Telemetry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
              <div className="text-xs text-slate-400 font-medium mb-1">Active Academies</div>
              <div className="text-3xl font-black text-white">142</div>
              <div className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1">
                ↑ +18% this month
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
              <div className="text-xs text-slate-400 font-medium mb-1">Monthly Recurring Revenue</div>
              <div className="text-3xl font-black text-teal-400">₹18,45,000</div>
              <div className="text-xs text-slate-400 mt-2 font-mono">Yearly Subscriptions (+18% GST)</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
              <div className="text-xs text-slate-400 font-medium mb-1">Total Enrolled Students</div>
              <div className="text-3xl font-black text-purple-400">12,480</div>
              <div className="text-xs text-purple-300/70 mt-2 font-mono">Mobile App & Web PWA</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
              <div className="text-xs text-slate-400 font-medium mb-1">Webinar Conversion Rate</div>
              <div className="text-3xl font-black text-pink-400">24.8%</div>
              <div className="text-xs text-pink-300/70 mt-2 font-mono">Timed Pitch CTA Offers</div>
            </div>
          </div>
        </section>

        {/* Section 2: Customizable Yearly Packaging Module */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-t border-slate-900 pt-8">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Layers className="w-5 h-5 text-teal-400" /> Customizable Yearly Packaging Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">Configure module access, offer pricing, and custom payment links per tier.</p>
            </div>
            <span className="text-xs font-mono font-bold bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full border border-teal-500/30">
              YEARLY + 18% GST ONLY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Package 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-slate-400 font-mono">STARTER ACADEMY</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">1 YEAR</span>
                </div>
                <div className="text-2xl font-extrabold text-white mb-1">₹14,999<span className="text-xs font-normal text-slate-400">/yr</span></div>
                <div className="text-[10px] text-slate-500 font-mono mb-4">+ 18% GST (List: ₹24,999)</div>

                <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Core LMS & Video DRM</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Student Web & PWA Portal</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Email Automation & Drips</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>3 Modules Enabled</span>
                <span className="text-teal-400 font-bold">Custom Payment Link</span>
              </div>
            </div>

            {/* Package 2 Featured */}
            <div className="bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/40 rounded-3xl p-6 flex flex-col justify-between relative shadow-xl shadow-purple-500/10">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-purple-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg">
                MOST POPULAR
              </div>

              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-purple-300 font-mono">PRO GROWTH ENGINE</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded">1 YEAR</span>
                </div>
                <div className="text-2xl font-extrabold text-white mb-1">₹39,999<span className="text-xs font-normal text-purple-300">/yr</span></div>
                <div className="text-[10px] text-purple-300/70 font-mono mb-4">+ 18% GST (List: ₹59,999)</div>

                <div className="space-y-2 text-xs text-slate-200 border-t border-purple-500/20 pt-4">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> All Starter Features</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Webinars & Timed Pitch CTAs</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> WhatsApp 1-Tap WABA Engine</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Student Fees & Automated EMI</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center justify-between text-xs font-mono">
                <span className="text-purple-300">8 Modules Enabled</span>
                <span className="text-purple-400 font-bold">Custom Deal Override</span>
              </div>
            </div>

            {/* Package 3 Whitelabel */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-slate-400 font-mono">ENTERPRISE WHITELABEL</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">1 YEAR</span>
                </div>
                <div className="text-2xl font-extrabold text-white mb-1">₹79,999<span className="text-xs font-normal text-slate-400">/yr</span></div>
                <div className="text-[10px] text-slate-500 font-mono mb-4">+ 18% GST (List: ₹1,19,999)</div>

                <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full Whitelabel & Custom SSL</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 12 Controllable Modules</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Offline Kiosk & QR Attendance</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>12 Modules Unlocked</span>
                <span className="text-teal-400 font-bold">Dedicated SLA Support</span>
              </div>
            </div>

          </div>
        </section>

        {/* Section 3: Webinar & Conversion Funnel Engine */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-t border-slate-900 pt-8">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Video className="w-5 h-5 text-pink-400" /> Webinar & Funnel Conversion Center
              </h2>
              <p className="text-xs text-slate-400 mt-1">Live broadcasts & 24/7 evergreen automated funnel loops.</p>
            </div>
            <span className="text-xs font-mono text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/30">
              TIMED PITCH CTA ACTIVE
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-pink-400 font-bold">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                LIVE WEBINAR: "Scaling AI SaaS Products in 2026"
              </div>
              <p className="text-sm text-slate-300 max-w-xl">
                Evergreen 24/7 loop mode active. Timed course offer popup configured at minute 45 with coupon <span className="font-mono text-amber-400 font-bold">WEBINAR20</span>.
              </p>
            </div>

            <button
              onClick={() =>
                setBragModal({
                  isOpen: true,
                  data: {
                    type: "COURSE",
                    title: "Scaling AI SaaS Products Masterclass",
                    authorOrAcademy: "echo Live Funnel",
                    priceOrId: "₹19,999",
                    highlights: ["24/7 Automated Evergreen Funnel", "Timed Pitch CTA Offer Popup", "1-Tap WhatsApp Lead Alerts"],
                    linkUrl: "https://echo.grekam.in/w/masterclass"
                  }
                })
              }
              className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4" /> ⚡ Brag Funnel Reel
            </button>
          </div>
        </section>

        {/* Section 4: Student Certificates & Verified Brag Engine */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-t border-slate-900 pt-8">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Award className="w-5 h-5 text-amber-400" /> Student Certificates & Brag Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">1-click social share launch cards with verification QR codes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-mono uppercase bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                  VERIFIED CREDENTIAL
                </span>
                <h3 className="font-bold text-white text-base mt-2">Fullstack AI & Web Engineering Certificate</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">ID: ECHO-2026-AI-9912 • Alex Martin</p>
              </div>

              <button
                onClick={() =>
                  setBragModal({
                    isOpen: true,
                    data: {
                      type: "CERTIFICATE",
                      title: "Fullstack AI & Web Engineering Certificate",
                      authorOrAcademy: "Grekam Academy of Technology",
                      priceOrId: "ECHO-2026-AI-9912",
                      highlights: ["100% Industry Verified", "Multi-Tenant SaaS Signed", "98% Capstone Rating"],
                      linkUrl: "https://echo.grekam.in/verify/ECHO-2026-AI-9912"
                    }
                  })
                }
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" /> ⚡ Brag Card
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-teal-400 font-mono uppercase bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/30">
                  VERIFIED CREDENTIAL
                </span>
                <h3 className="font-bold text-white text-base mt-2">Advanced Product Design & Systems</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">ID: ECHO-2026-UX-4091 • Sarah Jenkins</p>
              </div>

              <button
                onClick={() =>
                  setBragModal({
                    isOpen: true,
                    data: {
                      type: "CERTIFICATE",
                      title: "Advanced Product Design & Systems",
                      authorOrAcademy: "echo Studio Academy",
                      priceOrId: "ECHO-2026-UX-4091",
                      highlights: ["Figma Design Systems", "Micro-animations", "Glassmorphic UX"],
                      linkUrl: "https://echo.grekam.in/verify/ECHO-2026-UX-4091"
                    }
                  })
                }
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" /> ⚡ Brag Card
              </button>
            </div>
          </div>
        </section>

      </main>

      <BragGeneratorModal
        isOpen={bragModal.isOpen}
        onClose={() => setBragModal(prev => ({ ...prev, isOpen: false }))}
        data={bragModal.data}
      />
    </div>
  )
}
