"use client"

import { useApi } from "@/lib/useApi"
import { ShoppingBag, Plus, Tag, IndianRupee, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function MarketplaceAdmin() {
  const { data: items } = useApi<any[]>("/academy/marketplace")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      toast.success("Feature coming soon: Admin item listing")
      setIsAddOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-teal-600" /> Marketplace
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage courses, learning templates, and digital goods for Gecho LMS.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(items || []).map((item: any) => (
          <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-slate-300 transition-colors shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wider">{item.type}</span>
                <span className="flex items-center gap-0.5 font-extrabold text-slate-900"><IndianRupee className="w-3.5 h-3.5 text-slate-400"/> {item.price}</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-3 mb-6 font-medium leading-relaxed">{item.description}</p>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-slate-100 text-xs font-semibold">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className={item.isActive ? "text-emerald-700" : "text-rose-600"}>
                {item.isActive ? "Active (Listed)" : "Inactive (Hidden)"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-900">
            <h2 className="text-xl font-black mb-6 text-slate-900">Add Marketplace Item</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required placeholder="Item Title" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
              <textarea required placeholder="Description" rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50 resize-none" />
              <div className="flex gap-4">
                <input required type="number" placeholder="Price (INR)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50">
                  <option>COURSE</option>
                  <option>TEMPLATE</option>
                  <option>TICKET</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors text-slate-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors flex justify-center items-center shadow-xs">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "List Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
