"use client"

import { useState, useEffect } from "react"
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
import { Plus, Search, Filter, Mail, Phone, Calendar, MoreHorizontal, X, Loader2 } from "lucide-react"
import { useApi, fetchApi } from "@/lib/useApi"
import { toast } from "sonner"

// Types
type ColumnType = 'ENQUIRY' | 'COUNSELLING' | 'TRIAL' | 'ENROLLED_ACADEMY' | 'DROPPED'

interface Lead {
  id: string
  name: string
  courseInterest?: string
  score: number
  updatedAt: string
  status: ColumnType
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
        <h4 className="font-extrabold text-slate-900 text-sm">{lead.name}</h4>
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
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", courseInterest: "", source: "WEBSITE" })
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
    setIsSubmitting(true)
    try {
      await fetchApi("/crm/leads", {
        method: "POST",
        body: JSON.stringify({
          ...newLead,
          businessUnit: "ACADEMY",
          status: "ENQUIRY"
        })
      })
      toast.success("Lead added successfully!")
      setIsSlideOverOpen(false)
      setNewLead({ name: "", email: "", phone: "", courseInterest: "", source: "WEBSITE" })
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to add lead")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden relative">
      
      {/* Header */}
      <header className="px-8 py-6 border-b border-slate-200 shrink-0 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Admissions Pipeline</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage and track student leads across the enrollment lifecycle for Gecho LMS.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm font-medium"
              />
            </div>
            <button className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
            <button 
              onClick={() => setIsSlideOverOpen(true)}
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
              const columnLeads = leads.filter(l => l.status === column.id)
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
    </div>
  )
}

