"use client"

import { useState, useEffect } from "react"
import { useApi, fetchApi } from "@/lib/useApi"
import { toast } from "sonner"
import {
  ChevronRight, Clock, CheckCircle2, AlertCircle, XCircle,
  MessageSquare, RotateCcw, Star, Send, Check, Loader2,
  GitBranch, Layers, Award, Archive, Plus, ExternalLink,
  BookOpen, FileText, Trash2, MoreVertical, Save
} from "lucide-react"
import { createAssignment, getAssignments, updateAssignment } from "./actions"

const STATUS_META: Record<string, { label: string; color: string; icon: any }> = {
  DRAFT:              { label: "Draft",            color: "text-slate-600 border-slate-200 bg-slate-100",          icon: Archive },
  SUBMITTED:          { label: "Submitted",         color: "text-sky-700 border-sky-200 bg-sky-50",             icon: Send },
  UNDER_REVIEW:       { label: "Under Review",      color: "text-amber-700 border-amber-200 bg-amber-50",       icon: Clock },
  GRADED:             { label: "Graded",            color: "text-teal-700 border-teal-200 bg-teal-50",           icon: Star },
  RESUBMIT_REQUESTED: { label: "Revision Needed",   color: "text-orange-700 border-orange-200 bg-orange-50",    icon: RotateCcw },
  APPROVED:           { label: "Approved ✓",        color: "text-emerald-700 border-emerald-200 bg-emerald-50",   icon: CheckCircle2 },
  FINAL:              { label: "Final",             color: "text-slate-900 border-slate-300 bg-slate-100",          icon: Award },
}

const PIPELINE = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "GRADED", "RESUBMIT_REQUESTED", "APPROVED"]

