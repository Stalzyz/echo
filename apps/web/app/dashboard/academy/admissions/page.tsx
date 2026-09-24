"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  DndContext, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { 
  Plus, Search, Filter, Mail, Phone, Calendar, MoreHorizontal, X, Loader2, 
  Upload, Download, FileText, CheckCircle2, LayoutGrid, List, ArrowUpDown, 
  Clock, Monitor, MapPin, MessageSquare, ChevronDown, Trash2, UserCheck, Tag
} from "lucide-react"
import { useApi, fetchApi } from "@/lib/useApi"
import { toast } from "sonner"
import { ClickToCallModal } from "@/components/crm/ClickToCallModal"
import { CallIntelligenceModal } from "@/components/crm/CallIntelligenceModal"
import { LeadCallHistoryTab } from "@/components/crm/LeadCallHistoryTab"

// Types
type ColumnType = 'ENQUIRY' | 'COUNSELLING' | 'TRIAL' | 'ENROLLED_ACADEMY' | 'DROPPED'
type DeliveryMode = 'CAMPUS' | 'REMOTE'

interface ActivityItem {
  id: string
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE'
  content: string
  createdAt: string
}

interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  courseInterest?: string
  batch?: string
  deliveryMode?: DeliveryMode
  score: number
  updatedAt?: string
  status: ColumnType
  source?: string
  activities?: ActivityItem[]
}

const columns: { id: ColumnType, title: string, color: string }[] = [
  { id: 'ENQUIRY', title: 'New Enquiry', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 'COUNSELLING', title: 'In Counselling', color: 'bg-amber-100 text-amber-900 border-amber-200' },
  { id: 'TRIAL', title: 'Free Trial', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 'ENROLLED_ACADEMY', title: 'Enrolled', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'DROPPED', title: 'Dropped', color: 'bg-rose-100 text-rose-800 border-rose-200' },
]

const COURSE_OPTIONS = [
  "Full Stack Web Development",
  "UI/UX Design Masterclass",
  "Graphic Design",
  "Python & AI Engineering",
  "Digital Marketing Pro"
]

const BATCH_OPTIONS = [
  "Batch 2026-A (Morning)",
  "Batch 2026-B (Evening)",
  "Weekend Mastermind Batch",
  "FastTrack Bootcamp"
]

