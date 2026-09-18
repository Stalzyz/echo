"use client"

import { useState } from "react"
import { 
  FileText, Download, Printer, Search, Filter, DollarSign, 
  CheckCircle2, Clock, AlertCircle, Send, X, ExternalLink, ShieldCheck, Layers
} from "lucide-react"
import { toast } from "sonner"

interface Invoice {
  id: string
  number: string
  vendorName: string
  vendorEmail: string
  vendorAddress: string
  planName: string
  amount: number
  taxAmount: number
  totalAmount: number
  issueDate: string
  dueDate: string
  status: "PAID" | "PENDING" | "OVERDUE"
  paymentMethod: string
  transactionId: string
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    number: "INV-2026-0891",
    vendorName: "Apex Tech Institute",
    vendorEmail: "rajesh@apextech.edu",
    vendorAddress: "Building 4, Tech Park, Bangalore, India",
    planName: "Enterprise SaaS Plan (Annual)",
    amount: 4990,
    taxAmount: 898.2,
    totalAmount: 5888.2,
    issueDate: "2026-09-01",
    dueDate: "2026-09-15",
    status: "PAID",
    paymentMethod: "Stripe / Credit Card",
    transactionId: "ch_3M9xZ2eS9K3a"
  },
  {
    id: "inv-2",
    number: "INV-2026-0892",
    vendorName: "Stark Photography Academy",
    vendorEmail: "elena@starkphoto.com",
    vendorAddress: "Suite 12, Studio Way, New York, USA",
    planName: "Professional SaaS Plan (Monthly)",
    amount: 149,
    taxAmount: 26.82,
    totalAmount: 175.82,
    issueDate: "2026-09-10",
    dueDate: "2026-09-24",
    status: "PAID",
    paymentMethod: "Razorpay / UPI",
    transactionId: "pay_Kyz829aB7c"
  },
  {
    id: "inv-3",
    number: "INV-2026-0893",
    vendorName: "Global Civil Services Hub",
    vendorEmail: "admin@civilserviceshub.in",
    vendorAddress: "Civil Lines, New Delhi, India",
    planName: "Professional SaaS Plan (Monthly)",
    amount: 149,
    taxAmount: 26.82,
    totalAmount: 175.82,
    issueDate: "2026-09-12",
    dueDate: "2026-09-26",
    status: "PENDING",
    paymentMethod: "Bank Transfer (NEFT)",
    transactionId: "TXN-PENDING"
  },
  {
    id: "inv-4",
    number: "INV-2026-0884",
    vendorName: "DesignCraft Studio Academy",
    vendorEmail: "marco@designcraft.co",
    vendorAddress: "Via Milano 44, Rome, Italy",
    planName: "Starter SaaS Plan (Monthly)",
    amount: 49,
    taxAmount: 8.82,
    totalAmount: 57.82,
    issueDate: "2026-08-01",
    dueDate: "2026-08-15",
    status: "OVERDUE",
    paymentMethod: "Credit Card (Failed)",
    transactionId: "ERR_DECLINED"
  }
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.number.toLowerCase().includes(search.toLowerCase()) || 
                          inv.vendorName.toLowerCase().includes(search.toLowerCase()) ||
                          inv.vendorEmail.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === "ALL" || inv.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalCollected = invoices.filter(i => i.status === "PAID").reduce((a, b) => a + b.totalAmount, 0)
  const totalPending = invoices.filter(i => i.status === "PENDING").reduce((a, b) => a + b.totalAmount, 0)
  const totalOverdue = invoices.filter(i => i.status === "OVERDUE").reduce((a, b) => a + b.totalAmount, 0)

  const markAsPaid = (id: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        toast.success(`Invoice ${inv.number} marked as PAID. Receipt sent to ${inv.vendorEmail}`)
        return { ...inv, status: "PAID", paymentMethod: "Manual Payment / Super Admin" }
      }
      return inv
    }))
  }

  const sendReminder = (inv: Invoice) => {
    toast.success(`Payment reminder email dispatched to ${inv.vendorEmail} for ${inv.number}`)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              SAAS FINANCE & BILLING
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Payments & Invoices</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Track vendor subscription payments, tax receipts, and printable GST invoices.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Revenue Collected</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">${totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <span className="text-xs text-emerald-700 font-bold mt-1 block">Cleared via Stripe / Razorpay</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Pending Receivables</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <span className="text-xs text-amber-700 font-bold mt-1 block">Awaiting net-15 payment clearance</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Overdue Accounts</span>
            <AlertCircle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600 font-mono">${totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <span className="text-xs text-rose-700 font-bold mt-1 block">Requires payment reminder</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search invoice number, academy, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="PAID">Paid Invoices</option>
            <option value="PENDING">Pending Approval</option>
            <option value="OVERDUE">Overdue Accounts</option>
          </select>
        </div>
      </div>

      {/* Invoices Directory Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Invoice #</th>
                <th className="py-4 px-6">Academy Vendor</th>
                <th className="py-4 px-6">Plan Description</th>
                <th className="py-4 px-6">Issue Date</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-teal-600">
                    {inv.number}
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-extrabold text-slate-900">{inv.vendorName}</div>
                    <div className="text-xs text-slate-400">{inv.vendorEmail}</div>
                  </td>

                  <td className="py-4 px-6 font-medium text-slate-700 text-xs">
                    {inv.planName}
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-slate-500">
                    {inv.issueDate}
                  </td>

                  <td className="py-4 px-6 font-mono font-black text-slate-900">
                    ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      inv.status === "PAID" 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                        : inv.status === "PENDING"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1.5 bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Invoice
                    </button>

                    {inv.status !== "PAID" && (
                      <button 
                        onClick={() => markAsPaid(inv.id)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Mark Paid
                      </button>
                    )}

                    {inv.status === "OVERDUE" && (
                      <button 
                        onClick={() => sendReminder(inv)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Send Payment Reminder"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal Drawer */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl p-8 shadow-2xl relative text-slate-900 max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Gecho LMS Technologies</h2>
                  <p className="text-xs text-slate-500 font-mono">Tax ID / GSTIN: 29GECHO1234F1Z5</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Details Header */}
            <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-widest block mb-1">Billed To</span>
                <div className="font-extrabold text-sm text-slate-900">{selectedInvoice.vendorName}</div>
                <div className="text-slate-600 mt-1">{selectedInvoice.vendorAddress}</div>
                <div className="text-slate-500 font-mono mt-1">{selectedInvoice.vendorEmail}</div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-lg font-black font-mono text-teal-600">{selectedInvoice.number}</div>
                <div><span className="text-slate-400 font-bold">Issue Date:</span> <span className="font-mono">{selectedInvoice.issueDate}</span></div>
                <div><span className="text-slate-400 font-bold">Due Date:</span> <span className="font-mono">{selectedInvoice.dueDate}</span></div>
                <div><span className="text-slate-400 font-bold">Status:</span> <span className="font-black text-emerald-600">{selectedInvoice.status}</span></div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-black text-slate-500 uppercase tracking-wider">
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-right">Net Amount</th>
                    <th className="p-3 text-right">Tax (18%)</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-800">{selectedInvoice.planName}</td>
                    <td className="p-3 text-right font-mono">${selectedInvoice.amount.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono">${selectedInvoice.taxAmount.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold">${selectedInvoice.totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Calculation */}
            <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Gateway Reference</span>
                <span className="text-xs font-mono font-bold text-slate-700">{selectedInvoice.transactionId}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 block">Grand Total Paid</span>
                <span className="text-2xl font-black font-mono text-teal-600">${selectedInvoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
