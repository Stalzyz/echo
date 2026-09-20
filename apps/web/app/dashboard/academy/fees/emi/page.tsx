"use client"

import { useState } from "react"
import { 
  DollarSign, Calendar, AlertTriangle, CheckCircle2, Clock, 
  Send, Plus, Search, Filter, Calculator, X, ArrowRight, User, Settings, ShieldCheck, Percent, HelpCircle
} from "lucide-react"
import { toast } from "sonner"

interface StudentEmiPlan {
  id: string
  studentName: string
  courseName: string
  totalFee: number
  paidFee: number
  installmentCount: number
  installmentAmount: number
  nextDueDate: string
  status: "ACTIVE" | "COMPLETED" | "OVERDUE"
  phone: string
  ruleApplied: string
}

interface EmiRule {
  id: string
  name: string
  mode: "ZERO_COST" | "SURCHARGE"
  surchargePercent: number
  minDownPaymentPercent: number
  lateFeePenalty: number
  isActive: boolean
}

const INITIAL_EMI_PLANS: StudentEmiPlan[] = [
  {
    id: "emi-201",
    studentName: "Aditya Roy",
    courseName: "Full Stack MERN Web Development",
    totalFee: 30000,
    paidFee: 10000,
    installmentCount: 3,
    installmentAmount: 10000,
    nextDueDate: "2026-10-05",
    status: "ACTIVE",
    phone: "+91 98765 43210",
    ruleApplied: "Zero Extra Charge (0%)"
  },
  {
    id: "emi-202",
    studentName: "Meera Krishnan",
    courseName: "UI/UX Product Design Masterclass",
    totalFee: 25200,
    paidFee: 8400,
    installmentCount: 3,
    installmentAmount: 8400,
    nextDueDate: "2026-09-15",
    status: "OVERDUE",
    phone: "+91 91234 56789",
    ruleApplied: "Standard 5% Surcharge"
  },
  {
    id: "emi-203",
    studentName: "Siddharth Mehta",
    courseName: "Data Science & AI Bootcamp",
    totalFee: 45000,
    paidFee: 45000,
    installmentCount: 3,
    installmentAmount: 15000,
    nextDueDate: "2026-08-30",
    status: "COMPLETED",
    phone: "+91 99887 76655",
    ruleApplied: "Zero Extra Charge (0%)"
  }
]