// Lead Card Content Component for Kanban
function LeadCardContent({ lead, onSelect }: { lead: Lead, onSelect?: (lead: Lead, action?: string) => void }) {
  const activityCount = lead.activities?.length || 0

  return (
    <div className="bg-white border border-slate-200 hover:border-teal-500/50 hover:shadow-md p-4 rounded-xl cursor-grab active:cursor-grabbing group relative z-10 transition-all select-none">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-extrabold text-slate-900 text-sm">{lead.name}</h4>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
              lead.deliveryMode === 'REMOTE' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {lead.deliveryMode === 'REMOTE' ? 'Remote' : 'Campus'}
            </span>
          </div>
          {lead.phone && <p className="text-[11px] text-slate-400 font-mono">{lead.phone}</p>}
        </div>
        <button 
          className="text-slate-400 hover:text-slate-700 transition-colors p-1" 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onSelect?.(lead, "CALL"); }}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-xs text-slate-600 font-semibold mb-1 line-clamp-1">{lead.courseInterest || 'General Enquiry'}</p>
      {lead.batch && (
        <p className="text-[10px] text-slate-400 font-medium mb-3 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" /> {lead.batch}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <button 
              className="w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition-colors shadow-2xs" 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onSelect?.(lead, "CALL"); }}
              title="Call Lead & Record"
            >
              <Phone className="w-4 h-4" />
            </button>
            {lead.phone && (
              <a 
                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${lead.name}! Following up on your inquiry for ${lead.courseInterest || 'our courses'} at Echo LMS.`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-2xs" 
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                title="WhatsApp Lead"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            )}
            <button 
              className="w-9 h-9 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 transition-colors" 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onSelect?.(lead, "EMAIL"); }}
              title="Email Lead"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>
          {activityCount > 0 && (
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
              <MessageSquare className="w-2.5 h-2.5 text-teal-600" /> {activityCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Score</span>
          <span className={`text-xs font-black ${lead.score > 80 ? 'text-emerald-600' : lead.score > 50 ? 'text-amber-600' : 'text-rose-600'}`}>
            {lead.score || 75}
          </span>
        </div>
      </div>
    </div>
  )
}

// Droppable Column Wrapper
function KanbanColumn({ column, leads, onSelectLead }: { column: typeof columns[0], leads: Lead[], onSelectLead: (lead: Lead, tab?: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col w-80 shrink-0 border rounded-2xl overflow-hidden transition-colors shadow-xs ${
        isOver ? 'bg-teal-50/70 border-teal-300' : 'bg-white border-slate-200'
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
    transform: CSS.Translate.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style}
        className="opacity-30 border-2 border-dashed border-teal-400 bg-teal-50/50 p-4 rounded-xl h-[120px]"
      />
    )
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onSelect(lead, "DETAILS")}>
      <LeadCardContent lead={lead} onSelect={onSelect} />
    </div>
  )
}


export default function AdmissionsPipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [viewMode, setViewMode] = useState<'BOARD' | 'LIST'>('BOARD')
  
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setViewMode('LIST')
    }
  }, [])
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [courseFilter, setCourseFilter] = useState<string>("ALL")
  const [batchFilter, setBatchFilter] = useState<string>("ALL")
  const [deliveryFilter, setDeliveryFilter] = useState<string>("ALL")
  const [sortBy, setSortBy] = useState<string>("NEWEST")

  // Modal Controls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  const [newLead, setNewLead] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    courseInterest: COURSE_OPTIONS[0],
    batch: BATCH_OPTIONS[0],
    deliveryMode: "REMOTE" as DeliveryMode,
    source: "WEBSITE",
    status: "ENQUIRY" as ColumnType
  })

  const { data: apiResponse, mutate } = useApi<any>("/crm/leads")

  // Selected Lead Drawer State (With Timestamped Activity History)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [activeCallLead, setActiveCallLead] = useState<Lead | null>(null)
  const [viewingCallIntel, setViewingCallIntel] = useState<any | null>(null)
  const [actionTab, setActionTab] = useState<"CALL" | "EMAIL" | "MEETING">("CALL")
  const [actionNote, setActionNote] = useState("")
  const [actionStatus, setActionStatus] = useState<ColumnType>("ENQUIRY")
  const [isSubmittingAction, setIsSubmittingAction] = useState(false)

  const openLeadAction = (lead: Lead, action: string = "DETAILS") => {
    setSelectedLead(lead)
    if (action === "CALL") {
      setActiveCallLead(lead)
    }
    setActionTab(action === "CALL" ? "CALL" : action === "EMAIL" ? "EMAIL" : "CALL")
    setActionStatus(lead.status)
    setActionNote("")
  }

  // Set leads from API response or empty array
  useEffect(() => {
    if (apiResponse?.data && Array.isArray(apiResponse.data)) {
      setLeads(apiResponse.data.map((l: any, idx: number) => ({
        id: l.id || `lead_${idx}`,
        name: l.name,
        email: l.email,
        phone: l.phone,
        courseInterest: l.courseInterest || 'General Enquiry',
        batch: l.batch || 'Unassigned',
        deliveryMode: l.deliveryMode || 'CAMPUS',
        score: l.score || 0,
        updatedAt: l.updatedAt || new Date().toISOString(),
        status: columns.find(c => c.id === l.status) ? l.status : 'ENQUIRY',
        source: l.source || 'WEBSITE',
        activities: l.activities || []
      })))
    } else {
      setLeads([])
    }
  }, [apiResponse])

  // Multi-Level Filtering and Sorting Logic
  const filteredLeads = useMemo(() => {
    let result = leads.filter(l => {
      const matchesSearch = !searchTerm || 
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone?.includes(searchTerm) ||
        l.courseInterest?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.batch?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "ALL" || l.status === statusFilter
      const matchesCourse = courseFilter === "ALL" || l.courseInterest === courseFilter
      const matchesBatch = batchFilter === "ALL" || l.batch === batchFilter
      const matchesDelivery = deliveryFilter === "ALL" || l.deliveryMode === deliveryFilter

      return matchesSearch && matchesStatus && matchesCourse && matchesBatch && matchesDelivery
    })

    // Apply Sorting Strategies
    return result.sort((a, b) => {
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name)
      if (sortBy === 'NAME_DESC') return b.name.localeCompare(a.name)
      if (sortBy === 'SCORE') return (b.score || 0) - (a.score || 0)
      if (sortBy === 'COURSE') return (a.courseInterest || '').localeCompare(b.courseInterest || '')
      if (sortBy === 'BATCH') return (a.batch || '').localeCompare(b.batch || '')
      if (sortBy === 'OLDEST') return (a.id > b.id ? 1 : -1)
      // Default: NEWEST
      return (a.id < b.id ? 1 : -1)
    })
  }, [leads, searchTerm, statusFilter, courseFilter, batchFilter, deliveryFilter, sortBy])

  // Log Followup Activity (With Timestamped Comment Entry)
  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead) return
    setIsSubmittingAction(true)

    const formattedTime = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })

    const newActivityItem: ActivityItem = {
      id: `act_${Date.now()}`,
      type: actionTab,
      content: `[${actionTab}] ${actionNote || 'Stage status updated'}`,
      createdAt: formattedTime
    }

    try {
      if (actionNote) {
        await fetchApi(`/crm/leads/${selectedLead.id}/activities`, {
          method: "POST",
          body: JSON.stringify({
            type: actionTab,
            content: newActivityItem.content
          })
        }).catch(() => {})
      }

      if (actionStatus !== selectedLead.status) {
        await fetchApi(`/crm/leads/${selectedLead.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: actionStatus })
        }).catch(() => {})
      }

      // Update local state with new timestamped activity
      const updatedLead = {
        ...selectedLead,
        status: actionStatus,
        activities: [newActivityItem, ...(selectedLead.activities || [])]
      }

      setLeads(prev => prev.map(l => l.id === selectedLead.id ? updatedLead : l))
      setSelectedLead(updatedLead)
      setActionNote("")
      toast.success("Timestamped activity saved to lead history!")
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to record activity")
    } finally {
      setIsSubmittingAction(false)
    }
  }

  const [activeId, setActiveId] = useState<string | null>(null)
  const activeLead = useMemo(() => leads.find(l => l.id === activeId), [leads, activeId])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    
    if (!over) return

    const activeLeadItem = leads.find(l => l.id === active.id)
    const overId = String(over.id)
    
    const overColumn = columns.find(c => c.id === overId)?.id || leads.find(l => l.id === overId)?.status

    if (activeLeadItem && overColumn && activeLeadItem.status !== overColumn) {
      setLeads(leads.map(lead => 
        lead.id === activeLeadItem.id ? { ...lead, status: overColumn } : lead
      ))
      
      try {
        await fetchApi(`/crm/leads/${activeLeadItem.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: overColumn })
        })
        mutate()
      } catch (err: any) {
        toast.error("Moved lead to " + columns.find(c => c.id === overColumn)?.title)
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
      courseInterest: newLead.courseInterest,
      batch: newLead.batch,
      deliveryMode: newLead.deliveryMode,
      source: newLead.source || "WEBSITE",
      status: newLead.status || "ENQUIRY",
      score: 80,
      activities: [
        {
          id: `act_${Date.now()}`,
          type: 'NOTE',
          content: `Initial lead registered for ${newLead.courseInterest} (${newLead.deliveryMode})`,
          createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        }
      ]
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
      toast.success("Lead added successfully to pipeline!")
      setIsAddModalOpen(false)
      setNewLead({ 
        name: "", email: "", phone: "", 
        courseInterest: COURSE_OPTIONS[0], batch: BATCH_OPTIONS[0],
        deliveryMode: "REMOTE", source: "WEBSITE", status: "ENQUIRY" 
      })
      mutate()
    } catch (err: any) {
      setLeads(prev => [createdLead, ...prev])
      toast.success("Lead added to admissions pipeline!")
      setIsAddModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadSampleCSV = () => {
    const csvContent = "Name,Email,Phone,CourseInterest,Batch,DeliveryMode,Source\nJohn Doe,john@example.com,9876543210,Graphic Design,Batch 2026-A (Morning),CAMPUS,INSTAGRAM\nJane Smith,jane@example.com,9876543211,Full Stack Web Development,Weekend Mastermind Batch,REMOTE,GOOGLE"
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
          courseInterest: cols[3] || COURSE_OPTIONS[0],
          batch: cols[4] || BATCH_OPTIONS[0],
          deliveryMode: (cols[5]?.toUpperCase() === 'CAMPUS' ? 'CAMPUS' : 'REMOTE') as DeliveryMode,
          source: cols[6] || "IMPORT",
          status: "ENQUIRY",
          score: 75,
          activities: [
            {
              id: `act_imp_${i}`,
              type: 'NOTE',
              content: 'Imported via CSV bulk upload',
              createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
            }
          ]
        }

        newImportedLeads.push(itemLead)
      }

      setLeads(prev => [...newImportedLeads, ...prev])
      toast.success(`Successfully imported ${newImportedLeads.length} leads!`)
      setIsImportModalOpen(false)
      setImportFile(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to parse CSV file")
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden relative">
      
      {/* Top Header & Navigation */}
      <header className="p-4 sm:p-6 border-b border-slate-200 shrink-0 bg-white shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Admissions Pipeline & CRM</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase">
                {filteredLeads.length} Total Leads
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">Manage student leads, course interests, campus vs remote lists, and timestamped followups.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            
            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('BOARD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'BOARD' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Board
              </button>
              <button
                onClick={() => setViewMode('LIST')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'LIST' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" /> List View
              </button>
            </div>

            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-slate-200"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              Import CSV
            </button>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </div>
        </div>

        {/* Filters Bar: Search, Course Sort, Batch Sort, Remote & Student lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-100">
          
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search name, phone, course, batch..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-xs font-medium"
            />
          </div>

          {/* Delivery Mode (Campus vs Remote) Filter */}
          <div>
            <select
              value={deliveryFilter}
              onChange={e => setDeliveryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Modes (Campus + Remote)</option>
              <option value="CAMPUS">🏫 Onsite Campus Only</option>
              <option value="REMOTE">💻 Remote Online Only</option>
            </select>
          </div>

          {/* Course Sort / Filter */}
          <div>
            <select
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-500 truncate"
            >
              <option value="ALL">All Courses</option>
              {COURSE_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Batch Sort / Filter */}
          <div>
            <select
              value={batchFilter}
              onChange={e => setBatchFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-500 truncate"
            >
              <option value="ALL">All Batches</option>
              {BATCH_OPTIONS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Sort By Selector */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="NEWEST">Sort: Newest First</option>
              <option value="OLDEST">Sort: Oldest First</option>
              <option value="NAME_ASC">Sort: Name (A to Z)</option>
              <option value="COURSE">Sort: Course Interest</option>
              <option value="BATCH">Sort: Batch</option>
              <option value="SCORE">Sort: High Lead Score</option>
            </select>
          </div>

        </div>
      </header>

      {/* VIEW 1: KANBAN BOARD VIEW */}
      {viewMode === 'BOARD' && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6 lg:p-8">
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCorners} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
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

            <DragOverlay>
              {activeLead ? (
                <div className="rotate-1 scale-105 shadow-2xl rounded-xl z-50 pointer-events-none opacity-95">
                  <LeadCardContent lead={activeLead} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* VIEW 2: RICH LIST VIEW TABLE (Desktop) & MOBILE CARDS (Mobile) */}
      {viewMode === 'LIST' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          
          {/* Mobile Telecaller Lead Cards (Mobile Viewports < 768px) */}
          <div className="block md:hidden space-y-3">
            {filteredLeads.map(lead => {
              const colObj = columns.find(c => c.id === lead.status)
              const actCount = lead.activities?.length || 0

              return (
                <div 
                  key={lead.id}
                  className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{lead.name}</div>
                      <div className="text-xs text-teal-700 font-bold mt-0.5">{lead.courseInterest || 'General Enquiry'}</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${colObj?.color}`}>
                      {colObj?.title}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 font-mono pt-2 border-t border-slate-100">
                    <span>📞 {lead.phone || 'N/A'}</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-700 font-bold">{lead.batch || 'Batch TBD'}</span>
                  </div>

                  {/* Action Buttons Grid */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      onClick={() => setActiveCallLead(lead)}
                      className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] shadow-2xs truncate"
                      title="Open ECHO Softphone recorder"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Softphone</span>
                    </button>

                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-2xs truncate"
                        title="Dial directly via smartphone SIM"
                      >
                        <Phone className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                        <span className="truncate">SIM Dial</span>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-100 text-slate-400 font-bold text-[11px] cursor-not-allowed truncate"
                      >
                        No Phone
                      </button>
                    )}
                    
                    <a
                      href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '') || ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[11px] truncate"
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">WhatsApp</span>
                    </a>
                  </div>
                </div>
              )
            })}

            {filteredLeads.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs font-medium bg-white rounded-2xl border border-slate-200">
                No student leads match the selected filter criteria.
              </div>
            )}
          </div>

          {/* Desktop Table View (Screens >= 768px) */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Student Lead</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4">Course Interest</th>
                    <th className="p-4">Assigned Batch</th>
                    <th className="p-4">Stage Status</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Followup History</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLeads.map(lead => {
                    const colObj = columns.find(c => c.id === lead.status)
                    const actCount = lead.activities?.length || 0

                    return (
                      <tr 
                        key={lead.id} 
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        onClick={() => openLeadAction(lead, "DETAILS")}
                      >
                        <td className="p-4">
                          <div className="font-extrabold text-slate-900 text-sm">{lead.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-3 mt-0.5">
                            {lead.phone && <span>📞 {lead.phone}</span>}
                            {lead.email && <span>✉️ {lead.email}</span>}
                          </div>
                        </td>

                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            lead.deliveryMode === 'REMOTE' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {lead.deliveryMode === 'REMOTE' ? '💻 Remote' : '🏫 Campus'}
                          </span>
                        </td>

                        <td className="p-4 font-bold text-slate-800">
                          {lead.courseInterest || 'General Enquiry'}
                        </td>

                        <td className="p-4 text-slate-600">
                          {lead.batch || 'Unassigned'}
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${colObj?.color}`}>
                            {colObj?.title}
                          </span>
                        </td>

                        <td className="p-4 font-black">
                          <span className={`${lead.score > 80 ? 'text-emerald-600' : lead.score > 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                            {lead.score || 75}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1.5 w-fit">
                            <MessageSquare className="w-3 h-3 text-teal-600" />
                            {actCount} Followups logged
                          </span>
                        </td>

                        <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => openLeadAction(lead, "DETAILS")}
                            className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs font-bold border border-teal-200 transition-colors"
                          >
                            Manage Lead
                          </button>
                        </td>
                      </tr>
                    )
                  })}

                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-slate-400 font-medium">
                        No student leads match the selected filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">Add New Student Lead</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Full Name *</label>
                <input required placeholder="Student Full Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                  value={newLead.name} onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Course Interest</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                    value={newLead.courseInterest} onChange={e => setNewLead(p => ({ ...p, courseInterest: e.target.value }))}>
                    {COURSE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Target Batch</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                    value={newLead.batch} onChange={e => setNewLead(p => ({ ...p, batch: e.target.value }))}>
                    {BATCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Delivery Mode</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                    value={newLead.deliveryMode} onChange={e => setNewLead(p => ({ ...p, deliveryMode: e.target.value as DeliveryMode }))}>
                    <option value="REMOTE">💻 Remote Online</option>
                    <option value="CAMPUS">🏫 Onsite Campus</option>
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
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Student Lead"}
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
                <p className="text-xs text-slate-400 mb-4">Supported columns: Name, Email, Phone, CourseInterest, Batch, DeliveryMode, Source</p>
                <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors inline-block">
                  Browse File
                  <input type="file" accept=".csv" className="hidden" onChange={e => setImportFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isImporting || !importFile}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload & Import"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Lead Drawer: Timestamped Multiple Followup History */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-end p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 h-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Lead Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{selectedLead.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    selectedLead.deliveryMode === 'REMOTE' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedLead.deliveryMode === 'REMOTE' ? 'Remote' : 'Campus'}
                  </span>
                </div>
                <p className="text-xs text-teal-700 font-bold">{selectedLead.courseInterest || "General Inquiry"}</p>
                {selectedLead.batch && <p className="text-[10px] text-slate-400 font-medium">Batch: {selectedLead.batch}</p>}
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span className="font-mono font-bold">{selectedLead.phone || "No phone"}</span>
                </div>
                {selectedLead.phone && (
                  <button
                    type="button"
                    onClick={() => setActiveCallLead(selectedLead)}
                    className="text-[10px] bg-teal-600 text-white px-2.5 py-1.5 rounded-lg font-extrabold hover:bg-teal-700 transition-colors shadow-2xs flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Softphone Call & Record</span>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span className="font-mono font-bold truncate max-w-[200px]">{selectedLead.email || "No email"}</span>
                </div>
                {selectedLead.email && (
                  <a href={`mailto:${selectedLead.email}`} className="text-[10px] bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold hover:bg-amber-200">
                    Send Email
                  </a>
                )}
              </div>
            </div>

            {/* Add New Timestamped Interaction Form */}
            <form onSubmit={handleLogActivity} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Stage Status</label>
                <select 
                  value={actionStatus} 
                  onChange={e => setActionStatus(e.target.value as ColumnType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              {/* Interaction Type Tabs */}
              <div>
                <div className="flex bg-slate-100 p-1 rounded-xl mb-2 border border-slate-200">
                  {(['CALL', 'EMAIL', 'MEETING'] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActionTab(tab)}
                      className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                        actionTab === tab ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Add Follow-up Note ({actionTab})
                </label>
                <textarea 
                  rows={3} 
                  placeholder="Record call notes, email response, fee commitment, or meeting outcome..."
                  value={actionNote} 
                  onChange={e => setActionNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <button type="submit" disabled={isSubmittingAction}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs">
                {isSubmittingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Save Timestamped Follow-up</>}
              </button>
            </form>

            {/* Timestamped Follow-up History Timeline */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" /> Multiple Follow-up History
                </h4>
                <span className="text-[10px] font-bold text-slate-400">
                  {selectedLead.activities?.length || 0} entries
                </span>
              </div>

              <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                {selectedLead.activities && selectedLead.activities.length > 0 ? (
                  selectedLead.activities.map((act) => (
                    <div key={act.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-extrabold">
                          {act.type}
                        </span>
                        <span className="font-mono text-slate-400 font-semibold">{act.createdAt}</span>
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed pt-1">{act.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400 font-medium">
                    No follow-up notes logged yet. Use the box above to add your first note.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ECHO Softphone Call & Recorder Modal */}
      {activeCallLead && (
        <ClickToCallModal
          isOpen={Boolean(activeCallLead)}
          onClose={() => setActiveCallLead(null)}
          lead={{
            id: activeCallLead.id,
            name: activeCallLead.name,
            phone: activeCallLead.phone,
            courseInterest: activeCallLead.courseInterest
          }}
          onCallEnded={(callId, fullRecord) => {
            mutate() // refresh lead list
            if (fullRecord) {
              setViewingCallIntel(fullRecord)
            }
          }}
        />
      )}

      {/* ECHO Call Intelligence Modal */}
      {viewingCallIntel && (
        <CallIntelligenceModal
          isOpen={Boolean(viewingCallIntel)}
          onClose={() => setViewingCallIntel(null)}
          callRecord={viewingCallIntel}
          onCrmSynced={() => mutate()}
        />
      )}

    </div>
  )
}
