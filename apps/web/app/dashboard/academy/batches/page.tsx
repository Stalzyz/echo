"use client"

import { useState } from  "react"
import { Search, Plus, Users, Calendar, GraduationCap, ChevronRight, Video, CheckCircle2, Clock, Link as LinkIcon, PlayCircle, Loader2, X, Trash2, Edit3, ShieldAlert } from  "lucide-react"
import { useApi, fetchApi } from  "@/lib/useApi"
import { format } from  "date-fns"
import { SlideOver } from  "@/components/SlideOver"
import { toast } from  "sonner"

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
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [isSessionsOpen, setIsSessionsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAutoScheduling, setIsAutoScheduling] = useState(false)

  const { data: selectedBatchData, mutate: mutateSelectedBatch } = useApi<any>(
    selectedBatchId ? `/academy/batches/${selectedBatchId}` : null
  )

  const [editingSession, setEditingSession] = useState<any | null>(null)
  const [sessionForm, setSessionForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    meetLink: "",
    recordingUrl: ""
  })

  const [newBatch, setNewBatch] = useState({
    name: "",
    courseId: "",
    inlineCourseName: "",
    inlineCourseCode: "",
    inlineCourseFee: 9999,
    inlineCourseDuration: "3 Months",
    type: "ONLINE",
    capacity: 20,
    startDate: "",
    endDate: "",
    educatorId: "",
    recordingAccessDays: 7
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
    recordingAccessDays: 7,
    isActive: true
  })

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (newBatch.courseId === "CREATE_NEW_COURSE") {
        if (!newBatch.inlineCourseName || !newBatch.inlineCourseCode) {
          toast.error("Please enter course name and course code for the new course")
          setIsSubmitting(false)
          return
        }
        await fetchApi("/academy/batches/with-course", {
          method: "POST",
          body: JSON.stringify({
            courseName: newBatch.inlineCourseName,
            courseCode: newBatch.inlineCourseCode,
            courseFee: Number(newBatch.inlineCourseFee),
            courseDuration: newBatch.inlineCourseDuration,
            batchName: newBatch.name,
            batchType: newBatch.type,
            startDate: newBatch.startDate ? new Date(newBatch.startDate).toISOString() : undefined,
            endDate: newBatch.endDate ? new Date(newBatch.endDate).toISOString() : undefined,
            capacity: Number(newBatch.capacity),
            educatorId: newBatch.educatorId || undefined
          })
        })
      } else {
        await fetchApi("/academy/batches", {
          method: "POST",
          body: JSON.stringify({
            ...newBatch,
            startDate: new Date(newBatch.startDate).toISOString(),
            endDate: new Date(newBatch.endDate).toISOString(),
            capacity: Number(newBatch.capacity),
            recordingAccessDays: Number(newBatch.recordingAccessDays || 7),
            educatorId: newBatch.educatorId || undefined
          })
        })
      }
      toast.success("Batch created successfully!")
      setIsCreateOpen(false)
      setNewBatch({
        name: "",
        courseId: "",
        inlineCourseName: "",
        inlineCourseCode: "",
        inlineCourseFee: 9999,
        inlineCourseDuration: "3 Months",
        type: "ONLINE",
        capacity: 20,
        startDate: "",
        endDate: "",
        educatorId: "",
        recordingAccessDays: 7
      })
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
          ...editBatch,
          startDate: new Date(editBatch.startDate).toISOString(),
          endDate: new Date(editBatch.endDate).toISOString(),
          capacity: Number(editBatch.capacity),
          recordingAccessDays: Number(editBatch.recordingAccessDays || 7),
          educatorId: editBatch.educatorId || undefined
        })
      })
      toast.success("Batch updated successfully!")
      setIsEditOpen(false)
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to update batch")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAutoSchedule = async () => {
    if (!selectedBatchId) return
    setIsAutoScheduling(true)
    try {
      const res = await fetchApi<any>(`/academy/batches/${selectedBatchId}/auto-schedule`, {
        method: "POST",
        body: JSON.stringify({ daysCount: 45, defaultMeetLink: "https://meet.google.com/new" })
      })
      toast.success(res.message || "45 Daily sessions auto-generated!")
      mutateSelectedBatch()
    } catch (err: any) {
      toast.error(err.message || "Failed to auto-schedule sessions")
    } finally {
      setIsAutoScheduling(false)
    }
  }

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSession || !selectedBatchId) return
    setIsSubmitting(true)
    try {
      await fetchApi(`/academy/batches/sessions/${editingSession.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: sessionForm.title,
          description: sessionForm.description,
          startTime: sessionForm.startTime ? new Date(sessionForm.startTime).toISOString() : undefined,
          endTime: sessionForm.endTime ? new Date(sessionForm.endTime).toISOString() : undefined,
          meetLink: sessionForm.meetLink,
          recordingUrl: sessionForm.recordingUrl
        })
      })
      toast.success("Session updated!")
      setEditingSession(null)
      mutateSelectedBatch()
    } catch (err: any) {
      toast.error(err.message || "Failed to save session")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openManageSessions = (batchId: string) => {
    setSelectedBatchId(batchId)
    setIsSessionsOpen(true)
  }

  const openEditSessionModal = (session: any) => {
    setEditingSession(session)
    setSessionForm({
      title: session.title || "",
      description: session.description || "",
      startTime: session.startTime ? new Date(session.startTime).toISOString().slice(0, 16) : "",
      endTime: session.endTime ? new Date(session.endTime).toISOString().slice(0, 16) : "",
      meetLink: session.meetLink || "",
      recordingUrl: session.recordingUrl || ""
    })
  }

  const filteredBatches = batches.filter((b: any) => 
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <p className="text-sm text-slate-500 mt-1 font-medium">Manage 45-day course cohorts, topic schedules, and time-restricted session recordings.</p>
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
                  <button 
                    onClick={() => openManageSessions(batch.id)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" /> Sessions & Recordings ({batch._count?.sessions || 0})
                  </button>
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
                        recordingAccessDays: batch.recordingAccessDays || 7,
                        isActive: batch.isActive ?? true
                      })
                      setIsEditOpen(true)
                    }}
                    className="text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    Manage <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Batch SlideOver */}
      <SlideOver title="Create New Batch" open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <form onSubmit={handleCreateBatch} className="p-6 flex flex-col gap-4 text-slate-900">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Batch Name</label>
            <input 
              required
              value={newBatch.name}
              onChange={e => setNewBatch({...newBatch, name: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
              placeholder="e.g. Cohort 5 - 45 Day Online"
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
              <option value="CREATE_NEW_COURSE">➕ Create New Course (Inline)</option>
              {courses.map((c: any) => (
                <option key={c.courseId || c.id} value={c.courseId || c.id}>{c.course?.name || c.name || "Unknown Course"}</option>
              ))}
            </select>
          </div>

          {newBatch.courseId === "CREATE_NEW_COURSE" && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> New Course Setup
              </span>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 block">Course Name *</label>
                <input 
                  type="text"
                  required={newBatch.courseId === "CREATE_NEW_COURSE"}
                  value={newBatch.inlineCourseName}
                  onChange={e => setNewBatch({...newBatch, inlineCourseName: e.target.value})}
                  className="w-full bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                  placeholder="e.g. Full Stack Web Development"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 block">Course Code *</label>
                  <input 
                    type="text"
                    required={newBatch.courseId === "CREATE_NEW_COURSE"}
                    value={newBatch.inlineCourseCode}
                    onChange={e => setNewBatch({...newBatch, inlineCourseCode: e.target.value.toUpperCase()})}
                    className="w-full bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold uppercase placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    placeholder="e.g. FSD-101"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 block">Course Fee (₹)</label>
                  <input 
                    type="number"
                    value={newBatch.inlineCourseFee}
                    onChange={e => setNewBatch({...newBatch, inlineCourseFee: parseFloat(e.target.value) || 0})}
                    className="w-full bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-teal-500"
                    placeholder="9999"
                  />
                </div>
              </div>
            </div>
          )}
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
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">End Date (45 Days)</label>
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
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Recording Access Validity (Days)</label>
            <input 
              type="number"
              required
              min={1}
              value={newBatch.recordingAccessDays}
              onChange={e => setNewBatch({...newBatch, recordingAccessDays: parseInt(e.target.value) || 7})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
              placeholder="e.g. 7 days access post live class"
            />
            <p className="text-[10px] text-slate-400 mt-1">Students can view session recordings for this number of days after each class.</p>
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
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">Recording Access Validity (Days)</label>
            <input 
              type="number"
              required
              min={1}
              value={editBatch.recordingAccessDays}
              onChange={e => setEditBatch({...editBatch, recordingAccessDays: parseInt(e.target.value) || 7})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
            />
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

      {/* 45-Day Sessions & Recording Management Drawer */}
      {isSessionsOpen && selectedBatchData && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsSessionsOpen(false)} />
          <div className="w-full md:w-[680px] bg-white h-full border-l border-slate-200 relative flex flex-col shadow-2xl z-10 animate-in slide-in-from-right text-slate-900">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                  <Video className="w-5 h-5 text-teal-600" />
                  {selectedBatchData.name} — Sessions & Recordings
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Video Access: <span className="font-bold text-teal-700">{selectedBatchData.recordingAccessDays || 7} Days Post-Class</span>
                </p>
              </div>
              <button onClick={() => setIsSessionsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-4 bg-teal-50 border-b border-teal-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> Auto-Generate 45-Day Course Schedule?
                </p>
                <p className="text-[11px] text-teal-700">Creates 45 daily topics starting from batch start date ({new Date(selectedBatchData.startDate).toLocaleDateString('en-IN')}).</p>
              </div>
              <button 
                onClick={handleAutoSchedule}
                disabled={isAutoScheduling}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isAutoScheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : "⚡ Auto-Generate"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedBatchData.sessions?.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-700">No sessions scheduled for this batch yet.</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Click "Auto-Generate" above to create all 45 daily sessions automatically.</p>
                </div>
              ) : (
                selectedBatchData.sessions.map((session: any) => (
                  <div key={session.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 hover:border-teal-400 transition-colors shadow-xs">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-teal-100 text-teal-900 px-2.5 py-1 rounded-md border border-teal-200">
                          Day {session.dayNumber || 1}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm">{session.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.isExpired ? (
                          <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Video Expired
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {session.daysRemaining}d Access Left
                          </span>
                        )}
                        <button onClick={() => openEditSessionModal(session)} title="Edit Topic / Recording" className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {session.description && <p className="text-xs text-slate-600">{session.description}</p>}

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(session.startTime).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                        <a href={session.meetLink || "https://meet.google.com/new"} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline truncate">
                          {session.meetLink || "Join Meet"}
                        </a>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="flex items-center gap-2 text-xs">
                        <PlayCircle className="w-4 h-4 text-rose-600" />
                        <span className="font-bold text-slate-700">Recording MP4 / HLS:</span>
                        {session.recordingUrl ? (
                          <a href={session.recordingUrl} target="_blank" rel="noreferrer" className="text-teal-600 font-bold truncate max-w-[220px] hover:underline">
                            {session.recordingUrl}
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">No video attached yet</span>
                        )}
                      </div>
                      <button onClick={() => openEditSessionModal(session)} className="text-[11px] font-bold text-teal-700 hover:text-teal-800 underline">
                        {session.recordingUrl ? "Update Link" : "+ Attach Recording"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Topic & Recording Modal */}
      {editingSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl text-slate-900">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Edit Class Session Topic & Recording</h3>
              <button onClick={() => setEditingSession(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>
            <form onSubmit={handleSaveSession} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Topic Title *</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 outline-none"
                  value={sessionForm.title} onChange={e => setSessionForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Topic Description / Syllabus</label>
                <textarea rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:border-teal-500 outline-none"
                  value={sessionForm.description} onChange={e => setSessionForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Meeting Link (Google Meet / Zoom)</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 outline-none"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={sessionForm.meetLink} onChange={e => setSessionForm(p => ({ ...p, meetLink: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Session Recording Video URL (MP4 / Vimeo / Drive)</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 outline-none font-mono text-xs"
                  placeholder="https://drive.google.com/file/d/... or Vimeo MP4"
                  value={sessionForm.recordingUrl} onChange={e => setSessionForm(p => ({ ...p, recordingUrl: e.target.value }))} />
                <p className="text-[10px] text-slate-400 mt-1">Once attached, students can watch this recording for {selectedBatchData?.recordingAccessDays || 7} days from the session date.</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setEditingSession(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

