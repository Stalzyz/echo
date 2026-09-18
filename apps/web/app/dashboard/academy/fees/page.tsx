"use client"

import { useState } from "react"
import { Search, Filter, Download, Plus, IndianRupee, TrendingUp, AlertCircle, FileText, CheckCircle2, Clock, XCircle, Loader2, X, Eye, Mail, Printer } from "lucide-react"
import { useApi, fetchApi } from "@/lib/useApi"
import { toast } from "sonner"

// Types
type InvoiceStatus = 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE' | 'CANCELLED'

export default function FeeManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: feesData, mutate, isLoading } = useApi<any>("/academy/fees")
  const { data: enrollData } = useApi<any>("/academy/enroll/all")
  
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
  const enrollments = enrollData?.data || []

  const getStatusConfig = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID': return { color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 }
      case 'PARTIAL': return { color: 'bg-teal-50 text-teal-800 border-teal-200', icon: Clock }
      case 'PENDING': return { color: 'bg-amber-50 text-amber-800 border-amber-200', icon: Clock }
      case 'OVERDUE': return { color: 'bg-rose-50 text-rose-800 border-rose-200', icon: AlertCircle }
      case 'CANCELLED': return { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: XCircle }
      default: return { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Clock }
    }
  }

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/academy/fees/installment", {
        method: "POST",
        body: JSON.stringify({
          enrollmentId: form.enrollmentId,
          amount: Number(form.amount),
          taxRate: Number(form.taxRate),
          discount: Number(form.discount),
          referralCode: form.referralCode || undefined,
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

  const filteredInstallments = installments.filter((inv: any) => {
    const search = searchQuery.toLowerCase()
    const studentName = `${inv.enrollment?.student?.user?.firstName || ''} ${inv.enrollment?.student?.user?.lastName || ''}`.toLowerCase()
    const courseName = inv.enrollment?.batch?.course?.name?.toLowerCase() || ''
    return studentName.includes(search) || inv.id.toLowerCase().includes(search) || courseName.includes(search)
  })

  return (
    <div className="flex-1 overflow-y-auto h-full bg-slate-50 text-slate-900 relative custom-scrollbar">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Fee Management</h1>
            <p className="text-slate-500 mt-1 font-medium">Track payments, issue invoices, and manage compliance for Gecho LMS.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors flex items-center gap-2 shadow-xs">
              <Download className="w-4 h-4 text-slate-500" />
              Export
            </button>
            <button onClick={() => setIsSlideOverOpen(true)} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-xs">
              <Plus className="w-4 h-4" />
              New Invoice
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider mb-1">Total Collected</h3>
            <div className="flex items-center gap-1 text-3xl font-black text-slate-900">
              <IndianRupee className="w-6 h-6 text-slate-400" />
              {stats.totalCollected.toLocaleString()}
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider mb-1">Outstanding Dues</h3>
            <div className="flex items-center gap-1 text-3xl font-black text-slate-900">
              <IndianRupee className="w-6 h-6 text-slate-400" />
              {stats.totalOutstanding.toLocaleString()}
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider mb-1">Overdue Invoices</h3>
            <div className="flex items-center gap-1 text-3xl font-black text-slate-900">
              <span className="text-rose-600 mr-2">{stats.overdueCount}</span> Invoices
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by student name or invoice ID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors flex items-center gap-2 shadow-xs">
            <Filter className="w-4 h-4 text-slate-500" />
            Filters
          </button>
        </div>

        {/* Invoices Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Student / Course</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date Issued</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />Loading Invoices...</td></tr>
                ) : filteredInstallments.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">No invoices found.</td></tr>
                ) : filteredInstallments.map((invoice: any) => {
                  const statusConfig = getStatusConfig(invoice.status)
                  const StatusIcon = statusConfig.icon
                  
                  return (
                    <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-bold text-slate-800 font-mono">
                          <FileText className="w-4 h-4 text-slate-400" />
                          {invoice.id.split('-')[0]}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-slate-900">{invoice.enrollment?.student?.user?.firstName} {invoice.enrollment?.student?.user?.lastName}</div>
                        <div className="text-slate-500 text-xs mt-0.5 font-medium">{invoice.enrollment?.batch?.course?.name || "Unknown Course"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-slate-900 flex items-center">
                          <IndianRupee className="w-3 h-3 text-slate-400" />
                          {invoice.amount.toLocaleString()}
                        </div>
                        {invoice.paidAmount > 0 && <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Paid: ₹{invoice.paidAmount}</div>}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        <div>{new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric'})}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Due: {new Date(invoice.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric'})}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black tracking-wide border ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setSelectedInvoice(invoice)} title="View Details" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => {
                            setSelectedInvoice(invoice)
                            setTimeout(() => window.print(), 100)
                          }} title="View as PDF (Print)" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors">
                            <Printer className="w-4 h-4" />
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

      </div>

      {/* SlideOver for Add Invoice */}
      {isSlideOverOpen && (
        <div className="absolute inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsSlideOverOpen(false)} />
          <div className="w-[450px] bg-white h-full border-l border-slate-200 relative flex flex-col shadow-2xl z-10 animate-in slide-in-from-right text-slate-900">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-black flex items-center gap-2 text-slate-900">
                <FileText className="w-5 h-5 text-teal-600" />
                Create New Invoice
              </h2>
              <button onClick={() => setIsSlideOverOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreateInvoice} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Student / Course Enrollment</label>
                <select required value={form.enrollmentId} onChange={e => setForm(p => ({...p, enrollmentId: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none text-slate-900 font-medium">
                  <option value="">Select Enrollment...</option>
                  {enrollments.map((enr: any) => (
                    <option key={enr.id} value={enr.id}>
                      {enr.student?.user?.firstName} {enr.student?.user?.lastName} - {enr.batch?.course?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Base Course Fee (₹)</label>
                <input required type="number" min="1" value={form.amount} onChange={e => setForm(p => ({...p, amount: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none text-slate-900 font-medium" placeholder="e.g. 50000" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">GST Rate (%)</label>
                  <input type="number" min="0" value={form.taxRate} onChange={e => setForm(p => ({...p, taxRate: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none text-slate-900 font-medium" placeholder="18" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Discount (₹)</label>
                  <input type="number" min="0" value={form.discount} onChange={e => setForm(p => ({...p, discount: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none text-slate-900 font-medium" placeholder="0" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Referral Code (Optional)</label>
                <input value={form.referralCode} onChange={e => setForm(p => ({...p, referralCode: e.target.value.toUpperCase()}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none text-slate-900 font-mono uppercase" placeholder="e.g. ALUMNI50" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Due Date</label>
                <input required type="date" value={form.dueDate} onChange={e => setForm(p => ({...p, dueDate: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none text-slate-900 font-medium" />
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs space-y-1 font-mono">
                <div className="flex justify-between text-slate-600"><span>Base Fee:</span> <span>₹{Number(form.amount || 0)}</span></div>
                <div className="flex justify-between text-slate-600"><span>GST ({form.taxRate}%):</span> <span>+₹{(Number(form.amount || 0) * Number(form.taxRate || 0)) / 100}</span></div>
                <div className="flex justify-between text-slate-600"><span>Discount:</span> <span>-₹{Number(form.discount || 0)}</span></div>
                <div className="flex justify-between text-teal-800 font-black border-t border-teal-200 pt-1.5 text-sm">
                  <span>Net Payable Amount:</span> 
                  <span>₹{Math.max(0, Number(form.amount || 0) + ((Number(form.amount || 0) * Number(form.taxRate || 0)) / 100) - Number(form.discount || 0))}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Notes / Remarks</label>
                <textarea rows={3} value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-teal-500 outline-none resize-none text-slate-900 font-medium" placeholder="Optional notes regarding this installment" />
              </div>
            </form>

            <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
              <button disabled={isSubmitting} onClick={() => setIsSlideOverOpen(false)} className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold transition-colors text-slate-700">
                Cancel
              </button>
              <button disabled={isSubmitting} onClick={handleCreateInvoice} className="flex-[2] py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SlideOver for View Invoice */}
      {selectedInvoice && (
        <div className="absolute inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSelectedInvoice(null)} />
          <div className="w-full md:w-[600px] bg-white h-full border-l border-slate-200 relative flex flex-col shadow-2xl z-10 animate-in slide-in-from-right text-slate-900">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <FileText className="w-5 h-5 text-slate-500" />
                Invoice Details
              </h2>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 text-slate-800">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white" id="invoice-printable-area">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">INVOICE</h1>
                  <p className="text-slate-500 font-mono mt-1">#{selectedInvoice.id.slice(-6).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <h2 className="font-extrabold text-xl text-slate-900">Gecho LMS</h2>
                  <p className="text-slate-500 text-sm mt-1">billing@gecholms.com</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
                  <p className="font-bold text-slate-900">{selectedInvoice.enrollment?.student?.user?.firstName} {selectedInvoice.enrollment?.student?.user?.lastName}</p>
                  <p className="text-slate-500 text-sm">{selectedInvoice.enrollment?.student?.user?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Invoice Info</p>
                  <p className="text-slate-900 text-sm">Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                  <p className="text-slate-900 text-sm">Due: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="py-3 font-bold text-slate-900">Description</th>
                    <th className="py-3 font-bold text-slate-900 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-4 text-slate-600">Course Fee - {selectedInvoice.enrollment?.batch?.course?.name}</td>
                    <td className="py-4 text-slate-900 text-right font-bold">₹{selectedInvoice.amount}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end pt-4">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{selectedInvoice.amount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax ({selectedInvoice.taxRate || 0}%)</span>
                    <span>₹{((selectedInvoice.amount * (selectedInvoice.taxRate || 0)) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-xl pt-3 border-t border-slate-200 text-slate-900">
                    <span>Total</span>
                    <span>₹{(selectedInvoice.amount + (selectedInvoice.amount * (selectedInvoice.taxRate || 0)) / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200">
                <p className="text-slate-400 text-xs text-center font-medium">Thank you for choosing Gecho LMS.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