function StatusPill({ status }: { status: string }) {
  const meta = STATUS_META[status] || STATUS_META.DRAFT
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xl border ${meta.color}`}>
      <Icon className="w-3 h-3" /> {meta.label}
    </span>
  )
}

export default function SubmissionReviewPage() {
  const { data: submissions, mutate, isLoading } = useApi<any[]>("/academy/submissions?status=SUBMITTED")
  const [selected, setSelected] = useState<any>(null)
  const [versions, setVersions] = useState<any[]>([])
  const [annotation, setAnnotation] = useState("")
  const [gradeForm, setGradeForm] = useState({ grade: "", feedback: "", status: "GRADED" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"REVIEW"|"VERSIONS"|"ANNOTATIONS">("REVIEW")

  const [activeMainTab, setActiveMainTab] = useState<"SUBMISSIONS" | "ASSIGNMENTS">("SUBMISSIONS")
  const [assignments, setAssignments] = useState<any[]>([])
  const [newAssignmentForm, setNewAssignmentForm] = useState<{id?: string, title: string, brief: string, maxScore: number}>({ title: "", brief: "", maxScore: 100 })
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    getAssignments().then(setAssignments)
  }, [])

  const handleCreateAssignment = async () => {
    if (!newAssignmentForm.title) return toast.error("Title is required")
    setIsCreating(true)
    try {
      if (newAssignmentForm.id) {
        const updated = await updateAssignment(newAssignmentForm.id, newAssignmentForm)
        setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a))
        toast.success("Assignment updated!")
      } else {
        const created = await createAssignment(newAssignmentForm)
        setAssignments(prev => [created, ...prev])
        toast.success("Assignment created!")
      }
      setNewAssignmentForm({ title: "", brief: "", maxScore: 100 })
      setShowCreateForm(false)
    } catch (err: any) {
      toast.error("Failed to save assignment")
    } finally {
      setIsCreating(false)
    }
  }

  const loadFull = async (sub: any) => {
    const full = await fetchApi<any>(`/academy/submissions/${sub.id}`)
    setSelected(full)
    setVersions(full.versions || [])
    setAnnotation("")
    setGradeForm({ grade: full.grade?.toString() || "", feedback: full.feedback || "", status: full.status === "APPROVED" ? "APPROVED" : "GRADED" })
    setActiveTab("REVIEW")
  }

  const handleReview = async () => {
    if (!selected) return
    setIsSubmitting(true)
    try {
      await fetchApi(`/academy/submissions/${selected.id}/review`, {
        method: "PATCH",
        body: JSON.stringify({
          status: gradeForm.status,
          grade: gradeForm.grade ? parseInt(gradeForm.grade) : undefined,
          feedback: gradeForm.feedback,
        })
      })
      const msg = gradeForm.status === "APPROVED"
        ? "✅ Approved! Auto-pushed to student portfolio."
        : gradeForm.status === "RESUBMIT_REQUESTED"
        ? "Revision requested from student."
        : "Submission graded!"
      toast.success(msg)
      mutate()
      setSelected(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to update submission")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnnotate = async () => {
    if (!selected || !annotation.trim()) return
    setIsSubmitting(true)
    try {
      await fetchApi(`/academy/submissions/${selected.id}/annotate`, {
        method: "POST",
        body: JSON.stringify({ mentorId: "MENTOR", content: annotation })
      })
      toast.success("Annotation added!")
      setAnnotation("")
      await loadFull(selected)
    } catch (err: any) {
      toast.error(err.message || "Failed to add annotation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResolve = async (annotationId: string) => {
    await fetchApi(`/academy/submissions/annotations/${annotationId}/resolve`, { method: "PATCH" })
    toast.success("Marked resolved")
    await loadFull(selected)
  }

  return (
    <div className="flex h-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* ── Left: Sidebar ───────────────────────── */}
      <div className="w-80 flex-none border-r border-slate-200 bg-white flex flex-col shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <button 
            onClick={() => { setActiveMainTab("SUBMISSIONS"); setSelected(null); setShowCreateForm(false); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeMainTab === "SUBMISSIONS" ? "bg-teal-50 text-teal-700 border border-teal-200" : "text-slate-500 hover:text-slate-900"}`}>
            <Archive className="w-4 h-4" /> Queue
          </button>
          <button 
            onClick={() => { setActiveMainTab("ASSIGNMENTS"); setSelected(null); setShowCreateForm(false); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeMainTab === "ASSIGNMENTS" ? "bg-teal-50 text-teal-700 border border-teal-200" : "text-slate-500 hover:text-slate-900"}`}>
            <FileText className="w-4 h-4" /> Manage
          </button>
        </div>

        {activeMainTab === "SUBMISSIONS" ? (
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoading && <div className="flex justify-center p-8"><Loader2 className="w-5 h-5 animate-spin text-teal-600" /></div>}
            {(submissions || []).length === 0 && !isLoading && (
              <div className="p-8 text-center text-slate-400 text-sm">No submissions waiting for review.</div>
            )}
            {(submissions || []).map((sub: any) => (
              <button key={sub.id} onClick={() => loadFull(sub)}
                className={`w-full text-left p-5 hover:bg-slate-50 transition-colors ${selected?.id === sub.id ? "bg-teal-50/50 border-l-4 border-teal-600" : ""}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-semibold text-sm text-slate-900 truncate">{sub.assignment?.title}</span>
                  <StatusPill status={sub.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <GitBranch className="w-3 h-3" />
                  <span>v{sub.versionCount || 1}</span>
                  {(sub._count?.annotations || 0) > 0 && (
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <MessageSquare className="w-3 h-3" /> {sub._count.annotations} open
                    </span>
                  )}
                  <span className="ml-auto">{new Date(sub.updatedAt).toLocaleDateString('en-IN')}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4">
              <button 
                onClick={() => { 
                  setNewAssignmentForm({ title: "", brief: "", maxScore: 100 });
                  setShowCreateForm(true); 
                  setSelected(null); 
                }}
                className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-teal-700 hover:border-teal-400 hover:bg-teal-50 text-sm font-bold transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" /> New Assignment
              </button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 border-t border-slate-200">
              {assignments.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">No assignments created yet.</div>
              )}
              {assignments.map((assignment: any) => (
                <div key={assignment.id} className="p-5 hover:bg-slate-50 transition-colors group flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-slate-900 mb-1">{assignment.title}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>{assignment.maxScore} pts</span>
                      <span>•</span>
                      <span>{new Date(assignment.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                  <button onClick={() => {
                    setNewAssignmentForm({
                      id: assignment.id,
                      title: assignment.title,
                      brief: assignment.brief || "",
                      maxScore: assignment.maxScore
                    });
                    setShowCreateForm(true);
                  }} className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all border border-slate-200 font-bold">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Main Panel ───────────────────────────── */}
      {showCreateForm ? (
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-slate-50">
          <div className="max-w-2xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Assignment</h2>
              <p className="text-slate-500 text-sm">Define a new assignment for your students.</p>
            </div>
            
            <div className="space-y-6 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 ml-1">Assignment Title</label>
                <input 
                  type="text" 
                  value={newAssignmentForm.title}
                  onChange={e => setNewAssignmentForm(p => ({...p, title: e.target.value}))}
                  placeholder="e.g. Build a React component"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 ml-1">Assignment Brief</label>
                <textarea 
                  rows={6}
                  value={newAssignmentForm.brief}
                  onChange={e => setNewAssignmentForm(p => ({...p, brief: e.target.value}))}
                  placeholder="Describe what the student needs to do..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 resize-none" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 ml-1">Max Score</label>
                <input 
                  type="number" 
                  value={newAssignmentForm.maxScore}
                  onChange={e => setNewAssignmentForm(p => ({...p, maxScore: parseInt(e.target.value)}))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500" 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 gap-4">
              <button onClick={() => setShowCreateForm(false)} className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleCreateAssignment}
                disabled={isCreating}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors shadow-sm flex items-center gap-2">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {newAssignmentForm.id ? "Update Assignment" : "Create Assignment"}
              </button>
            </div>
          </div>
        </div>
      ) : !selected ? (
        <div className="flex-1 flex items-center justify-center flex-col gap-4 text-slate-300">
          <Layers className="w-12 h-12 text-slate-300" />
          <p className="text-sm font-medium text-slate-400">Select a submission to review</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {/* Header */}
          <div className="px-8 py-5 border-b border-slate-200 bg-white flex items-center justify-between shadow-xs">
            <div>
              <h1 className="text-xl font-black text-slate-900">{selected.assignment?.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <StatusPill status={selected.status} />
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <GitBranch className="w-3 h-3" /> Version {selected.versionCount}
                </span>
                {selected.pushedToPortfolio && (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <Award className="w-3 h-3 text-emerald-600" /> In Portfolio
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 transition-colors text-xs font-bold">✕ Close</button>
          </div>

          {/* Status Pipeline */}
          <div className="px-8 py-4 border-b border-slate-200 bg-white flex items-center gap-1 overflow-x-auto">
            {PIPELINE.map((s, i) => {
              const meta = STATUS_META[s]
              const isActive = s === selected.status
              const isPast = PIPELINE.indexOf(selected.status) > i
              return (
                <div key={s} className="flex items-center gap-1 shrink-0">
                  <div className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border transition-all
                    ${isActive ? meta.color : isPast ? "text-slate-400 border-slate-200 bg-slate-100 line-through" : "text-slate-400 border-slate-200 bg-slate-50"}`}>
                    {meta.label}
                  </div>
                  {i < PIPELINE.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />}
                </div>
              )
            })}
          </div>

          {/* Tabs */}
          <div className="px-8 pt-4 flex gap-4 border-b border-slate-200 bg-white">
            {(["REVIEW", "VERSIONS", "ANNOTATIONS"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold uppercase tracking-widest pb-3 border-b-2 transition-all
                  ${activeTab === tab ? "border-teal-600 text-teal-700" : "border-transparent text-slate-400 hover:text-slate-700"}`}>
                {tab} {tab === "ANNOTATIONS" && selected.annotations?.length > 0 && `(${selected.annotations.filter((a:any)=>!a.resolved).length})`}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">

            {/* ─ Review Tab ─ */}
            {activeTab === "REVIEW" && (
              <div className="space-y-6 max-w-2xl">
                {/* Files */}
                {selected.fileUrls?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">Submitted Files</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.fileUrls.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-medium shadow-xs">
                          <ExternalLink className="w-3 h-3 text-teal-600" /> File {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {selected.linkUrl && (
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Link Submission</p>
                    <a href={selected.linkUrl} target="_blank" rel="noopener noreferrer"
                      className="text-teal-600 text-sm font-bold underline flex items-center gap-1 hover:text-teal-700">
                      <ExternalLink className="w-3.5 h-3.5" />{selected.linkUrl}
                    </a>
                  </div>
                )}

                {/* Grade Form */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-base">Grade & Review</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase tracking-widest block mb-2">Score (out of {selected.assignment?.maxScore || 100})</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-teal-500 outline-none"
                        placeholder="e.g. 88"
                        value={gradeForm.grade} onChange={e => setGradeForm(p => ({...p, grade: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase tracking-widest block mb-2">Action</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-teal-500 outline-none"
                        value={gradeForm.status} onChange={e => setGradeForm(p => ({...p, status: e.target.value}))}>
                        <option value="UNDER_REVIEW">Mark Under Review</option>
                        <option value="GRADED">Grade Only</option>
                        <option value="RESUBMIT_REQUESTED">Request Revision</option>
                        <option value="APPROVED">Approve → Push to Portfolio</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest block mb-2">Feedback to Student</label>
                    <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-teal-500 outline-none resize-none"
                      placeholder="Write detailed feedback for the student..."
                      value={gradeForm.feedback} onChange={e => setGradeForm(p => ({...p, feedback: e.target.value}))} />
                  </div>
                  <button onClick={handleReview} disabled={isSubmitting}
                    className={`w-full font-bold py-3.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm
                      ${gradeForm.status === "APPROVED" ? "bg-teal-600 hover:bg-teal-700 text-white" :
                        gradeForm.status === "RESUBMIT_REQUESTED" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                        "bg-slate-900 text-white"}`}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> :
                      gradeForm.status === "APPROVED" ? "✓ Approve & Push to Portfolio" :
                      gradeForm.status === "RESUBMIT_REQUESTED" ? "↩ Request Revision" :
                      "Submit Review"}
                  </button>
                </div>
              </div>
            )}

            {/* ─ Versions Tab ─ */}
            {activeTab === "VERSIONS" && (
              <div className="max-w-xl space-y-3">
                {versions.length === 0 && <p className="text-slate-400 text-sm">No version history yet.</p>}
                {versions.map((v: any) => (
                  <div key={v.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-sm font-black text-teal-700">
                        v{v.version}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">Version {v.version}</p>
                        <p className="text-xs text-slate-500">{new Date(v.submittedAt).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    {v.note && <p className="text-xs text-slate-600 italic mb-3">"{v.note}"</p>}
                    {v.fileUrls?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {v.fileUrls.map((url: string, i: number) => (
                          <a key={i} href={url} target="_blank"
                            className="text-xs px-2.5 py-1.5 bg-slate-50 rounded-lg text-slate-700 border border-slate-200 font-medium hover:bg-slate-100 transition-colors">
                            File {i+1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ─ Annotations Tab ─ */}
            {activeTab === "ANNOTATIONS" && (
              <div className="max-w-xl space-y-4">
                {/* Add annotation */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-3 shadow-sm">
                  <textarea rows={2} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-teal-500 outline-none resize-none"
                    placeholder="Add an inline note, question, or suggestion..."
                    value={annotation} onChange={e => setAnnotation(e.target.value)} />
                  <button onClick={handleAnnotate} disabled={isSubmitting || !annotation.trim()}
                    className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition disabled:opacity-40 self-start mt-1 shadow-sm">
                    {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                  </button>
                </div>

                {/* Annotation list */}
                {(selected.annotations || []).length === 0 && (
                  <p className="text-slate-400 text-sm text-center py-4">No annotations yet. Add the first one above.</p>
                )}
                {(selected.annotations || []).map((a: any) => (
                  <div key={a.id} className={`flex gap-3 p-4 rounded-2xl border transition-all
                    ${a.resolved ? "opacity-50 bg-slate-50 border-slate-200" : "bg-white border-slate-200 shadow-sm"}`}>
                    <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 mt-0.5">
                      <MessageSquare className="w-3 h-3 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 font-medium">{a.content}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(a.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                    {!a.resolved && (
                      <button onClick={() => handleResolve(a.id)}
                        className="shrink-0 flex items-center gap-1 text-xs text-emerald-700 font-bold hover:text-emerald-800 transition-colors">
                        <Check className="w-3 h-3" /> Resolve
                      </button>
                    )}
                    {a.resolved && <span className="text-xs text-slate-400 shrink-0">Resolved</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
