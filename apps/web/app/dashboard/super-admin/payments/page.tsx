"use client"

import { useState } from "react"
import { 
  Receipt, Search, Filter, ArrowUpRight, DollarSign, 
  Download, CheckCircle2, XCircle, RefreshCw, CreditCard
} from "lucide-react"
import { toast } from "sonner"

interface Transaction {
  id: string
  invoiceNo: string
  academyName: string
  amount: number
  paymentGateway: "Razorpay" | "Stripe"
  status: "SUCCESSFUL" | "FAILED" | "REFUNDED"
  paymentDate: string
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "tx-901", invoiceNo: "INV-2026-001", academyName: "Apex Tech Institute", amount: 99990, paymentGateway: "Razorpay", status: "SUCCESSFUL", paymentDate: "2026-01-15 11:30" },
  { id: "tx-902", invoiceNo: "INV-2026-002", academyName: "Stark Photography Academy", amount: 2499, paymentGateway: "Razorpay", status: "SUCCESSFUL", paymentDate: "2026-09-10 14:20" },
  { id: "tx-903", invoiceNo: "INV-2026-003", academyName: "DesignCraft Studio Academy", amount: 999, paymentGateway: "Stripe", status: "FAILED", paymentDate: "2026-09-01 09:15" },
  { id: "tx-904", invoiceNo: "INV-2026-004", academyName: "Global Civil Services Hub", amount: 24990, paymentGateway: "Razorpay", status: "SUCCESSFUL", paymentDate: "2026-04-20 16:45" },
  { id: "tx-905", invoiceNo: "INV-2026-005", academyName: "Quantum Coding Labs", amount: 999, paymentGateway: "Stripe", status: "REFUNDED", paymentDate: "2026-08-15 18:00" },
]

export default function PlatformPaymentsPage() {
  const [txs] = useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filteredTxs = txs.filter(t => {
    const matchesSearch = t.academyName.toLowerCase().includes(search.toLowerCase()) || t.invoiceNo.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalSuccessful = txs.filter(t => t.status === "SUCCESSFUL").reduce((acc, t) => acc + t.amount, 0)

  const downloadInvoice = (inv: string) => {
    toast.success(`Downloading PDF receipt for invoice ${inv}...`)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              Echo FINANCIAL AUDIT
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Payments & Transactions</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Financial overview across all tenant academies, invoices, Razorpay/Stripe gateways & refunds.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Processed Revenue</span>
          <div className="text-3xl font-black text-slate-900 mt-2 font-mono">₹{totalSuccessful.toLocaleString()}</div>
          <span className="text-xs text-emerald-700 font-bold mt-1 block">Successful gateway settlements</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Successful Transactions</span>
          <div className="text-3xl font-black text-emerald-700 mt-2 font-mono">{txs.filter(t => t.status === "SUCCESSFUL").length}</div>
          <span className="text-xs text-slate-500 font-semibold mt-1 block">96.2% Settlement Rate</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Failed / Refunded</span>
          <div className="text-3xl font-black text-rose-600 mt-2 font-mono">{txs.filter(t => t.status !== "SUCCESSFUL").length}</div>
          <span className="text-xs text-rose-700 font-bold mt-1 block">Auto-reconciled via Webhook</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search academy or invoice number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Transaction Statuses</option>
            <option value="SUCCESSFUL">Successful</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Invoice #</th>
                <th className="py-4 px-6">Academy</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Payment Gateway</th>
                <th className="py-4 px-6">Payment Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTxs.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">
                    {t.invoiceNo}
                  </td>

                  <td className="py-4 px-6 font-extrabold text-slate-800">
                    {t.academyName}
                  </td>

                  <td className="py-4 px-6 font-mono font-black text-slate-900">
                    ₹{t.amount.toLocaleString()}
                  </td>

                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                      {t.paymentGateway}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-slate-500">
                    {t.paymentDate}
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      t.status === "SUCCESSFUL"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : t.status === "REFUNDED"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                      {t.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => downloadInvoice(t.invoiceNo)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