export default function EmiSchedulePage() {
  const [plans, setPlans] = useState<StudentEmiPlan[]>(INITIAL_EMI_PLANS)
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "OVERDUE" | "COMPLETED">("ALL")
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCalcOpen, setIsCalcOpen] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)

  // EMI Rules State
  const [rules, setRules] = useState<EmiRule[]>([
    {
      id: "rule_1",
      name: "Zero Extra Charge (0% Interest)",
      mode: "ZERO_COST",
      surchargePercent: 0,
      minDownPaymentPercent: 33,
      lateFeePenalty: 0,
      isActive: true
    },
    {
      id: "rule_2",
      name: "Standard 5% Surcharge Plan",
      mode: "SURCHARGE",
      surchargePercent: 5,
      minDownPaymentPercent: 20,
      lateFeePenalty: 500,
      isActive: false
    }
  ])

  const [activeRuleId, setActiveRuleId] = useState<string>("rule_1")
  const currentRule = rules.find(r => r.id === activeRuleId) || rules[0]

  // EMI Calculator State
  const [calcFee, setCalcFee] = useState(36000)
  const [calcMonths, setCalcMonths] = useState(3)

  // New EMI Plan Form
  const [form, setForm] = useState({
    studentName: "",
    phone: "",
    courseName: "Full Stack Web Development",
    totalFee: 36000,
    installmentCount: 3,
    nextDueDate: ""
  })

  // Calculate Surcharge & EMI
  const surchargeFee = currentRule.mode === "SURCHARGE" ? Math.round(calcFee * (currentRule.surchargePercent / 100)) : 0
  const finalTotalFee = calcFee + surchargeFee
  const monthlyInstallment = Math.round(finalTotalFee / calcMonths)
  const downPayment = Math.round(finalTotalFee * (currentRule.minDownPaymentPercent / 100))

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault()
    const ruleSurcharge = currentRule.mode === "SURCHARGE" ? Math.round(form.totalFee * (currentRule.surchargePercent / 100)) : 0
    const totalWithRule = form.totalFee + ruleSurcharge
    const instAmt = Math.round(totalWithRule / form.installmentCount)

    const newPlan: StudentEmiPlan = {
      id: `emi-${Date.now().toString().slice(-4)}`,
      studentName: form.studentName,
      phone: form.phone,
      courseName: form.courseName,
      totalFee: totalWithRule,
      paidFee: instAmt, // 1st installment paid upfront
      installmentCount: form.installmentCount,
      installmentAmount: instAmt,
      nextDueDate: form.nextDueDate || "2026-10-15",
      status: "ACTIVE",
      ruleApplied: currentRule.name
    }
    setPlans([newPlan, ...plans])
    setIsModalOpen(false)
    toast.success("Student EMI installment schedule created!")
  }

  const handleSendReminder = (plan: StudentEmiPlan) => {
    toast.success(`WhatsApp & SMS fee reminder dispatched to ${plan.studentName}!`)
  }

  const filtered = plans.filter(p => {
    if (activeTab !== "ALL" && p.status !== activeTab) return false
    if (search && !p.studentName.toLowerCase().includes(search.toLowerCase()) && !p.courseName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Top Header */}
      <div className="flex-none px-8 py-6 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-black shadow-xs">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student EMI & Installment Schedule Builder</h1>
            <p className="text-xs text-slate-500 font-medium">Manage flexible course fee installments, automated due alerts, and custom EMI rules.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsRulesOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            <Settings className="w-4 h-4 text-teal-600" /> EMI Rules Control System
          </button>

          <button 
            onClick={() => setIsCalcOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            <Calculator className="w-4 h-4 text-teal-600" /> EMI Calculator
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create EMI Schedule
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
        
        {/* Rule Active Banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-900 block">Active Rule Engine: {currentRule.name}</span>
              <span className="text-[11px] text-teal-700">
                {currentRule.mode === "ZERO_COST" 
                  ? "Zero Extra Charge (0% Interest). Students pay exact course fee split into installments."
                  : `Custom Surcharge: ${currentRule.surchargePercent}% extra charge applied to total course fee.`}
              </span>
            </div>
          </div>
          <button onClick={() => setIsRulesOpen(true)} className="text-xs font-bold text-teal-700 hover:underline">Change Rules</button>
        </div>

        {/* Metric Cards Banner */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Managed EMI Capital</span>
            <span className="text-2xl font-black text-slate-900 block">₹{plans.reduce((a, b) => a + b.totalFee, 0).toLocaleString()}</span>
            <span className="text-[10px] font-bold text-teal-600">Active Installment Plans</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Collected Fees</span>
            <span className="text-2xl font-black text-emerald-600 block">₹{plans.reduce((a, b) => a + b.paidFee, 0).toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-600">Upfront & Monthly</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Due Balance</span>
            <span className="text-2xl font-black text-slate-900 block">₹{plans.reduce((a, b) => a + (b.totalFee - b.paidFee), 0).toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-400">Scheduled Installments</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Overdue Installments</span>
            <span className="text-2xl font-black text-rose-600 block">{plans.filter(p => p.status === "OVERDUE").length}</span>
            <span className="text-[10px] font-bold text-rose-600">Requires Follow-up</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            {(["ALL", "ACTIVE", "OVERDUE", "COMPLETED"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab 
                    ? "bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs" 
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              placeholder="Search student or course..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600"
            />
          </div>
        </div>

        {/* EMI Table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Student & Course</th>
                <th className="py-4 px-4 text-right">Total Fee</th>
                <th className="py-4 px-4 text-right">Paid Fee</th>
                <th className="py-4 px-4 text-center">EMI Breakdown</th>
                <th className="py-4 px-4">Next Due Date</th>
                <th className="py-4 px-4 text-center">Rule Applied</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filtered.map(p => {
                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 block">{p.studentName}</span>
                      <span className="text-[11px] text-slate-400">{p.courseName}</span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900">₹{p.totalFee.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right font-bold text-emerald-600">₹{p.paidFee.toLocaleString()}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-slate-800 block">₹{p.installmentAmount.toLocaleString()} / mo</span>
                      <span className="text-[10px] text-slate-400">{p.installmentCount} Monthly Installments</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">{p.nextDueDate}</td>
                    <td className="py-4 px-4 text-center text-[11px] font-medium text-slate-500">
                      {p.ruleApplied || "Standard"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${
                        p.status === "ACTIVE" ? "bg-teal-50 text-teal-800 border-teal-200" :
                        p.status === "COMPLETED" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                        "bg-rose-50 text-rose-800 border-rose-200"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {p.status !== "COMPLETED" && (
                        <button 
                          onClick={() => handleSendReminder(p)}
                          className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5 text-teal-600" /> Remind Fee
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EMI Rules Control System Modal */}
      {isRulesOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] flex flex-col my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-black text-slate-900">EMI Rules & Control System</h2>
              </div>
              <button onClick={() => setIsRulesOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <div className="space-y-4 overflow-y-auto custom-scrollbar p-1 flex-1">
              <p className="text-xs text-slate-500 font-medium">Configure and customize active fee rules for student installment plans.</p>
              
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div 
                    key={rule.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      activeRuleId === rule.id 
                        ? "bg-teal-50/80 border-teal-400 shadow-xs" 
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{rule.name}</h4>
                        <span className="text-[10px] text-slate-500 font-semibold">{rule.mode === "ZERO_COST" ? "Zero Extra Charge (0% Interest)" : `Custom Surcharge (${rule.surchargePercent}%)`}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeRuleId === rule.id ? (
                          <span className="px-2 py-0.5 bg-teal-600 text-white text-[10px] font-bold rounded-md">ACTIVE</span>
                        ) : (
                          <button onClick={() => { setActiveRuleId(rule.id); toast.success(`Activated rule: ${rule.name}`); }} className="px-2 py-0.5 bg-slate-200 hover:bg-teal-600 hover:text-white text-slate-700 text-[10px] font-bold rounded-md transition-colors">
                            Set Active
                          </button>
                        )}
                        {rules.length > 1 && (
                          <button onClick={() => { setRules(rules.filter(r => r.id !== rule.id)); if(activeRuleId === rule.id) setActiveRuleId(rules.find(r => r.id !== rule.id)?.id || ''); }} className="p-1 text-slate-400 hover:text-rose-600">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 mt-3 pt-2.5 border-t border-slate-200/80">
                      <div>
                        <span className="text-slate-400 block">Surcharge Rate:</span>
                        <span className="font-bold text-slate-900">{rule.mode === "ZERO_COST" ? "0%" : `${rule.surchargePercent}%`}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Min Down Payment:</span>
                        <span className="font-bold text-slate-900">{rule.minDownPaymentPercent}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Late Fee / Mo:</span>
                        <span className="font-bold text-slate-900">₹{rule.lateFeePenalty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Rule Section */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">Add Custom EMI Rule</span>
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <input id="newRuleName" placeholder="Rule Name (e.g. Festival 3% Offer)" className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium" />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Type</label>
                      <select id="newRuleMode" className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold">
                        <option value="ZERO_COST">0% Extra</option>
                        <option value="SURCHARGE">% Surcharge</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Surcharge %</label>
                      <input id="newRuleSurcharge" type="number" defaultValue={5} className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Down Pay %</label>
                      <input id="newRuleDown" type="number" defaultValue={25} className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold" />
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const nameEl = document.getElementById("newRuleName") as HTMLInputElement
                      const modeEl = document.getElementById("newRuleMode") as HTMLSelectElement
                      const surEl = document.getElementById("newRuleSurcharge") as HTMLInputElement
                      const downEl = document.getElementById("newRuleDown") as HTMLInputElement
                      
                      const name = nameEl?.value || "Custom EMI Rule"
                      const mode = (modeEl?.value || "SURCHARGE") as any
                      const surchargePercent = parseInt(surEl?.value || "0")
                      const minDownPaymentPercent = parseInt(downEl?.value || "25")

                      const newRule: EmiRule = {
                        id: `rule_${Date.now()}`,
                        name,
                        mode,
                        surchargePercent: mode === "ZERO_COST" ? 0 : surchargePercent,
                        minDownPaymentPercent,
                        lateFeePenalty: 250,
                        isActive: true
                      }

                      setRules([...rules, newRule])
                      setActiveRuleId(newRule.id)
                      if (nameEl) nameEl.value = ""
                      toast.success(`Custom EMI rule "${name}" created and set active!`)
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    + Add & Set Active Rule
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 shrink-0 border-t border-slate-100">
              <button onClick={() => setIsRulesOpen(false)} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs">
                Done & Apply Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMI Calculator Modal */}
      {isCalcOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-black text-slate-900">EMI Calculator</h2>
              </div>
              <button onClick={() => setIsCalcOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Applied Rule:</span>
                <span className="text-xs font-bold text-teal-700">{currentRule.name}</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Base Course Fee (₹)</label>
                <input type="number" value={calcFee} onChange={e => setCalcFee(parseInt(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-bold" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Tenure (Months)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 6, 12].map(m => (
                    <button 
                      key={m}
                      onClick={() => setCalcMonths(m)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        calcMonths === m ? "bg-teal-50 border-teal-300 text-teal-800" : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Installment Breakdown</span>
                {surchargeFee > 0 && (
                  <div className="flex justify-between items-center text-xs text-amber-700">
                    <span>Surcharge ({currentRule.surchargePercent}%):</span>
                    <span className="font-bold">+₹{surchargeFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-teal-800 font-medium">Monthly Installment:</span>
                  <span className="text-xl font-black text-teal-900">₹{monthlyInstallment.toLocaleString()} / mo</span>
                </div>
                <div className="flex justify-between items-center text-xs text-teal-700 pt-2 border-t border-teal-200/60">
                  <span>Down Payment ({currentRule.minDownPaymentPercent}%):</span>
                  <span className="font-bold">₹{downPayment.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button onClick={() => setIsCalcOpen(false)} className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl">Close Calculator</button>
          </div>
        </div>
      )}

      {/* Create EMI Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">Create Student EMI Schedule</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Student Name *</label>
                <input required value={form.studentName} onChange={e => setForm(p => ({ ...p, studentName: e.target.value }))} placeholder="e.g. Aditya Roy" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number (WhatsApp) *</label>
                <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Course Title</label>
                <input required value={form.courseName} onChange={e => setForm(p => ({ ...p, courseName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Base Fee (₹)</label>
                  <input type="number" value={form.totalFee} onChange={e => setForm(p => ({ ...p, totalFee: parseInt(e.target.value) || 0 }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Installment Months</label>
                  <select value={form.installmentCount} onChange={e => setForm(p => ({ ...p, installmentCount: parseInt(e.target.value) || 3 }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold">
                    <option value={2}>2 Months</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Next Installment Due Date</label>
                <input type="date" value={form.nextDueDate} onChange={e => setForm(p => ({ ...p, nextDueDate: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl">Generate Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
