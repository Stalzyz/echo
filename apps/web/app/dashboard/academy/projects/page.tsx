"use client"

import { useState } from  "react"
import { useApi, fetchApi } from  "@/lib/useApi"
import { useOrganization } from  "@/context/OrganizationContext"
import { toast } from  "sonner"
import { FolderGit2, Plus, Users, Clock, X, Loader2 } from  "lucide-react"

export default function AcademyProjects() {
  const org = useOrganization()
  const { data: projects, mutate: refreshProjects } = useApi<any[]>("/academy/projects")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState({ title: "", type: "INTERNAL", description: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/academy/projects", { method: "POST", body: JSON.stringify(form) })
      toast.success("Project created!")
      setIsAddOpen(false)
      setForm({ title: "", type: "INTERNAL", description: "" })
      refreshProjects()
    } catch (err: any) {
      toast.error(err.message || "Failed to create project")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <FolderGit2 className="w-8 h-8 text-teal-600" /> Live Project Hub
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage internal, client, and hackathon projects for {org?.name || 'your academy'}.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(projects || []).map((p: any) => (
          <div key={p.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-slate-300 transition-colors shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-extrabold text-slate-900 text-lg">{p.title}</h3>
                <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wider">{p.type}</span>
              </div>
              <p className="text-xs text-slate-500 mb-6 line-clamp-2 font-medium leading-relaxed">{p.description || "No description provided."}</p>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> {p.members?.length || 0} Members</div>
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {p.status}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-900">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">Create Project</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider block mb-1">Project Title</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider block mb-1">Type</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                  <option value="INTERNAL">Internal Concept</option>
                  <option value="CLIENT">Real Client Project</option>
                  <option value="HACKATHON">Hackathon</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider block mb-1">Description</label>
                <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
                  value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              </div>
              <div className="pt-4 border-t border-slate-200 flex gap-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors text-slate-700">Cancel</button>
                <button disabled={isSubmitting} type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex justify-center items-center gap-2 shadow-xs">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
