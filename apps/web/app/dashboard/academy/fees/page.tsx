"use client"

import { useState } from "react"
import { Search, Filter, Download, Plus, IndianRupee, TrendingUp, AlertCircle, FileText, CheckCircle2, Clock, XCircle, Loader2, X, Eye, Mail, Printer, MessageCircle, Building2 } from "lucide-react"
import { useApi, fetchApi } from "@/lib/useApi"
import { toast } from "sonner"

// Types
type InvoiceStatus = 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE' | 'CANCELLED'

export default function FeeManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: feesData, mutate, isLoading } = useApi<any>("/academy/fees")
  const { data: enrollData } = useApi<any>("/academy/enroll/all")
  const { data: orgData } = useApi<any>("/settings/organization")
  
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    enrollmentId: "",
    amount: "",
    taxRate: "18",
    discount: "0",
    referralCode: "",
    dueDate: "",
    notes: ""
  })

  const stats = feesData?.stats || { totalCollected: 0, totalOutstanding: 0, overdueCount: 0 }
  const installments = feesData?.installments || []
  const org = orgData || {}

  const getStatusConfig = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID': return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 }
      case 'PARTIAL': return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock }
      case 'PENDING': return { bg: 'bg-sky-50 text-sky-700 border-sky-200', icon: Clock }
      case 'OVERDUE': return { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertCircle }
      case 'CANCELLED': return { bg: 'bg-slate-50 text-slate-500 border-slate-200', icon: XCircle }
      default: return { bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: Clock }
    }
  }

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.enrollmentId || !form.amount || !form.dueDate) {
      toast.error("Please fill in all required fields")
      return
    }
    setIsSubmitting(true)
    try {
      await fetchApi("/academy/fees", {
        method: "POST",
        body: JSON.stringify({
          enrollmentId: form.enrollmentId,
          amount: parseFloat(form.amount),
          taxRate: parseFloat(form.taxRate || "0"),
          discount: parseFloat(form.discount || "0"),
          dueDate: new Date(form.dueDate).toISOString(),
          notes: form.notes
        })
      })
      toast.success("Invoice created successfully")
      setIsSlideOverOpen(false)
      setForm({ enrollmentId: "", amount: "", taxRate: "18", discount: "0", referralCode: "", dueDate: "", notes: "" })
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to create invoice")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendWhatsAppInvoice = (invoice: any) => {
    const student = invoice.enrollment?.student?.user
    const studentPhone = student?.phone || invoice.enrollment?.student?.phone || ""
    const cleanPhone = studentPhone.replace(/\D/g, "")
    const courseName = invoice.enrollment?.batch?.course?.name || "Course Fee"
    const totalAmount = (invoice.amount + (invoice.amount * (invoice.taxRate || 0)) / 100).toFixed(2)

    const message = `🧾 *INVOICE ACKNOWLEDGEMENT - ${org.name || "Echo Academy"}*\n\n` +
      `*Invoice #:* ${invoice.id.slice(-6).toUpperCase()}\n` +
      `*Student:* ${student?.firstName || ""} ${student?.lastName || ""}\n` +
      `*Course:* ${courseName}\n` +
      `*Amount:* ₹${totalAmount}\n` +
      `*Status:* ${invoice.status}\n` +
      (invoice.dueDate ? `*Due Date:* ${new Date(invoice.dueDate).toLocaleDateString("en-IN")}\n\n` : "\n") +
      `Thank you for choosing ${org.name || "Echo Academy"}!`

    const whatsappUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, "_blank")
    toast.success("Opening WhatsApp with invoice details...")
  }

  const filteredInstallments = installments.filter((item: any) => {
    const name = `${item.enrollment?.student?.user?.firstName || ''} ${item.enrollment?.student?.user?.lastName || ''}`.toLowerCase()
    const id = item.id.toLowerCase()
    return name.includes(searchQuery.toLowerCase()) || id.includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto p-8 relative">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #invoice-printable-area, #invoice-printable-area * {
            visibility: visible !important;
          }
          #invoice-printable-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 32px !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            z-index: 99999 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <IndianRupee className="w-8 h-8 text-teal-600" /> Fee Collection & Invoices
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Track payments, issue tax invoices, and manage installments for your academy.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider mb-1">Total Collected</h3>
            <div className="text-2xl font-black text-slate-900">₹{stats.totalCollected.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider mb-1">Outstanding Balance</h3>
            <div className="text-2xl font-black text-slate-900">₹{stats.totalOutstanding.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider mb-1">Overdue Invoices</h3>
            <div className="text-2xl font-black text-slate-900">
              <span className="text-rose-600 mr-2">{stats.overdueCount}</span> Invoices
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by student name or invoice ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500 shadow-xs"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Issue / Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />Loading Invoices...</td></tr>
              ) : filteredInstallments.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">No invoices found.</td></tr>
              ) : filteredInstallments.map((invoice: any) => {
                const statusConfig = getStatusConfig(invoice.status)
                const StatusIcon = statusConfig.icon
                
                return (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">
                      #{invoice.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900">{invoice.enrollment?.student?.user?.firstName} {invoice.enrollment?.student?.user?.lastName}</div>
                      <div className="text-slate-500 text-xs mt-0.5 font-medium">{invoice.enrollment?.batch?.course?.name || "Unknown Course"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-900">₹{invoice.amount.toLocaleString()}</div>
                      {invoice.paidAmount > 0 && <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Paid: ₹{invoice.paidAmount}</div>}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      <div>{new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric'})}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Due: {new Date(invoice.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric'})}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusConfig.bg}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelectedInvoice(invoice)} title="View Invoice" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleSendWhatsAppInvoice(invoice)} title="Send via WhatsApp" className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-emerald-700 border border-emerald-200 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => toast.success("Invoice sent to student's email!")} title="Send Email" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SlideOver for Add Invoice */}
      {isSlideOverOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsSlideOverOpen(false)} />
          <div className="w-full md:w-[480px] bg-white h-full border-l border-slate-200 relative flex flex-col shadow-2xl z-10 animate-in slide-in-from-right text-slate-900">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <FileText className="w-5 h-5 text-teal-600" />
                Create New Invoice
              </h2>
              <button onClick={() => setIsSlideOverOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Select Student Enrollment *</label>
                <select 
                  required
                  value={form.enrollmentId} 
                  onChange={e => setForm(p => ({ ...p, enrollmentId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                >
                  <option value="">-- Choose Student --</option>
                  {(enrollData?.enrollments || enrollData || []).map((e: any) => (
                    <option key={e.id} value={e.id}>
                      {e.student?.user?.firstName} {e.student?.user?.lastName} — {e.batch?.course?.name || "Course"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Fee Amount (₹) *</label>
                  <input 
                    required
                    type="number"
                    placeholder="e.g. 25000"
                    value={form.amount}
                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Tax Rate (%)</label>
                  <input 
                    type="number"
                    placeholder="18"
                    value={form.taxRate}
                    onChange={e => setForm(p => ({ ...p, taxRate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Due Date *</label>
                <input 
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Notes / Payment Terms</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. First Installment for Web Development Course"
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsSlideOverOpen(false)} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Issue Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SlideOver for View Detailed Invoice */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex justify-end print:static print:block">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs print:hidden" onClick={() => setSelectedInvoice(null)} />
          <div className="w-full md:w-[650px] bg-white h-full border-l border-slate-200 relative flex flex-col shadow-2xl z-10 animate-in slide-in-from-right text-slate-900 print:w-full print:border-none print:shadow-none print:h-auto">
            
            {/* Action Bar (Hidden on Print) */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <FileText className="w-5 h-5 text-teal-600" />
                Invoice Preview
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleSendWhatsAppInvoice(selectedInvoice)} 
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
                <button 
                  onClick={() => window.print()} 
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Printer className="w-4 h-4" /> Print Invoice
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            
            {/* Printable Invoice Container */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white" id="invoice-printable-area">
              
              {/* Academy Brand Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div>
                  {org.academyLogoUrl || org.logoUrl ? (
                    <img src={org.academyLogoUrl || org.logoUrl} alt="Logo" className="h-12 w-auto mb-2 object-contain" />
                  ) : (
                    <div className="flex items-center gap-2 text-xl font-black text-slate-900 mb-2">
                      <Building2 className="w-6 h-6 text-teal-600" />
                      {org.companyName || org.name || "Echo Academy"}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 max-w-xs">{org.billingAddress || "Coimbatore, Tamil Nadu, India"}</p>
                  {org.phone && <p className="text-xs text-slate-500 font-mono mt-0.5">Ph: {org.phone}</p>}
                  {org.supportEmail && <p className="text-xs text-slate-500 font-mono">Email: {org.supportEmail}</p>}
                </div>
                <div className="text-right">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">TAX INVOICE</h1>
                  <p className="text-teal-700 font-mono font-bold text-sm mt-1">#{selectedInvoice.id.slice(-6).toUpperCase()}</p>
                  
                  <div className="mt-3 text-xs space-y-0.5 text-slate-600 font-mono">
                    {org.gstNumber && <p><strong className="text-slate-900">GSTIN:</strong> {org.gstNumber}</p>}
                    {org.panNumber && <p><strong className="text-slate-900">PAN:</strong> {org.panNumber}</p>}
                  </div>
                </div>
              </div>

              {/* Billed To & Invoice Metadata */}
              <div className="grid grid-cols-2 gap-8 py-2">
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Billed To (Student)</p>
                  <p className="font-extrabold text-slate-900 text-base">{selectedInvoice.enrollment?.student?.user?.firstName} {selectedInvoice.enrollment?.student?.user?.lastName}</p>
                  <p className="text-slate-600 text-xs font-mono">{selectedInvoice.enrollment?.student?.user?.email}</p>
                  {selectedInvoice.enrollment?.student?.user?.phone && (
                    <p className="text-slate-600 text-xs font-mono">{selectedInvoice.enrollment?.student?.user?.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Invoice Details</p>
                  <p className="text-slate-800 text-xs font-semibold">Issue Date: {new Date(selectedInvoice.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
                  <p className="text-slate-800 text-xs font-semibold">Due Date: {new Date(selectedInvoice.dueDate).toLocaleDateString('en-IN')}</p>
                  <p className="text-slate-800 text-xs font-semibold mt-1">Status: <span className="font-bold text-teal-700 uppercase">{selectedInvoice.status}</span></p>
                </div>
              </div>

              {/* Course Line Items */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-xs font-black uppercase tracking-wider text-slate-700">
                    <th className="py-3">Description</th>
                    <th className="py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  <tr>
                    <td className="py-4">
                      <div className="font-bold text-slate-900">Course Fee — {selectedInvoice.enrollment?.batch?.course?.name || "LMS Course Enrollment"}</div>
                      <div className="text-xs text-slate-500 mt-0.5 font-medium">Batch: {selectedInvoice.enrollment?.batch?.name || "Standard Batch"}</div>
                    </td>
                    <td className="py-4 text-right font-bold text-slate-900">₹{selectedInvoice.amount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              {/* Installment & EMI Breakdown (If applicable) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" /> Payment & Installment Breakdown
                </h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Amount Paid</span>
                    <span className="font-black text-emerald-700 text-sm">₹{(selectedInvoice.paidAmount || (selectedInvoice.status === 'PAID' ? selectedInvoice.amount : 0)).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Remaining Due</span>
                    <span className="font-black text-rose-600 text-sm">
                      ₹{Math.max(0, selectedInvoice.amount - (selectedInvoice.paidAmount || (selectedInvoice.status === 'PAID' ? selectedInvoice.amount : 0))).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Next Due Date</span>
                    <span className="font-bold text-slate-800 text-sm">{new Date(selectedInvoice.dueDate).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Calculation Totals */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Subtotal</span>
                    <span>₹{selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>GST Tax ({selectedInvoice.taxRate || 18}%)</span>
                    <span>₹{((selectedInvoice.amount * (selectedInvoice.taxRate || 18)) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-xl pt-3 border-t-2 border-slate-900 text-slate-900">
                    <span>Total Payable</span>
                    <span>₹{(selectedInvoice.amount + (selectedInvoice.amount * (selectedInvoice.taxRate || 18)) / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer Terms */}
              <div className="pt-8 border-t border-slate-200 text-center space-y-1">
                <p className="text-slate-600 text-xs font-bold">Thank you for choosing {org.name || "Echo Academy"}.</p>
                <p className="text-slate-400 text-[10px]">This is a computer-generated tax invoice and requires no physical signature.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
