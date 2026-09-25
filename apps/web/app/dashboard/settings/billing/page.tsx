"use client"

import { useState } from "react"
import { 
  CreditCard, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, 
  RefreshCw, ArrowUpRight, Check, X, FileText, Download, 
  ExternalLink, Clock, Layers, Users, BookOpen, HardDrive, MessageCircle, Zap, ShieldAlert
} from "lucide-react"
import { useApi, fetchApi } from "@/lib/useApi"
import { toast } from "sonner"

export default function AcademyBillingAndSubscriptionPage() {
  const { data, isLoading, mutate } = useApi<any>("/subscription")
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<any>(null)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const subscription = data?.subscription
  const plan = subscription?.plan
  const usage = data?.usage || {}
  const invoices = data?.invoices || []
  const availablePlans = data?.availablePlans || []

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will retain access until the end of your billing cycle.")) return
    try {
      toast.loading("Scheduling cancellation...", { id: "cancel-sub" })
      await fetchApi("/subscription/cancel", {
        method: "POST",
        body: JSON.stringify({ cancelImmediately: false, reason: "Cancelled from billing dashboard" })
      })
      toast.success("Subscription scheduled for cancellation at period end.", { id: "cancel-sub" })
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel subscription", { id: "cancel-sub" })
    }
  }

  const handleReactivateSubscription = async () => {
    try {
      toast.loading("Resuming subscription...", { id: "reactivate-sub" })
      await fetchApi("/subscription/reactivate", { method: "POST" })
      toast.success("Subscription resumed successfully!", { id: "reactivate-sub" })
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to resume subscription", { id: "reactivate-sub" })
    }
  }

  const handleInitiateUpgrade = async (targetPlan: any) => {
    setIsProcessing(true)
    try {
      toast.loading(`Preparing checkout for ${targetPlan.name}...`, { id: "upgrade-sub" })
      const res = await fetchApi<any>("/subscription/checkout", {
        method: "POST",
        body: JSON.stringify({
          targetPlanId: targetPlan.id,
          billingCycle: "YEARLY"
        })
      })

      if (res?.order?.customPaymentLink) {
        window.open(res.order.customPaymentLink, "_blank")
      }

      toast.success(`Checkout created! Invoice #${res?.order?.invoiceNumber}`, { id: "upgrade-sub" })
      setIsUpgradeModalOpen(false)
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate checkout", { id: "upgrade-sub" })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              ACADEMY SAAS BILLING & PLAN
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Subscription & Usage Limits</h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm font-medium">Manage your subscription tier, track real-time server resource meters, and download tax invoices.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              mutate()
              toast.success("Subscription refreshed")
            }}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-600' : ''}`} /> Refresh
          </button>
          
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4" /> Change / Upgrade Plan
          </button>
        </div>
      </div>

      {/* BILLING LIFECYCLE WARNING BANNERS */}
      {subscription?.status === "TRIALING" && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3 text-teal-900">
          <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold block">Free Trial Active</span>
            <p className="text-teal-800">You are currently enjoying full access under your 14-day free trial. Your trial ends on <strong>{subscription.trialEnd ? new Date(subscription.trialEnd).toLocaleDateString() : 'soon'}</strong>. Choose a plan to ensure uninterrupted operations.</p>
          </div>
        </div>
      )}

      {subscription?.status === "GRACE_PERIOD" && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold block">Account in Grace Period</span>
            <p className="text-amber-800">Your recent subscription payment attempt was unsuccessful. Your account has been placed in a grace period until <strong>{subscription.gracePeriodEnd ? new Date(subscription.gracePeriodEnd).toLocaleDateString() : 'soon'}</strong> before suspension.</p>
          </div>
        </div>
      )}

      {subscription?.status === "SUSPENDED" && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-start gap-3 text-rose-900">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold block">Subscription Suspended</span>
            <p className="text-rose-800">Paid feature access is currently paused. Your student and course data remains 100% safe and intact. Please renew your subscription to restore full operational access.</p>
          </div>
        </div>
      )}

      {subscription?.cancelAtPeriodEnd && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block">Cancellation Scheduled</span>
              <p className="text-amber-800">Your subscription will end on <strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</strong>. You retain full paid access until then.</p>
            </div>
          </div>
          <button
            onClick={handleReactivateSubscription}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Resume Subscription
          </button>
        </div>
      )}

      {/* PLAN CARD & SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Plan Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">CURRENT PLAN</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                subscription?.status === "ACTIVE" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                subscription?.status === "TRIALING" ? "bg-teal-50 text-teal-800 border-teal-200" :
                subscription?.status === "GRACE_PERIOD" ? "bg-amber-50 text-amber-800 border-amber-200" :
                "bg-rose-50 text-rose-800 border-rose-200"
              }`}>
                {subscription?.status || "ACTIVE"}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">{plan?.name || "GROWTH INSTITUTE"}</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">{plan?.description || "Full-featured digital academy workspace"}</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 font-mono">₹{(plan?.offerPriceYearly || plan?.yearlyPrice || 29999).toLocaleString()}</span>
                <span className="text-xs text-slate-500 font-bold">/ year</span>
              </div>
              <div className="text-[11px] font-bold text-slate-600 mt-1 flex items-center justify-between">
                <span>{plan?.gstText || "+ 18% GST"}</span>
                <span className="text-teal-700 font-mono">Yearly Billed</span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Next Renewal Date:</span>
                <span className="font-bold text-slate-900 font-mono">{subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Billing Provider:</span>
                <span className="font-bold text-slate-900">{subscription?.provider || 'RAZORPAY'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Upgrade Plan
            </button>
            {!subscription?.cancelAtPeriodEnd && subscription?.status === "ACTIVE" && (
              <button
                onClick={handleCancelSubscription}
                className="px-3 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Real-time Usage Meters */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Resource Consumption & Server Limits</h3>
              <p className="text-xs text-slate-500 font-medium">Usage is verified and enforced on every API request.</p>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Server-Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Students Meter */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-teal-600" /> Enrolled Students
                </span>
                <span className="font-mono font-black text-slate-900">
                  {usage.students?.current || 0} / {usage.students?.limit === -1 ? 'Unlimited' : usage.students?.limit || 500}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-teal-600 h-full rounded-full transition-all"
                  style={{ 
                    width: usage.students?.limit === -1 
                      ? '15%' 
                      : `${Math.min(100, Math.round(((usage.students?.current || 0) / (usage.students?.limit || 1)) * 100))}%` 
                  }}
                />
              </div>
            </div>

            {/* Staff / Instructors Meter */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" /> Staff & Instructors
                </span>
                <span className="font-mono font-black text-slate-900">
                  {usage.staff?.current || 0} / {usage.staff?.limit === -1 ? 'Unlimited' : usage.staff?.limit || 5}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ 
                    width: usage.staff?.limit === -1 
                      ? '20%' 
                      : `${Math.min(100, Math.round(((usage.staff?.current || 0) / (usage.staff?.limit || 1)) * 100))}%` 
                  }}
                />
              </div>
            </div>

            {/* Courses Meter */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" /> Published Courses
                </span>
                <span className="font-mono font-black text-slate-900">
                  {usage.courses?.current || 0} / {usage.courses?.limit === -1 ? 'Unlimited' : usage.courses?.limit || 15}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ 
                    width: usage.courses?.limit === -1 
                      ? '10%' 
                      : `${Math.min(100, Math.round(((usage.courses?.current || 0) / (usage.courses?.limit || 1)) * 100))}%` 
                  }}
                />
              </div>
            </div>

            {/* Storage Meter */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-emerald-600" /> Cloud Storage
                </span>
                <span className="font-mono font-black text-slate-900">
                  {usage.storageGB?.current || 0} GB / {usage.storageGB?.limit === -1 ? 'Unlimited' : `${usage.storageGB?.limit || 50} GB`}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ 
                    width: usage.storageGB?.limit === -1 
                      ? '10%' 
                      : `${Math.min(100, Math.round(((usage.storageGB?.current || 0) / (usage.storageGB?.limit || 1)) * 100))}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAX INVOICES TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">Tax Invoices & Billing History</h3>
            <p className="text-xs text-slate-500 font-medium">Immutable GST tax receipts generated for each subscription billing cycle.</p>
          </div>
          <span className="text-xs font-bold text-slate-500 font-mono">{invoices.length} Invoices</span>
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No billing invoices generated yet. Invoices appear automatically upon subscription checkout and renewals.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Invoice Number</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Billing Reason</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="p-3 text-slate-600">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-slate-700">{inv.billingReason}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">₹{inv.totalAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        inv.status === "PAID" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                        "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toast.success(`Downloading Invoice #${inv.invoiceNumber}`)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors inline-flex items-center gap-1 text-xs font-bold"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPGRADE / CHANGE PLAN MODAL */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">Upgrade or Switch Academy Plan</h2>
                <p className="text-xs text-slate-500 font-medium">Select a tier to upgrade your academy capacity and unlock premium features.</p>
              </div>
              <button onClick={() => setIsUpgradeModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availablePlans.map((p: any) => {
                const isCurrent = plan?.id === p.id
                return (
                  <div key={p.id} className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 ${
                    isCurrent ? "bg-slate-50 border-teal-500 ring-2 ring-teal-500/20" : "bg-white border-slate-200 hover:border-slate-300"
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-400">{p.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="text-2xl font-black font-mono text-slate-900">
                        ₹{(p.offerPriceYearly || p.yearlyPrice).toLocaleString()}
                        <span className="text-xs text-slate-500 font-bold ml-1 font-sans">/ yr</span>
                      </div>

                      <div className="text-[11px] text-slate-500 font-bold">{p.gstText || "+ 18% GST"}</div>

                      <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Students:</span>
                          <span className="font-bold font-mono">{p.maxStudents === -1 ? 'Unlimited' : p.maxStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Storage:</span>
                          <span className="font-bold font-mono">{p.maxStorageGB === -1 ? 'Unlimited' : `${p.maxStorageGB} GB`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Custom Domain:</span>
                          <span className="font-bold">{p.maxCustomDomains > 0 ? '✓ Yes' : '✗ No'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isCurrent || isProcessing}
                      onClick={() => handleInitiateUpgrade(p)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isCurrent 
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed" 
                          : "bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                      }`}
                    >
                      {isCurrent ? "Current Plan" : "Select & Upgrade →"}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
