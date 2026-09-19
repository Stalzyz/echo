"use client"

import { useState, useEffect } from "react"
import { useApi, fetchApi } from "@/lib/useApi"
import { toast } from "sonner"
import { Share2, IndianRupee, Clock, CheckCircle2, Loader2 } from "lucide-react"

export default function ReferralsAdmin() {
  const { data: payouts, mutate, isLoading } = useApi<any[]>("/academy/referrals/payouts")
  const { data: rulesData, mutate: mutateRules } = useApi<{ data: { studentReferralPercentage: number } }>("/hr/rules/commission")
  
  const [selectedPayout, setSelectedPayout] = useState<any>(null)
  const [payForm, setPayForm] = useState({ paymentMethod: "UPI", transactionId: "", notes: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commissionRate, setCommissionRate] = useState<number>(10)
  const [isSavingRate, setIsSavingRate] = useState(false)

  useEffect(() => {
    if (rulesData?.data?.studentReferralPercentage !== undefined) {
      setCommissionRate(rulesData.data.studentReferralPercentage)
    }
  }, [rulesData])

  const handleSaveCommissionRate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingRate(true)
    try {
      await fetchApi("/hr/rules/commission", {
        method: "POST",
        body: JSON.stringify({ studentReferralPercentage: Number(commissionRate) })
      })
      toast.success(`Student referral commission share updated to ${commissionRate}%`)
      mutateRules()
    } catch (err: any) {
      toast.error(err.message || "Failed to update commission rate")
    } finally {
      setIsSavingRate(false)
    }
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPayout) return
    setIsSubmitting(true)
    try {
      await fetchApi(`/academy/referrals/payouts/${selectedPayout.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "PAID", ...payForm })
      })
      toast.success("Payout marked as PAID")
      setSelectedPayout(null)
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to update payout")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this payout?")) return
    try {
      await fetchApi(`/academy/referrals/payouts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "REJECTED" })
      })
      toast.success("Payout rejected")
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to reject")
    }
  }

  const pendingAmount = (payouts || []).filter((p:any) => p.status === 'PENDING').reduce((acc:number, p:any) => acc + p.amount, 0)
  const totalPaid = (payouts || []).filter((p:any) => p.status === 'PAID').reduce((acc:number, p:any) => acc + p.amount, 0)

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Share2 className="w-8 h-8 text-teal-600" /> Referral Payouts
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and clear cash rewards for student referrals on Echo LMS.</p>
        </div>

        <form onSubmit={handleSaveCommissionRate} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3 shadow-xs">
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider">Referral Commission %</label>
            <div className="flex items-center gap-1 mt-1">
              <input
                type="number"
                min="0"
                max="100"
                value={commissionRate}
                onChange={e => setCommissionRate(parseFloat(e.target.value))}
                className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 text-center outline-none focus:ring-2 focus:ring-teal-500/50"
              />
              <span className="text-sm font-bold text-slate-500">%</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSavingRate}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs disabled:opacity-50"
          >
            {isSavingRate ? "Saving..." : "Save %"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h3 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-600"/> Pending Clearance</h3>
          <div className="text-3xl font-black text-slate-900 flex items-center"><IndianRupee className="w-6 h-6 mr-1 text-slate-400"/>{pendingAmount.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h3 className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Total Paid Out</h3>
          <div className="text-3xl font-black text-slate-900 flex items-center"><IndianRupee className="w-6 h-6 mr-1 text-slate-400"/>{totalPaid.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="p-4">Referrer</th>
              <th className="p-4">Referred Student</th>
              <th className="p-4">Course Type</th>
              <th className="p-4">Payout Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && <tr><td colSpan={6} className="p-8 text-center text-slate-500 font-medium">Loading payouts...</td></tr>}
            {(payouts || []).length === 0 && !isLoading && (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500 font-medium">No referral payouts found.</td></tr>
            )}
            {(payouts || []).map((p: any) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-extrabold text-slate-900">{p.referrer?.user?.firstName} {p.referrer?.user?.lastName}</div>
                  <div className="text-xs text-slate-500 font-medium">{p.referrer?.studentCode} • {p.referrer?.user?.phone}</div>
                </td>
                <td className="p-4">
                  <div className="font-extrabold text-slate-900">{p.referred?.user?.firstName} {p.referred?.user?.lastName}</div>
                  <div className="text-xs text-slate-500 font-medium">{p.referred?.studentCode}</div>
                </td>
                <td className="p-4">
                  <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wider">{p.courseType}</span>
                </td>
                <td className="p-4 font-extrabold text-slate-900">₹{p.amount}</td>
                <td className="p-4">
                  {p.status === "PENDING" && <span className="text-amber-800 text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">PENDING</span>}
                  {p.status === "PAID" && <span className="text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">PAID</span>}
                  {p.status === "REJECTED" && <span className="text-rose-800 text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">REJECTED</span>}
                </td>
                <td className="p-4 text-right">
                  {p.status === "PENDING" && (
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setSelectedPayout(p)} className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs">Pay</button>
                      <button onClick={() => handleReject(p.id)} className="text-xs bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold px-3 py-1.5 rounded-lg transition-colors">Reject</button>
                    </div>
                  )}
                  {p.status === "PAID" && (
                    <div className="text-xs text-slate-500 font-medium">
                      Paid via {p.paymentMethod}<br/>{p.transactionId && `TXN: ${p.transactionId}`}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pay Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-900">
            <h2 className="text-xl font-black mb-1 text-slate-900">Clear Referral Payout</h2>
            <p className="text-slate-500 text-xs font-medium mb-6">Pay <strong className="text-slate-900">₹{selectedPayout.amount}</strong> to {selectedPayout.referrer?.user?.firstName}</p>
            
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider block mb-1">Payment Method</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  value={payForm.paymentMethod} onChange={e => setPayForm(p => ({...p, paymentMethod: e.target.value}))}>
                  <option value="UPI">UPI</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider block mb-1">Transaction ID (Optional)</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  value={payForm.transactionId} onChange={e => setPayForm(p => ({...p, transactionId: e.target.value}))} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setSelectedPayout(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors text-slate-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors shadow-xs flex justify-center items-center">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark as Paid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
