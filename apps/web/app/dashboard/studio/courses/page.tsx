"use client"

import { useApi, fetchApi } from "@/lib/useApi"
import { BookOpen, Plus, Loader2, ArrowRight, UserPlus, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { BragGeneratorModal, BragData } from "@/components/BragGeneratorModal"

export default function OnsiteCoursesPage() {
  const { data: batchesRes, isLoading, mutate } = useApi<any>("/academy/batches")
  const courses = Array.isArray(batchesRes?.data) ? batchesRes.data : Array.isArray(batchesRes) ? batchesRes : []

  const { data: educatorsData } = useApi<any>("/academy/educators")
  const educatorsList = Array.isArray(educatorsData?.data) ? educatorsData.data : Array.isArray(educatorsData) ? educatorsData : []
  const educators = educatorsList.filter((e: any) => e.deliveryMode === 'ONSITE')

  const [assignModal, setAssignModal] = useState<{isOpen: boolean, batchId: string, currentEducatorId: string}>({isOpen: false, batchId: "", currentEducatorId: ""})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEducator, setSelectedEducator] = useState("")

  const [bragModal, setBragModal] = useState<{ isOpen: boolean; data: BragData }>({
    isOpen: false,
    data: { type: "COURSE", title: "" }
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    courseName: "", courseCode: "", courseDuration: "3 Months", courseFee: "50000",
    batchName: "", batchType: "MORNING", startDate: "", endDate: "", capacity: "20"
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi(`/academy/batches/with-course`, {
        method: "POST",
        body: JSON.stringify({
          ...createForm,
          courseFee: parseFloat(createForm.courseFee),
          capacity: parseInt(createForm.capacity),
          startDate: createForm.startDate ? new Date(createForm.startDate).toISOString() : new Date().toISOString(),
          endDate: createForm.endDate ? new Date(createForm.endDate).toISOString() : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        })
      })
      toast.success("Course & Batch created successfully!")
      setIsCreateModalOpen(false)
      setCreateForm({
        courseName: "", courseCode: "", courseDuration: "3 Months", courseFee: "50000",
        batchName: "", batchType: "MORNING", startDate: "", endDate: "", capacity: "20"
      })
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to create course")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi(`/academy/batches/${assignModal.batchId}`, {
        method: "PATCH",
        body: JSON.stringify({ educatorId: selectedEducator || undefined })
      })
      toast.success("Instructor assigned successfully!")
      setAssignModal({isOpen: false, batchId: "", currentEducatorId: ""})
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to assign instructor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto relative">
      <div className="flex-none border-b border-slate-200 pb-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center border border-teal-200">
              <BookOpen className="w-6 h-6 text-teal-600 relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Onsite Courses</h1>
              <p className="text-sm text-slate-500 mt-2">Manage course curriculum and materials for onsite batches.</p>
            </div>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Create Course
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((batch: any) => (
            <div key={batch.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col group hover:border-teal-400 transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-1 rounded font-bold uppercase tracking-widest border border-teal-200">
                  ONSITE BATCH
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold uppercase border border-emerald-200">
                  ACTIVE
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-2 text-slate-900">{batch.course?.name || "Untitled Course"}</h3>
              <p className="text-sm text-slate-500 mb-6">{batch.name} • {batch.type}</p>
              
              <div className="mb-6 flex items-center gap-2 border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">Instructor:</span>
                <span className="text-xs font-bold text-slate-800">{batch.educator ? `${batch.educator.user.firstName} ${batch.educator.user.lastName}` : 'Unassigned'}</span>
                <button onClick={() => { setAssignModal({isOpen: true, batchId: batch.id, currentEducatorId: batch.educatorId || ""}); setSelectedEducator(batch.educatorId || ""); }} className="ml-auto text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors flex items-center gap-1">
                  <UserPlus className="w-3 h-3" /> Assign
                </button>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    setBragModal({
                      isOpen: true,
                      data: {
                        type: "COURSE",
                        title: batch.course?.name || "Fullstack Web & AI Masterclass",
                        subtitle: `${batch.name} • ${batch.type}`,
                        authorOrAcademy: "echo Academy",
                        priceOrId: `₹${batch.courseFee || "49,999"}`,
                        highlights: [
                          "Live Mentorship & Doubt Sessions",
                          "Hands-on Real-world Capstone Projects",
                          "Official Industry Verified Certificate"
                        ],
                        linkUrl: `https://echo.grekam.in/academy/courses/${batch.courseId || "c-123"}`
                      }
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 font-bold text-xs flex items-center gap-1.5 transition-colors border border-purple-200 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" /> Brag & Launch
                </button>
                <Link href={`/dashboard/studio/courses/builder/${batch.courseId}`} className="text-teal-600 hover:text-teal-700 font-bold text-xs flex items-center gap-1 transition-colors">
                  Open Builder <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}

          {(!courses || courses.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
              <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
              <h2 className="text-xl font-bold text-slate-800">No Courses Found</h2>
              <p className="text-sm text-slate-400 mt-2 max-w-md">Get started by creating a new onsite course.</p>
            </div>
          )}
        </div>
      )}

      {assignModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl text-slate-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Assign Instructor</h2>
              <button onClick={() => setAssignModal({isOpen: false, batchId: "", currentEducatorId: ""})}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>
            <form onSubmit={handleAssign} className="space-y-4">
              <select value={selectedEducator} onChange={e => setSelectedEducator(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-teal-500 outline-none text-slate-900">
                <option value="">-- Unassigned --</option>
                {educators.map((ed: any) => (
                  <option key={ed.id} value={ed.id}>{ed.user.firstName} {ed.user.lastName} ({ed.designation || 'Educator'})</option>
                ))}
              </select>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors flex justify-center items-center">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Assignment"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-slate-900 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create New Onsite Course</h2>
              <button onClick={() => setIsCreateModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">1. Course Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2">Course Name *</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                      placeholder="e.g. Photography 101" value={createForm.courseName} onChange={e => setCreateForm(p => ({...p, courseName: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2">Course Code *</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                      placeholder="e.g. PHO101" value={createForm.courseCode} onChange={e => setCreateForm(p => ({...p, courseCode: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2">Duration</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                      placeholder="e.g. 3 Months" value={createForm.courseDuration} onChange={e => setCreateForm(p => ({...p, courseDuration: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2">Fee (₹)</label>
                    <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                      value={createForm.courseFee} onChange={e => setCreateForm(p => ({...p, courseFee: e.target.value}))} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">2. Initial Batch Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2">Batch Name *</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                      placeholder="e.g. June 2026 Cohort" value={createForm.batchName} onChange={e => setCreateForm(p => ({...p, batchName: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2">Timing Type</label>
                    <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                      value={createForm.batchType} onChange={e => setCreateForm(p => ({...p, batchType: e.target.value}))}>
                      <option value="MORNING">Morning Batch</option>
                      <option value="EVENING">Evening Batch</option>
                      <option value="WEEKEND">Weekend Batch</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2">Start Date *</label>
                    <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                      value={createForm.startDate} onChange={e => setCreateForm(p => ({...p, startDate: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2">End Date *</label>
                    <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                      value={createForm.endDate} onChange={e => setCreateForm(p => ({...p, endDate: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2">Max Students</label>
                    <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                      value={createForm.capacity} onChange={e => setCreateForm(p => ({...p, capacity: e.target.value}))} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Course & Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BragGeneratorModal
        isOpen={bragModal.isOpen}
        onClose={() => setBragModal(prev => ({ ...prev, isOpen: false }))}
        data={bragModal.data}
      />
    </div>
  )
}
