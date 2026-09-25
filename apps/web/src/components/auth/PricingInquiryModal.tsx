"use client"

import { useState } from  "react"
import { motion, AnimatePresence } from  "framer-motion"
import { X, CheckCircle2, Building2, Phone, Mail, User, ShieldCheck } from  "lucide-react"
import { toast } from  "sonner"

interface PricingInquiryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingInquiryModal({ isOpen, onClose }: PricingInquiryModalProps) {
  const [form, setForm] = useState({
    name: "",
    academyName: "",
    phone: "",
    email: "",
    studentVolume: "100-500",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Pricing request received! A Grekam specialist will reach out on WhatsApp within 15 minutes.")
      setForm({
        name: "",
        academyName: "",
        phone: "",
        email: "",
        studentVolume: "100-500",
        message: ""
      })
      onClose()
    }, 800)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                  ECHO ACADEMY OS
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Get Pricing & Live Walkthrough
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tell us about your academy for a custom quote and 1-on-1 architecture tour.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Kumar"
                      value={form.name}
                      onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Academy / Institute Name *</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Coimbatore Skill Hub"
                      value={form.academyName}
                      onChange={e => setForm(prev => ({ ...prev, academyName: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 97893 59407"
                      value={form.phone}
                      onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Work Email Address *</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="admin@academy.in"
                      value={form.email}
                      onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Active Student Volume</label>
                <select
                  value={form.studentVolume}
                  onChange={e => setForm(prev => ({ ...prev, studentVolume: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-teal-600"
                >
                  <option value="50-200">50 – 200 Students</option>
                  <option value="200-1000">200 – 1,000 Students</option>
                  <option value="1000-5000">1,000 – 5,000 Students</option>
                  <option value="5000+">5,000+ Multi-Branch Institution</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Requirements / Modules Needed (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Meta Ads sync, Call Intelligence, Course Builder, or offline student migration..."
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting Inquiry..." : "Submit Pricing Request →"}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-teal-600" /> 100% Data Privacy</span>
                <span>•</span>
                <span>⚡ WhatsApp response in 15 mins</span>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
