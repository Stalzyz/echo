"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  DndContext, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Search, Filter, Mail, Phone, Calendar, MoreHorizontal, X, Loader2, Upload, Download, FileText, CheckCircle2 } from "lucide-react"
import { useApi, fetchApi } from "@/lib/useApi"
import { toast } from "sonner"

// Types
type ColumnType = 'ENQUIRY' | 'COUNSELLING' | 'TRIAL' | 'ENROLLED_ACADEMY' | 'DROPPED'

interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  courseInterest?: string
  score: number
  updatedAt?: string
  status: ColumnType
  source?: string
}

const columns: { id: ColumnType, title: string, color: string }[] = [
  { id: 'ENQUIRY', title: 'New Enquiry', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 'COUNSELLING', title: 'In Counselling', color: 'bg-amber-100 text-amber-900 border-amber-200' },
  { id: 'TRIAL', title: 'Free Trial', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 'ENROLLED_ACADEMY', title: 'Enrolled', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'DROPPED', title: 'Dropped', color: 'bg-rose-100 text-rose-800 border-rose-200' },
]

// Droppable Column Wrapper
function KanbanColumn({ column, leads, onSelectLead }: { column: typeof columns[0], leads: Lead[], onSelectLead: (lead: Lead, tab?: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col w-80 shrink-0 border rounded-2xl overflow-hidden transition-colors shadow-xs ${
        isOver ? 'bg-teal-50 border-teal-300' : 'bg-white border-slate-200'
      }`}
    >
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide border ${column.color}`}>
            {column.title}
          </span>
          <span className="text-slate-500 text-sm font-extrabold">{leads.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[150px] custom-scrollbar">
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map(lead => (
            <SortableLeadCard key={lead.id} lead={lead} onSelect={onSelectLead} />
          ))}
        </SortableContext>
        
        {leads.length === 0 && (
          <div className="h-full min-h-[100px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-medium">
            Drop leads here
          </div>
        )}
      </div>
    </div>
  )
}

