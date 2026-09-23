"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Download, Plus, IndianRupee, TrendingUp, AlertCircle, FileText, CheckCircle2, Clock, XCircle, Loader2, X, Eye, Mail, Printer, MessageCircle, Building2, Trash2, Calendar, CreditCard, Tag, Sparkles, UserCheck, BookOpen } from "lucide-react"
import { useApi, fetchApi } from "@/lib/useApi"
import { toast } from "sonner"

// Types
type InvoiceStatus = 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE' | 'CANCELLED'
type DiscountType = 'FLAT' | 'PERCENTAGE'

interface LineItem {
  id: string
  description: string
  amount: number
}

interface InstallmentSchedule {
  installmentNo: number
  amount: number
  dueDate: string
}

export default function FeeManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: feesData, mutate, isLoading } = useApi<any>("/academy/fees")
  const { data: enrollData } = useApi<any>("/academy/enroll/all")
  const { data: studentsData } = useApi<any>("/academy/students")
  const { data: batchesData } = useApi<any>("/academy/batches")
  const { data: orgData } = useApi<any>("/settings/organization")
  
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<any | null>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentRef, setPaymentRef] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Smart Invoice Generator Form State
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [selectedBatchId, setSelectedBatchId] = useState("")
  const [enrollmentId, setEnrollmentId] = useState("")
  
  const [baseCourseFee, setBaseCourseFee] = useState<number | string>("25000")
  const [discountType, setDiscountType] = useState<DiscountType>("FLAT")
  const [discountValue, setDiscountValue] = useState<number | string>("0")
  const [taxRate, setTaxRate] = useState<number>(18)
  const [referralCode, setReferralCode] = useState("")
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().split("T")[0]
  })
  const [notes, setNotes] = useState("")
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  
  // EMI & Installment Plan
  const [paymentPlan, setPaymentPlan] = useState<'FULL' | 'INSTALLMENTS'>('FULL')
  const [installmentCount, setInstallmentCount] = useState<number>(2)
  const [customSchedules, setCustomSchedules] = useState<InstallmentSchedule[]>([])

  const stats = feesData?.stats || { totalCollected: 0, totalOutstanding: 0, overdueCount: 0 }
  const installments = feesData?.installments || (Array.isArray(feesData) ? feesData : [])
  const org = orgData || {}

  const allEnrollments = useMemo(() => {
    return enrollData?.enrollments || (Array.isArray(enrollData) ? enrollData : [])
  }, [enrollData])

  const allStudents = useMemo(() => {
    return studentsData?.students || (Array.isArray(studentsData) ? studentsData : [])
  }, [studentsData])

  const allBatches = useMemo(() => {
    return Array.isArray(batchesData) ? batchesData : []
  }, [batchesData])

  // Handle Student Selection Change -> Auto Fill Active Enrollment & Batch
  const handleStudentChange = (stId: string) => {
    setSelectedStudentId(stId)
    if (!stId) {
      setEnrollmentId("")
      return
    }
    const studentEnr = allEnrollments.find((e: any) => e.studentId === stId || e.student?.id === stId)
    if (studentEnr) {
      setEnrollmentId(studentEnr.id)
      if (studentEnr.batchId) setSelectedBatchId(studentEnr.batchId)
    }
  }

  // Handle Batch Change -> Filter Students or Set Base Price
  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(batchId)
    const batch = allBatches.find((b: any) => b.id === batchId)
    if (batch?.course?.price) {
      setBaseCourseFee(batch.course.price)
    }
  }

  // Live Invoice Calculations
  const calculatedGross = useMemo(() => {
    const base = Number(baseCourseFee || 0)
    const extras = lineItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0)
    return base + extras
  }, [baseCourseFee, lineItems])

  const calculatedDiscount = useMemo(() => {
    const val = Number(discountValue || 0)
    if (discountType === 'PERCENTAGE') {
      return (calculatedGross * val) / 100
    }
    return val
  }, [calculatedGross, discountType, discountValue])

  const taxableAmount = useMemo(() => {
    return Math.max(0, calculatedGross - calculatedDiscount)
  }, [calculatedGross, calculatedDiscount])

  const calculatedTax = useMemo(() => {
    return (taxableAmount * Number(taxRate || 0)) / 100
  }, [taxableAmount, taxRate])

  const netPayable = useMemo(() => {
    return taxableAmount + calculatedTax
  }, [taxableAmount, calculatedTax])

  // Auto Generate Installments Schedule
  const generateInstallments = (count: number, total: number) => {
    const perInst = Math.round(total / count)
    const schedules: InstallmentSchedule[] = []
    const today = new Date()

    for (let i = 0; i < count; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() + i * 30) // 30 day interval per installment
      schedules.push({
        installmentNo: i + 1,
        amount: i === count - 1 ? total - perInst * (count - 1) : perInst,
        dueDate: d.toISOString().split("T")[0]
      })
    }
    setCustomSchedules(schedules)
  }

  const handleTogglePaymentPlan = (plan: 'FULL' | 'INSTALLMENTS') => {
    setPaymentPlan(plan)
    if (plan === 'INSTALLMENTS') {
      generateInstallments(installmentCount, netPayable)
    }
  }

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { id: Math.random().toString(), description: "", amount: 0 }])
  }

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter(i => i.id !== id))
  }

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
    
    // Find active enrollment
    let targetEnrollmentId = enrollmentId
    if (!targetEnrollmentId && selectedStudentId) {
      const match = allEnrollments.find((en: any) => en.studentId === selectedStudentId || en.student?.id === selectedStudentId)
      if (match) targetEnrollmentId = match.id
    }

    if (!targetEnrollmentId) {
      toast.error("Please select a student with an active course enrollment.")
      return
    }

    if (!baseCourseFee || Number(baseCourseFee) <= 0) {
      toast.error("Please enter a valid course fee amount.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        enrollmentId: targetEnrollmentId,
        amount: Number(baseCourseFee),
        taxRate: Number(taxRate || 0),
        discount: Number(discountValue || 0),
        discountType,
        referralCode,
        dueDate: new Date(dueDate).toISOString(),
        notes,
        lineItems: lineItems.filter(item => item.description && item.amount > 0),
        installments: paymentPlan === 'INSTALLMENTS' ? customSchedules : undefined
      }

      await fetchApi("/academy/fees", {
        method: "POST",
        body: JSON.stringify(payload)
      })

      toast.success(paymentPlan === 'INSTALLMENTS' ? `${customSchedules.length} Installments issued successfully!` : "Tax Invoice issued successfully!")
      setIsSlideOverOpen(false)
      setSelectedStudentId("")
      setSelectedBatchId("")
      setEnrollmentId("")
      setBaseCourseFee("25000")
      setDiscountValue("0")
      setNotes("")
      setLineItems([])
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to issue invoice")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentModalInvoice || !paymentAmount) return
    setIsSubmitting(true)
    try {
      await fetchApi(`/academy/fees/installment/${paymentModalInvoice.id}/pay`, {
        method: "PATCH",
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          paymentRef,
          notes: "Recorded by admin"
        })
      })
      toast.success("Payment recorded successfully!")
      setPaymentModalInvoice(null)
      setPaymentAmount("")
      setPaymentRef("")
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to record payment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendWhatsAppInvoice = (invoice: any) => {
    if (!invoice) return
    const student = invoice.enrollment?.student?.user
    const studentPhone = student?.phone || invoice.enrollment?.student?.phone || ""
    const cleanPhone = studentPhone.replace(/\D/g, "")
    const courseName = invoice.enrollment?.batch?.course?.name || "Course Fee"
    const amountVal = Number(invoice.amount || 0)
    const taxVal = Number(invoice.taxRate || 0)
    const totalAmount = (amountVal + (amountVal * taxVal) / 100).toFixed(2)
    const invId = (invoice.id || "").slice(-6).toUpperCase()

    const message = `🧾 *INVOICE ACKNOWLEDGEMENT - ${org.name || "Echo Academy"}*\n\n` +
      `*Invoice #:* ${invId}\n` +
      `*Student:* ${student?.firstName || ""} ${student?.lastName || ""}\n` +
      `*Course:* ${courseName}\n` +
      `*Amount:* ₹${totalAmount}\n` +
      `*Status:* ${invoice.status || "PENDING"}\n` +
      (invoice.dueDate ? `*Due Date:* ${new Date(invoice.dueDate).toLocaleDateString("en-IN")}\n\n` : "\n") +
      `Thank you for choosing ${org.name || "Echo Academy"}!`

    const whatsappUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, "_blank")
    toast.success("Opening WhatsApp with invoice details...")
  }

  const filteredInstallments = (Array.isArray(installments) ? installments : []).filter((item: any) => {
    if (!item) return false
    const name = `${item.enrollment?.student?.user?.firstName || ''} ${item.enrollment?.student?.user?.lastName || ''}`.toLowerCase()
    const id = (item.id || '').toLowerCase()
    return name.includes(searchQuery.toLowerCase()) || id.includes(searchQuery.toLowerCase())
  })

  // Selected Invoice helpers
  const invAmt = Number(selectedInvoice?.amount || 0)
  const invTax = Number(selectedInvoice?.taxRate || 18)
  const invPaid = Number(selectedInvoice?.paidAmount || (selectedInvoice?.status === 'PAID' ? invAmt : 0))
  const invRem = Math.max(0, invAmt - invPaid)
  const taxAmt = (invAmt * invTax) / 100
  const totalPayable = invAmt + taxAmt
  const selectedInvId = (selectedInvoice?.id || '').slice(-6).toUpperCase()


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
            <div className="text-2xl font-black text-slate-900">₹{Number(stats?.totalCollected || 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider mb-1">Outstanding Balance</h3>
            <div className="text-2xl font-black text-slate-900">₹{Number(stats?.totalOutstanding || 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-wider mb-1">Overdue Invoices</h3>
            <div className="text-2xl font-black text-slate-900">
              <span className="text-rose-600 mr-2">{stats?.overdueCount || 0}</span> Invoices
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
              ) : filteredInstallments.map((invoice: any, idx: number) => {
                const statusConfig = getStatusConfig(invoice.status || 'PENDING')
                const StatusIcon = statusConfig.icon
                const amountVal = Number(invoice.amount || 0)
                const paidVal = Number(invoice.paidAmount || 0)
                const invId = (invoice.id || `INV${idx}`).slice(-6).toUpperCase()
                
                return (
                  <tr key={invoice.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">
                      #{invId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900">
                        {invoice.enrollment?.student?.user?.firstName || 'Student'} {invoice.enrollment?.student?.user?.lastName || ''}
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5 font-medium">{invoice.enrollment?.batch?.course?.name || "Unknown Course"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-900">₹{amountVal.toLocaleString()}</div>
                      {paidVal > 0 && <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Paid: ₹{paidVal.toLocaleString()}</div>}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      <div>{invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric'}) : '-'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Due: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric'}) : '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusConfig.bg}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {invoice.status || 'PENDING'}
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

      {/* TOPNOTCH INVOICE GENERATOR SLIDEOVER */}
      {isSlideOverOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsSlideOverOpen(false)} />
          <div className="w-full md:w-[680px] bg-white h-full border-l border-slate-200 relative flex flex-col shadow-2xl z-10 animate-in slide-in-from-right text-slate-900">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  Topnotch Invoice Generator
                </h2>
                <p className="text-xs text-slate-500 font-medium">Issue customized tax invoices with flat deductions, extra line items, and EMI plans.</p>
              </div>
              <button onClick={() => setIsSlideOverOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Step 1: Student & Course Picker */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-600" /> 1. Student & Course Selection
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Select Student *</label>
                    <select 
                      required
                      value={selectedStudentId} 
                      onChange={e => handleStudentChange(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500 shadow-xs"
                    >
                      <option value="">-- Search & Choose Student --</option>
                      {allStudents.map((st: any) => (
                        <option key={st.id} value={st.id}>
                          {st.user?.firstName} {st.user?.lastName} ({st.user?.email || st.user?.phone || 'No Contact'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Select Batch / Course</label>
                    <select 
                      value={selectedBatchId} 
                      onChange={e => handleBatchChange(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500 shadow-xs"
                    >
                      <option value="">-- Select Course / Cohort --</option>
                      {allBatches.map((b: any) => (
                        <option key={b.id} value={b.id}>
                          {b.name} — {b.course?.name || "Course"} (₹{b.course?.price || "25,000"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Enrollment selector fallback */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Active Enrollment Context</label>
                  <select 
                    value={enrollmentId} 
                    onChange={e => setEnrollmentId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-teal-500"
                  >
                    <option value="">-- Choose Direct Enrollment --</option>
                    {allEnrollments.map((en: any) => (
                      <option key={en.id} value={en.id}>
                        {en.student?.user?.firstName} {en.student?.user?.lastName} — {en.batch?.course?.name || "Course Enrollment"} ({en.id.slice(-6)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 2: Base Pricing & Flat Deduction Options */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-teal-600" /> 2. Fee Amount, Flat Deduction & Discounts
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Base Course Fee (₹) *</label>
                    <input 
                      required
                      type="number"
                      placeholder="e.g. 25000"
                      value={baseCourseFee}
                      onChange={e => setBaseCourseFee(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">GST Tax Rate (%)</label>
                    <div className="flex gap-2">
                      {[0, 5, 12, 18].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setTaxRate(rate)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${taxRate === rate ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Deduction / Discount Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Deduction Type</label>
                    <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                      <button 
                        type="button" 
                        onClick={() => setDiscountType('FLAT')} 
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${discountType === 'FLAT' ? 'bg-teal-600 text-white' : 'text-slate-600'}`}
                      >
                        Flat (₹)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setDiscountType('PERCENTAGE')} 
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${discountType === 'PERCENTAGE' ? 'bg-teal-600 text-white' : 'text-slate-600'}`}
                      >
                        Percent (%)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      {discountType === 'FLAT' ? 'Flat Deduction Amount (₹)' : 'Percentage Discount (%)'}
                    </label>
                    <input 
                      type="number"
                      placeholder={discountType === 'FLAT' ? "e.g. 5000" : "e.g. 10"}
                      value={discountValue}
                      onChange={e => setDiscountValue(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Referral / Promo Code</label>
                    <input 
                      type="text"
                      placeholder="e.g. REF100"
                      value={referralCode}
                      onChange={e => setReferralCode(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500 uppercase font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Additional Line Items (Books, Exam, Kit Fees) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-teal-600" /> 3. Additional Line Items & Materials
                  </h3>
                  <button type="button" onClick={handleAddLineItem} className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                </div>

                {lineItems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No extra charges added (e.g., Exam Fee, Registration, Materials).</p>
                ) : (
                  <div className="space-y-2">
                    {lineItems.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <input 
                          placeholder="Item Description (e.g., Study Materials & Books)" 
                          value={item.description} 
                          onChange={e => {
                            const updated = lineItems.map(i => i.id === item.id ? { ...i, description: e.target.value } : i)
                            setLineItems(updated)
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                        />
                        <input 
                          type="number"
                          placeholder="Amount (₹)" 
                          value={item.amount || ''} 
                          onChange={e => {
                            const updated = lineItems.map(i => i.id === item.id ? { ...i, amount: parseFloat(e.target.value) || 0 } : i)
                            setLineItems(updated)
                          }}
                          className="w-32 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                        />
                        <button type="button" onClick={() => handleRemoveLineItem(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 4: Payment Schedule / EMI Installments */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" /> 4. Payment Plan & Installments (EMI)
                  </h3>
                  
                  <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                    <button 
                      type="button" 
                      onClick={() => handleTogglePaymentPlan('FULL')} 
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${paymentPlan === 'FULL' ? 'bg-teal-600 text-white' : 'text-slate-600'}`}
                    >
                      Single Invoice
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleTogglePaymentPlan('INSTALLMENTS')} 
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${paymentPlan === 'INSTALLMENTS' ? 'bg-teal-600 text-white' : 'text-slate-600'}`}
                    >
                      EMI Installments
                    </button>
                  </div>
                </div>

                {paymentPlan === 'FULL' ? (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Invoice Due Date *</label>
                    <input 
                      required
                      type="date"
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">Number of Installments:</label>
                      {[2, 3, 4].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => {
                            setInstallmentCount(count)
                            generateInstallments(count, netPayable)
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${installmentCount === count ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-700 border-slate-200'}`}
                        >
                          {count} Installments
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2">
                      {customSchedules.map((sch, idx) => (
                        <div key={idx} className="flex gap-3 items-center bg-white p-3 border border-slate-200 rounded-xl">
                          <span className="text-xs font-bold text-slate-700 w-24">Installment {sch.installmentNo}:</span>
                          <div className="flex-1 flex gap-2">
                            <input 
                              type="number" 
                              value={sch.amount} 
                              onChange={e => {
                                const val = parseFloat(e.target.value) || 0
                                const updated = [...customSchedules]
                                updated[idx].amount = val
                                setCustomSchedules(updated)
                              }}
                              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900" 
                            />
                            <input 
                              type="date" 
                              value={sch.dueDate} 
                              onChange={e => {
                                const updated = [...customSchedules]
                                updated[idx].dueDate = e.target.value
                                setCustomSchedules(updated)
                              }}
                              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Invoice Notes / Terms</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Non-refundable admission fee. Installments due strictly on scheduled dates."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Live Calculation Summary Box */}
              <div className="bg-teal-900 text-white rounded-2xl p-6 shadow-xl space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-teal-300">Live Fee Calculation Summary</h4>
                <div className="space-y-1.5 text-xs text-teal-100 border-b border-teal-800/80 pb-3">
                  <div className="flex justify-between">
                    <span>Base Course Fee:</span>
                    <span>₹{Number(baseCourseFee || 0).toLocaleString()}</span>
                  </div>
                  {lineItems.length > 0 && (
                    <div className="flex justify-between text-amber-300 font-semibold">
                      <span>Extra Line Items:</span>
                      <span>+ ₹{lineItems.reduce((acc, i) => acc + (i.amount || 0), 0).toLocaleString()}</span>
                    </div>
                  )}
                  {calculatedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-300 font-semibold">
                      <span>Flat Deduction / Discount:</span>
                      <span>- ₹{calculatedDiscount.toLocaleString()} ({discountType === 'PERCENTAGE' ? `${discountValue}%` : 'Flat'})</span>
                    </div>
                  )}
                  <div className="flex justify-between text-teal-200 font-semibold pt-1 border-t border-teal-800/50">
                    <span>Taxable Base Amount:</span>
                    <span>₹{taxableAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-teal-200 font-semibold">
                    <span>GST ({taxRate}%):</span>
                    <span>₹{calculatedTax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-black text-white pt-1">
                  <span>Net Payable Total:</span>
                  <span className="text-2xl font-black text-amber-300">₹{netPayable.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsSlideOverOpen(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors shadow-md disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Issue & Send Invoice</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK RECORD PAYMENT MODAL */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-900">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Record Payment
              </h3>
              <button onClick={() => setPaymentModalInvoice(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Student</label>
                <input disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800"
                  value={`${paymentModalInvoice.enrollment?.student?.user?.firstName || ''} ${paymentModalInvoice.enrollment?.student?.user?.lastName || ''}`} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Payment Amount (₹) *</label>
                <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-teal-500 outline-none"
                  value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Payment Reference / UTR / Cheque No.</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 outline-none font-mono"
                  placeholder="e.g. UPI/12948102948 or Cash"
                  value={paymentRef} onChange={e => setPaymentRef(e.target.value)} />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setPaymentModalInvoice(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-xs disabled:opacity-50">
                  {isSubmitting ? "Recording..." : "Confirm Payment"}
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
                  <p className="text-teal-700 font-mono font-bold text-sm mt-1">#{selectedInvId}</p>
                  
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
                  <p className="font-extrabold text-slate-900 text-base">
                    {selectedInvoice.enrollment?.student?.user?.firstName || 'Student'} {selectedInvoice.enrollment?.student?.user?.lastName || ''}
                  </p>
                  <p className="text-slate-600 text-xs font-mono">{selectedInvoice.enrollment?.student?.user?.email || ''}</p>
                  {selectedInvoice.enrollment?.student?.user?.phone && (
                    <p className="text-slate-600 text-xs font-mono">{selectedInvoice.enrollment?.student?.user?.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Invoice Details</p>
                  <p className="text-slate-800 text-xs font-semibold">Issue Date: {selectedInvoice.createdAt ? new Date(selectedInvoice.createdAt).toLocaleDateString('en-IN') : '-'}</p>
                  <p className="text-slate-800 text-xs font-semibold">Due Date: {selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString('en-IN') : '-'}</p>
                  <p className="text-slate-800 text-xs font-semibold mt-1">Status: <span className="font-bold text-teal-700 uppercase">{selectedInvoice.status || 'PENDING'}</span></p>
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
                    <td className="py-4 text-right font-bold text-slate-900">₹{invAmt.toLocaleString()}</td>
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
                    <span className="font-black text-emerald-700 text-sm">₹{invPaid.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Remaining Due</span>
                    <span className="font-black text-rose-600 text-sm">
                      ₹{invRem.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Next Due Date</span>
                    <span className="font-bold text-slate-800 text-sm">{selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString('en-IN') : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Calculation Totals */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Subtotal</span>
                    <span>₹{invAmt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>GST Tax ({invTax}%)</span>
                    <span>₹{taxAmt.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-xl pt-3 border-t-2 border-slate-900 text-slate-900">
                    <span>Total Payable</span>
                    <span>₹{totalPayable.toFixed(2)}</span>
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
