"use client"

import { useState } from "react"
import { Search, Plus, Users, Calendar, GraduationCap, ChevronRight } from "lucide-react"
import { useApi, fetchApi } from "@/lib/useApi"
import { format } from "date-fns"
import { SlideOver } from "@/components/SlideOver"
import { toast } from "sonner"

export default function BatchesPage() {
  const { data, isLoading, mutate } = useApi<any>("/academy/batches")
  const { data: coursesData } = useApi<any>("/lms/courses")
  const { data: educatorsData } = useApi<any>("/academy/educators")
  const batches = data?.data || data?.batches || []
  const courses = coursesData?.courses || []
  const educators = Array.isArray(educatorsData) ? educatorsData : []

  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newBatch, setNewBatch] = useState({
    name: "",
    courseId: "",
    type: "ONLINE",
    capacity: 20,
    startDate: "",
    endDate: "",
    educatorId: ""
  })
  const [editBatch, setEditBatch] = useState<any>({
    id: "",
    name: "",
    courseId: "",
    type: "ONLINE",
    capacity: 20,
    startDate: "",
    endDate: "",
    educatorId: "",
    isActive: true
  })

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/academy/batches", {
        method: "POST",
        body: JSON.stringify({
          ...newBatch,
          startDate: new Date(newBatch.startDate).toISOString(),
          endDate: new Date(newBatch.endDate).toISOString(),
          capacity: Number(newBatch.capacity),
          educatorId: newBatch.educatorId || undefined
        })
      })
      toast.success("Batch created successfully")
      setIsCreateOpen(false)
      setNewBatch({ name: "", courseId: "", type: "ONLINE", capacity: 20, startDate: "", endDate: "", educatorId: "" })
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to create batch")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi(`/academy/batches/${editBatch.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editBatch.name,
          courseId: editBatch.courseId,
          type: editBatch.type,
          capacity: Number(editBatch.capacity),
          startDate: new Date(editBatch.startDate).toISOString(),
          endDate: new Date(editBatch.endDate).toISOString(),
          educatorId: editBatch.educatorId || null,
          isActive: editBatch.isActive
        })
      })
      toast.success("Batch updated successfully")
      setIsEditOpen(false)
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to update batch")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredBatches = batches.filter((b: any) => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.course?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-200">Upcoming</span>
      case 'ACTIVE':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">Active</span>
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 border border-slate-200">Completed</span>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex-none px-8 py-6 border-b border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Batches & Cohorts</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Manage course cohorts and schedule sessions for Gecho LMS</p>
          </div>
          <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-bold text-sm rounded-xl hover:bg-teal-700 transition-colors shadow-xs">
            <Plus className="w-4 h-4" /> Create Batch
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search batches or courses..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto custom-scrollbar p-8">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Loading batches...</div>
        ) : filteredBatches.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-white">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No batches found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatches.map((batch: any) => (
              <div key={batch.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-slate-300 transition-all group shadow-xs relative flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900 leading-tight">{batch.name}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{batch.course?.name}</p>
                        <p className="text-[11px] text-teal-700 mt-1 font-bold">
                          Instructor: {batch.educator?.user ? `${batch.educator.user.firstName} ${batch.educator.user.lastName}` : "Not Assigned"}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(batch.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-1">Duration</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{format(new Date(batch.startDate), 'MMM d, yyyy')} - {format(new Date(batch.endDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-1">Capacity</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{batch.capacity} Max</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="text-xs text-slate-500 font-bold">
                    Type: <span className="text-slate-800">{batch.type}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setEditBatch({
                        id: batch.id,
                        name: batch.name,
                        courseId: batch.courseId,
                        type: batch.type,
                        capacity: batch.capacity,
                        startDate: new Date(batch.startDate).toISOString().slice(0, 16),
                        endDate: new Date(batch.endDate).toISOString().slice(0, 16),
                        educatorId: batch.educatorId || "",
                        isActive: batch.isActive ?? true
                      })
                      setIsEditOpen(true)
                    }}
                    className="text-teal-700 hover:text-teal-800 text-xs font-bold transition-colors flex items-center gap-1">
                    Manage <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SlideOver title="Create New Batch" open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <form onSubmit={handleCreateBatch} className="p-6 flex flex-col gap-4 text-slate-900">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Batch Name</label>
            <input 
              required
              value={newBatch.name}
              onChange={e => setNewBatch({...newBatch, name: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
              placeholder="e.g. Cohort 5 - Summer 2026"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Course</label>
            <select 
              required
              value={newBatch.courseId}
              onChange={e => setNewBatch({...newBatch, courseId: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="">Select a course...</option>
              {courses.map((c: any) => (
                <option key={c.courseId || c.id} value={c.courseId || c.id}>{c.course?.name || c.name || "Unknown Course"}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Batch Type</label>
              <select 
                value={newBatch.type}
                onChange={e => setNewBatch({...newBatch, type: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="ONLINE">Online</option>
                <option value="MORNING">Morning (Onsite)</option>
                <option value="EVENING">Evening (Onsite)</option>
                <option value="WEEKEND">Weekend</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Capacity</label>
              <input 
                type="number"
                required
                min={1}
                value={newBatch.capacity}
                onChange={e => setNewBatch({...newBatch, capacity: parseInt(e.target.value) || 0})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Start Date</label>
              <input 
                type="datetime-local"
                required
                value={newBatch.startDate}
                onChange={e => setNewBatch({...newBatch, startDate: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">End Date</label>
              <input 
                type="datetime-local"
                required
                value={newBatch.endDate}
                onChange={e => setNewBatch({...newBatch, endDate: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Instructor / Educator</label>
            <select 
              value={newBatch.educatorId}
              onChange={e => setNewBatch({...newBatch, educatorId: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="">Select Instructor...</option>
              {educators.map((edu: any) => (
                <option key={edu.id} value={edu.id}>{edu.user?.firstName} {edu.user?.lastName} ({edu.deliveryMode || "ANY"})</option>
              ))}
            </select>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 flex gap-3">
            <button type="button" onClick={() => setIsCreateOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors text-slate-700">Cancel</button>
            <button disabled={isSubmitting} type="submit" className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors shadow-xs disabled:opacity-50">
              {isSubmitting ? "Creating..." : "Create Batch"}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Edit Batch SlideOver */}
      <SlideOver title="Manage Batch" open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <form onSubmit={handleUpdateBatch} className="p-6 flex flex-col gap-4 text-slate-900">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Batch Name</label>
            <input 
              required
              value={editBatch.name}
              onChange={e => setEditBatch({...editBatch, name: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Course</label>
            <select 
              required
              value={editBatch.courseId}
              onChange={e => setEditBatch({...editBatch, courseId: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="">Select a course...</option>
              {courses.map((c: any) => (
                <option key={c.courseId || c.id} value={c.courseId || c.id}>{c.course?.name || c.name || "Unknown Course"}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Batch Type</label>
              <select 
                value={editBatch.type}
                onChange={e => setEditBatch({...editBatch, type: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="ONLINE">Online</option>
                <option value="MORNING">Morning (Onsite)</option>
                <option value="EVENING">Evening (Onsite)</option>
                <option value="WEEKEND">Weekend</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Capacity</label>
              <input 
                type="number"
                required
                min={1}
                value={editBatch.capacity}
                onChange={e => setEditBatch({...editBatch, capacity: parseInt(e.target.value) || 0})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Start Date</label>
              <input 
                type="datetime-local"
                required
                value={editBatch.startDate}
                onChange={e => setEditBatch({...editBatch, startDate: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">End Date</label>
              <input 
                type="datetime-local"
                required
                value={editBatch.endDate}
                onChange={e => setEditBatch({...editBatch, endDate: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Instructor / Educator</label>
            <select 
              value={editBatch.educatorId}
              onChange={e => setEditBatch({...editBatch, educatorId: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="">Select Instructor...</option>
              {educators.map((edu: any) => (
                <option key={edu.id} value={edu.id}>{edu.user?.firstName} {edu.user?.lastName} ({edu.deliveryMode || "ANY"})</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 py-2">
            <input 
              type="checkbox"
              id="isActive"
              checked={editBatch.isActive}
              onChange={e => setEditBatch({...editBatch, isActive: e.target.checked})}
              className="w-4 h-4 accent-teal-600 rounded bg-slate-100 border border-slate-300"
            />
            <label htmlFor="isActive" className="text-xs font-bold text-slate-700">Batch Active / Enrollments Enabled</label>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 flex gap-3">
            <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors text-slate-700">Cancel</button>
            <button disabled={isSubmitting} type="submit" className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors shadow-xs disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  )
}
