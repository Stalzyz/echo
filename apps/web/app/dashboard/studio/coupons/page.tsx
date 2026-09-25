"use client"

import { useState } from  "react"
import { toast } from  "sonner"
import { Plus, Ticket, Copy, Percent, Tag, Check, Calendar, Trash2, Search } from  "lucide-react"

interface Coupon {
  id: string
  code: string
  discountType: "PERCENT" | "FIXED"
  discountValue: number
  minOrderAmount: number
  maxUses: number
  usedCount: number
  expiresAt: string
  isActive: boolean
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "1",
      code: "WELCOME50",
      discountType: "PERCENT",
      discountValue: 50,
      minOrderAmount: 1000,
      maxUses: 100,
      usedCount: 34,
      expiresAt: "2026-12-31",
      isActive: true
    },
    {
      id: "2",
      code: "FLAT1000",
      discountType: "FIXED",
      discountValue: 1000,
      minOrderAmount: 5000,
      maxUses: 50,
      usedCount: 12,
      expiresAt: "2026-10-15",
      isActive: true
    },
    {
      id: "3",
      code: "EARLYBIRD",
      discountType: "PERCENT",
      discountValue: 25,
      minOrderAmount: 0,
      maxUses: 200,
      usedCount: 189,
      expiresAt: "2026-09-30",
      isActive: true
    }
  ])

  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENT" as "PERCENT" | "FIXED",
    discountValue: 20,
    minOrderAmount: 0,
    maxUses: 100,
    expiresAt: "2026-12-31"
  })

  const generateRandomCode = () => {
    const code = `ECHO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    setForm(p => ({ ...p, code }))
  }

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code) return

    const newCoupon: Coupon = {
      id: `cop_${Date.now()}`,
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount),
      maxUses: Number(form.maxUses),
      usedCount: 0,
      expiresAt: form.expiresAt,
      isActive: true
    }

    setCoupons(prev => [newCoupon, ...prev])
    toast.success(`Coupon ${newCoupon.code} created successfully!`)
    setIsModalOpen(false)
    setForm({
      code: "",
      discountType: "PERCENT",
      discountValue: 20,
      minOrderAmount: 0,
      maxUses: 100,
      expiresAt: "2026-12-31"
    })
  }

  const handleDelete = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id))
    toast.success("Coupon removed")
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Copied ${code} to clipboard!`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex-1 overflow-y-auto h-full bg-slate-50 text-slate-900">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Coupons & Discount Generator</h1>
            <p className="text-slate-500 mt-1">Generate single or batch promotional coupon codes for student enrollments.</p>
          </div>
          <button 
            onClick={() => {
              generateRandomCode()
              setIsModalOpen(true)
            }}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search coupon codes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 shadow-sm"
          />
        </div>

        {/* Coupons List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => (
            <div key={coupon.id} className="bg-white border border-slate-200 hover:border-teal-400 rounded-2xl p-6 shadow-sm flex flex-col justify-between group transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-teal-50 text-teal-700 border border-teal-200">
                    {coupon.discountType === "PERCENT" ? `${coupon.discountValue}% OFF` : `Flat ₹${coupon.discountValue} OFF`}
                  </span>
                  <button onClick={() => handleDelete(coupon.id)} className="text-slate-300 hover:text-rose-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="font-mono text-2xl font-black text-slate-900 tracking-wider mb-2 flex items-center justify-between">
                  <span>{coupon.code}</span>
                  <button 
                    onClick={() => handleCopy(coupon.code)} 
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-teal-600 transition-colors"
                  >
                    {copiedCode === coupon.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="space-y-1 text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Min Order Amount:</span>
                    <span className="font-semibold text-slate-800">₹{coupon.minOrderAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Usage Limit:</span>
                    <span className="font-semibold text-slate-800">{coupon.usedCount} / {coupon.maxUses} uses</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Until:</span>
                    <span className="font-semibold text-slate-800">{coupon.expiresAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-slate-900 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Generate Coupon Code</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-600">Coupon Code</label>
                    <button type="button" onClick={generateRandomCode} className="text-xs font-bold text-teal-600 hover:underline">Randomize Code</button>
                  </div>
                  <input 
                    required
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm(p => ({ ...p, code: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-500 uppercase"
                    placeholder="e.g. SUMMER50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Discount Type</label>
                    <select 
                      value={form.discountType}
                      onChange={(e: any) => setForm(p => ({ ...p, discountType: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                    >
                      <option value="PERCENT">Percentage (%)</option>
                      <option value="FIXED">Flat Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      {form.discountType === "PERCENT" ? "Discount Percentage (%)" : "Discount Amount (₹)"}
                    </label>
                    <input 
                      required
                      type="number"
                      value={form.discountValue}
                      onChange={(e) => setForm(p => ({ ...p, discountValue: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Min Order Amount (₹)</label>
                    <input 
                      type="number"
                      value={form.minOrderAmount}
                      onChange={(e) => setForm(p => ({ ...p, minOrderAmount: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Max Redemptions</label>
                    <input 
                      type="number"
                      value={form.maxUses}
                      onChange={(e) => setForm(p => ({ ...p, maxUses: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Expiry Date</label>
                  <input 
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm(p => ({ ...p, expiresAt: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-sm">Save Coupon</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
