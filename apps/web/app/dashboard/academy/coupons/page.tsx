"use client"

import { useState } from "react"
import { 
  Tag, Plus, Percent, DollarSign, Calendar, Users, 
  CheckCircle2, AlertCircle, Copy, Check, Trash2, X, Loader2
} from "lucide-react"
import { toast } from "sonner"

interface Coupon {
  id: string
  code: string
  discountType: "PERCENTAGE" | "FIXED"
  discountValue: number
  targetCourse: string
  usageLimit: number
  usedCount: number
  expiryDate: string
  isActive: boolean
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Interactive Checkout Preview State
  const [testCode, setTestCode] = useState("EARLYBIRD20")
  const [courseFee, setCourseFee] = useState(50000)

  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE" as Coupon["discountType"],
    discountValue: 15,
    targetCourse: "All Courses",
    usageLimit: 100,
    expiryDate: "2026-12-31"
  })

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Coupon code ${code} copied!`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleCoupon = (id: string) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === id) {
        const next = !c.isActive
        toast.success(`Coupon ${c.code} status updated to ${next ? 'ACTIVE' : 'INACTIVE'}`)
        return { ...c, isActive: next }
      }
      return c
    }))
  }

  const deleteCoupon = (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete coupon code "${code}"?`)) {
      setCoupons(prev => prev.filter(c => c.id !== id))
      toast.success(`Coupon ${code} removed.`)
    }
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      const newCoupon: Coupon = {
        id: `c-${Date.now()}`,
        code: form.code.toUpperCase().replace(/\s+/g, ''),
        discountType: form.discountType,
        discountValue: form.discountValue,
        targetCourse: form.targetCourse,
        usageLimit: form.usageLimit,
        usedCount: 0,
        expiryDate: form.expiryDate,
        isActive: true
      }
      setCoupons([newCoupon, ...coupons])
      setIsSubmitting(false)
      setIsModalOpen(false)
      toast.success(`Promo coupon code "${newCoupon.code}" created!`)
      setForm({ code: "", discountType: "PERCENTAGE", discountValue: 15, targetCourse: "All Courses", usageLimit: 100, expiryDate: "2026-12-31" })
    }, 600)
  }

  // Calculate test discount
  const activeMatch = coupons.find(c => c.code === testCode && c.isActive)
  let discountAmount = 0
  if (activeMatch) {
    if (activeMatch.discountType === "PERCENTAGE") {
      discountAmount = (courseFee * activeMatch.discountValue) / 100
    } else {
      discountAmount = activeMatch.discountValue
    }
  }
  const finalPrice = Math.max(courseFee - discountAmount, 0)

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200 flex items-center gap-1">
              <Tag className="w-3 h-3 text-teal-600" /> PROMOTIONS & DISCOUNTS
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Coupons & Offer Engine</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Create promotional discount codes, flash sales, early-bird vouchers, and referral offers.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm shadow-teal-600/20"
        >
          <Plus className="w-4 h-4" /> Create Coupon Code
        </button>
      </div>

      {/* KPI Stats & Live Discount Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* KPI Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Active Coupons</span>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {coupons.filter(c => c.isActive).length}
            </div>
            <span className="text-xs text-teal-700 font-bold mt-1 block">Live promo codes</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Redemptions</span>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {coupons.reduce((a, b) => a + b.usedCount, 0)}
            </div>
            <span className="text-xs text-emerald-700 font-bold mt-1 block">Checkout redemptions</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Student Savings</span>
            <div className="text-3xl font-black text-teal-700 mt-2 font-mono">₹2.4L</div>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Total promotional value</span>
          </div>
        </div>

        {/* Live Checkout Discount Calculator */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
             Checkout Discount Simulator
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-500 block mb-1">Base Course Fee (₹)</label>
              <input type="number" value={courseFee} onChange={e => setCourseFee(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold" />
            </div>

            <div>
              <label className="font-bold text-slate-500 block mb-1">Apply Promo Code</label>
              <input type="text" value={testCode} onChange={e => setTestCode(e.target.value.toUpperCase())} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-black text-teal-700 uppercase" />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 mt-4">
              <div className="flex justify-between text-slate-600">
                <span>Original Fee:</span>
                <span className="font-mono font-bold">₹{courseFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-teal-700 font-bold">
                <span>Discount Applied:</span>
                <span className="font-mono">- ₹{discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                <span>Final Student Payable:</span>
                <span className="font-mono text-teal-600">₹{finalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Promo Code</th>
                <th className="py-4 px-6">Discount</th>
                <th className="py-4 px-6">Target Course</th>
                <th className="py-4 px-6">Redemptions</th>
                <th className="py-4 px-6">Expiry Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200 text-sm">
                        {coupon.code}
                      </span>
                      <button onClick={() => copyCode(coupon.code)} className="text-slate-400 hover:text-slate-700">
                        {copiedCode === coupon.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-mono font-extrabold text-slate-900">
                    {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue.toLocaleString()} OFF`}
                  </td>

                  <td className="py-4 px-6 text-xs font-semibold text-slate-700">
                    {coupon.targetCourse}
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-slate-600">
                    <strong>{coupon.usedCount}</strong> / {coupon.usageLimit}
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-slate-500">
                    {coupon.expiryDate}
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      coupon.isActive 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {coupon.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => toggleCoupon(coupon.id)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors"
                    >
                      {coupon.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button 
                      onClick={() => deleteCoupon(coupon.id, coupon.code)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Coupon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-xl relative text-slate-900">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">Create Promotional Coupon Code</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Promo Code (Uppercase) *</label>
                <div className="flex items-center gap-2">
                  <input required placeholder="e.g. FLASH30" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-black uppercase" />
                  <button type="button" onClick={() => setForm(p => ({ ...p, code: `Echo${Math.floor(100 + Math.random() * 900)}` }))} className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl whitespace-nowrap">
                    Generate Code
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Discount Type</label>
                  <select value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value as Coupon["discountType"] }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold">
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Discount Value *</label>
                  <input required type="number" value={form.discountValue} onChange={e => setForm(p => ({ ...p, discountValue: parseFloat(e.target.value) }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Usage Limit Cap</label>
                  <input required type="number" value={form.usageLimit} onChange={e => setForm(p => ({ ...p, usageLimit: parseInt(e.target.value) }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono" />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Expiry Date *</label>
                  <input required type="date" value={form.expiryDate} onChange={e => setForm(p => ({ ...p, expiryDate: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Promo Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