// Sortable Item Component
function SortableLeadCard({ lead, onSelect }: { lead: Lead, onSelect: (lead: Lead, action?: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onClick={() => onSelect(lead, "CALL")}
      className="bg-white border border-slate-200 hover:border-teal-500/50 hover:shadow-md p-4 rounded-xl cursor-grab active:cursor-grabbing group relative z-10 transition-all"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">{lead.name}</h4>
          {lead.phone && <p className="text-[11px] text-slate-400 font-mono">{lead.phone}</p>}
        </div>
        <button 
          className="text-slate-400 hover:text-slate-700 transition-colors p-1" 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onSelect(lead, "CALL"); }}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-slate-500 font-medium mb-3">{lead.courseInterest || 'No Course Specified'}</p>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <button 
              className="w-7 h-7 rounded-full bg-teal-50 hover:bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 transition-colors" 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onSelect(lead, "CALL"); }}
            >
              <Phone className="w-3.5 h-3.5" />
            </button>
            <button 
              className="w-7 h-7 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 transition-colors" 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onSelect(lead, "EMAIL"); }}
            >
              <Mail className="w-3.5 h-3.5" />
            </button>
            <button 
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors" 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onSelect(lead, "MEETING"); }}
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Score</span>
          <span className={`text-xs font-black ${lead.score > 80 ? 'text-emerald-600' : lead.score > 50 ? 'text-amber-600' : 'text-rose-600'}`}>
            {lead.score || 50}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function AdmissionsPipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  const [newLead, setNewLead] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    courseInterest: "", 
    source: "WEBSITE",
    status: "ENQUIRY" as ColumnType
  })

  const { data: apiResponse, mutate } = useApi<any>("/crm/leads")

  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [actionTab, setActionTab] = useState<"CALL" | "EMAIL" | "MEETING">("CALL")
  const [actionNote, setActionNote] = useState("")
  const [actionStatus, setActionStatus] = useState<ColumnType>("ENQUIRY")
  const [isSubmittingAction, setIsSubmittingAction] = useState(false)

  const openLeadAction = (lead: Lead, action: string = "CALL") => {
    setSelectedLead(lead)
    setActionTab(action as any)
    setActionStatus(lead.status)
    setActionNote("")
  }

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead) return
    setIsSubmittingAction(true)
    try {
      if (actionNote) {
        await fetchApi(`/crm/leads/${selectedLead.id}/activities`, {
          method: "POST",
          body: JSON.stringify({
            type: actionTab,
            content: `[${actionTab}] ${actionNote}`
          })
        })
      }
      if (actionStatus !== selectedLead.status) {
        await fetchApi(`/crm/leads/${selectedLead.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: actionStatus })
        })
      }
      toast.success("Lead activity updated!")
      setSelectedLead(null)
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to record activity")
    } finally {
      setIsSubmittingAction(false)
    }
  }

  useEffect(() => {
    if (apiResponse?.data) {
      setLeads(apiResponse.data.map((l:any) => ({
        ...l, 
        status: columns.find(c => c.id === l.status) ? l.status : 'ENQUIRY'
      })))
    }
  }, [apiResponse])

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch = !searchTerm || 
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone?.includes(searchTerm) ||
        l.courseInterest?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "ALL" || l.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [leads, searchTerm, statusFilter])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeLead = leads.find(l => l.id === active.id)
    const overId = String(over.id)
    
    const overColumn = columns.find(c => c.id === overId)?.id || leads.find(l => l.id === overId)?.status

    if (activeLead && overColumn && activeLead.status !== overColumn) {
      setLeads(leads.map(lead => 
        lead.id === activeLead.id ? { ...lead, status: overColumn } : lead
      ))
      
      try {
        await fetchApi(`/crm/leads/${activeLead.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: overColumn })
        })
        mutate()
      } catch (err: any) {
        toast.error("Failed to move lead: " + err.message)
        mutate()
      }
    }
  }

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLead.name) {
      toast.error("Please enter a lead name")
      return
    }
    setIsSubmitting(true)
    
    const createdLead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: newLead.name,
      email: newLead.email || undefined,
      phone: newLead.phone || undefined,
      courseInterest: newLead.courseInterest || "General Enquiry",
      source: newLead.source || "WEBSITE",
      status: newLead.status || "ENQUIRY",
      score: 75,
    }

    try {
      await fetchApi("/crm/leads", {
        method: "POST",
        body: JSON.stringify({
          ...newLead,
          businessUnit: "ACADEMY"
        })
      }).catch(() => {})
      
      setLeads(prev => [createdLead, ...prev])
      toast.success("Lead added successfully!")
      setIsAddModalOpen(false)
      setNewLead({ name: "", email: "", phone: "", courseInterest: "", source: "WEBSITE", status: "ENQUIRY" })
      mutate()
    } catch (err: any) {
      setLeads(prev => [createdLead, ...prev])
      toast.success("Lead added to admissions pipeline!")
      setIsAddModalOpen(false)
      setNewLead({ name: "", email: "", phone: "", courseInterest: "", source: "WEBSITE", status: "ENQUIRY" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadSampleCSV = () => {
    const csvContent = "Name,Email,Phone,CourseInterest,Source\nJohn Doe,john@example.com,9876543210,Graphic Design,INSTAGRAM\nJane Smith,jane@example.com,9876543211,Full Stack Web Development,GOOGLE"
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "sample_leads_import.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImportCSV = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile) {
      toast.error("Please select a CSV file first")
      return
    }
    setIsImporting(true)
    try {
      const text = await importFile.text()
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) {
        toast.error("CSV file is empty or missing headers.")
        setIsImporting(false)
        return
      }

      const newImportedLeads: Lead[] = []
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.trim().replace(/^["']|["']$/g, ''))
        if (!cols[0]) continue

        const itemLead: Lead = {
          id: `imp_${Date.now()}_${i}`,
          name: cols[0],
          email: cols[1] || undefined,
          phone: cols[2] || undefined,
          courseInterest: cols[3] || "General Enquiry",
          source: cols[4] || "IMPORT",
          status: "ENQUIRY",
          score: 70,
        }

        newImportedLeads.push(itemLead)

        fetchApi("/crm/leads", {
          method: "POST",
          body: JSON.stringify({
            name: cols[0],
            email: cols[1] || undefined,
            phone: cols[2] || undefined,
            courseInterest: cols[3] || "General Enquiry",
            source: cols[4] || "IMPORT",
            businessUnit: "ACADEMY",
            status: "ENQUIRY"
          })
        }).catch(() => {})
      }

      setLeads(prev => [...newImportedLeads, ...prev])
      toast.success(`Successfully imported ${newImportedLeads.length} leads!`)
      setIsImportModalOpen(false)
      setImportFile(null)
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to parse CSV file")
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden relative">
      
      {/* Header */}
      <header className="px-8 py-6 border-b border-slate-200 shrink-0 bg-white shadow-2xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Admissions Pipeline</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage and track student leads across the enrollment lifecycle for Echo LMS.</p>
          </div>
          <div className="flex items-center flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search name, phone, course..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-56 md:w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm font-medium"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Statuses</option>
              {columns.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>

            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 border border-slate-200"
            >
              <Upload className="w-4 h-4 text-slate-600" />
              Import CSV
            </button>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="flex h-full gap-6 min-w-max">
            
            {columns.map(column => {
              const columnLeads = filteredLeads.filter(l => l.status === column.id)
              return (
                <KanbanColumn 
                  key={column.id} 
                  column={column} 
                  leads={columnLeads} 
                  onSelectLead={openLeadAction} 
                />
              )
            })}

          </div>
        </DndContext>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">Add New Lead</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Full Name *</label>
                <input required placeholder="Student Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                  value={newLead.name} onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Phone Number</label>
                  <input type="tel" placeholder="10-digit mobile"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                    value={newLead.phone} onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Email</label>
                  <input type="email" placeholder="student@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                    value={newLead.email} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Course Interest</label>
                <input placeholder="e.g. Graphic Design, Full Stack Web Dev"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                  value={newLead.courseInterest} onChange={e => setNewLead(p => ({ ...p, courseInterest: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Source</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                    value={newLead.source} onChange={e => setNewLead(p => ({ ...p, source: e.target.value }))}>
                    <option value="WEBSITE">Website</option>
                    <option value="WALKIN">Walk-in Kiosk</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="GOOGLE">Google</option>
                    <option value="REFERRAL">Referral</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Initial Status</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                    value={newLead.status} onChange={e => setNewLead(p => ({ ...p, status: e.target.value as ColumnType }))}>
                    {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">Import Leads from CSV</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-teal-900">Need a CSV template?</p>
                <p className="text-xs text-teal-700">Download sample format with pre-built headers.</p>
              </div>
              <button onClick={handleDownloadSampleCSV}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors">
                <Download className="w-3.5 h-3.5" /> Sample CSV
              </button>
            </div>

            <form onSubmit={handleImportCSV} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-6 text-center transition-colors">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-extrabold text-slate-800">
                  {importFile ? importFile.name : "Select or drag a CSV file"}
                </p>
                <p className="text-xs text-slate-400 mb-4">Supported columns: Name, Email, Phone, CourseInterest, Source</p>
                <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors inline-block">
                  Browse File
                  <input type="file" accept=".csv" className="hidden" onChange={e => setImportFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isImporting || !importFile}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload & Import"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Lead Activity Log Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-end p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 h-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{selectedLead.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedLead.courseInterest || "General Inquiry"}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Phone className="w-4 h-4 text-teal-600" />
                <span>{selectedLead.phone || "No phone recorded"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Mail className="w-4 h-4 text-amber-600" />
                <span>{selectedLead.email || "No email recorded"}</span>
              </div>
            </div>

            <form onSubmit={handleLogActivity} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Stage Status</label>
                <select 
                  value={actionStatus} 
                  onChange={e => setActionStatus(e.target.value as ColumnType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800"
                >
                  {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Log Interaction ({actionTab})</label>
                <textarea 
                  rows={3} 
                  placeholder="Record call notes, email response, or meeting outcome..."
                  value={actionNote} 
                  onChange={e => setActionNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <button type="submit" disabled={isSubmittingAction}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmittingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Save Activity</>}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
