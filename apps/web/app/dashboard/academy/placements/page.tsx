"use client"

import { useState } from  "react"
import { useApi, fetchApi } from  "@/lib/useApi"
import { toast } from  "sonner"
import { Briefcase, Building, Plus, Users, Target, Search, X, Loader2 } from  "lucide-react"

export default function PlacementEngine() {
  const { data: companies, mutate: refreshCompanies } = useApi<any[]>("/academy/placements/companies")
  const { data: jobs, mutate: refreshJobs } = useApi<any[]>("/academy/placements/jobs")

  const [activeTab, setActiveTab] = useState<"JOBS" | "COMPANIES">("JOBS")
  const [isAddJobOpen, setIsAddJobOpen] = useState(false)
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false)
  const [jobForm, setJobForm] = useState({ companyId: "", title: "", location: "", minCareerScore: 80 })
  const [companyForm, setCompanyForm] = useState({ name: "", industry: "", website: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/academy/placements/jobs", {
        method: "POST",
        body: JSON.stringify(jobForm)
      })
      toast.success("Job posted successfully!")
      setIsAddJobOpen(false)
      setJobForm({ companyId: "", title: "", location: "", minCareerScore: 80 })
      refreshJobs()
    } catch (err: any) {
      toast.error(err.message || "Failed to post job")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/academy/placements/companies", {
        method: "POST",
        body: JSON.stringify(companyForm)
      })
      toast.success("Partner Company added successfully!")
      setIsAddCompanyOpen(false)
      setCompanyForm({ name: "", industry: "", website: "" })
      refreshCompanies()
    } catch (err: any) {
      toast.error(err.message || "Failed to add company")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-slate-900">
            <Target className="w-8 h-8 text-teal-600" /> Placement Engine
          </h1>
          <p className="text-slate-500 mt-2">Manage partner companies, job openings, and student placements.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === "JOBS" ? (
            <button onClick={() => setIsAddJobOpen(true)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Post New Job
            </button>
          ) : (
            <button onClick={() => setIsAddCompanyOpen(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Add Partner Company
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 mb-6">
        {(["JOBS", "COMPANIES"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-3 font-bold uppercase tracking-widest text-xs border-b-2 transition-colors
              ${activeTab === tab ? "border-teal-600 text-teal-700" : "border-transparent text-slate-400 hover:text-slate-700"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "JOBS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(jobs || []).map((job: any) => (
            <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-400 transition-colors group shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-600 transition-colors">{job.title}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                    <Building className="w-3.5 h-3.5" /> {job.company?.name}
                  </p>
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border
                  ${job.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                  {job.isActive ? "OPEN" : "CLOSED"}
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Location</span>
                  <span className="text-slate-800 font-medium">{job.location || "Remote"}</span>
                </div>
                <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Min. Career Score</span>
                  <span className="text-teal-600 font-bold">{job.minCareerScore} / 100</span>
                </div>
                <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Applications</span>
                  <span className="text-slate-800 font-medium flex items-center gap-1"><Users className="w-3 h-3" /> {job._count?.applications || 0}</span>
                </div>
              </div>
              <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors">
                View Applications &rarr;
              </button>
            </div>
          ))}
          {(jobs || []).length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-white">
              No jobs posted yet. Click "Post New Job" to begin.
            </div>
          )}
        </div>
      )}

      {activeTab === "COMPANIES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(companies || []).map((company: any) => (
            <div key={company.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-black text-xl">
                {company.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate">{company.name}</h3>
                <p className="text-xs text-slate-500">{company.industry || 'Tech Partner'}</p>
                <p className="text-[10px] text-teal-600 font-medium mt-1">{company._count?.jobs || 0} active jobs</p>
              </div>
            </div>
          ))}
          {(companies || []).length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-white">
              No partner companies added yet. Click "Add Partner Company" to begin.
            </div>
          )}
        </div>
      )}

      {/* Add Job Modal */}
      {isAddJobOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl text-slate-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Post New Job</h2>
              <button onClick={() => setIsAddJobOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>
            <form onSubmit={handleAddJob} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2 font-bold">Company</label>
                <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                  value={jobForm.companyId} onChange={e => setJobForm(p => ({...p, companyId: e.target.value}))}>
                  <option value="">Select a company...</option>
                  {(companies || []).map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2 font-bold">Job Title</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                  placeholder="e.g. UX Designer"
                  value={jobForm.title} onChange={e => setJobForm(p => ({...p, title: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2 font-bold">Location</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                  placeholder="e.g. Remote or Bangalore"
                  value={jobForm.location} onChange={e => setJobForm(p => ({...p, location: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2 font-bold">Minimum Career Score Filter (0-100)</label>
                <input required type="number" min={0} max={100} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                  value={jobForm.minCareerScore} onChange={e => setJobForm(p => ({...p, minCareerScore: parseInt(e.target.value)}))} />
                <p className="text-[10px] text-slate-400 mt-1">Students below this score will not be able to apply.</p>
              </div>
              <button disabled={isSubmitting || !jobForm.companyId} type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 mt-4 flex justify-center items-center gap-2 shadow-sm">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Job Opening"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {isAddCompanyOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl text-slate-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add Partner Company</h2>
              <button onClick={() => setIsAddCompanyOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2 font-bold">Company Name</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                  placeholder="e.g. Google or Nexus Tech"
                  value={companyForm.name} onChange={e => setCompanyForm(p => ({...p, name: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2 font-bold">Industry</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                  placeholder="e.g. Software & AI"
                  value={companyForm.industry} onChange={e => setCompanyForm(p => ({...p, industry: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest block mb-2 font-bold">Website URL</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                  placeholder="https://example.com"
                  value={companyForm.website} onChange={e => setCompanyForm(p => ({...p, website: e.target.value}))} />
              </div>
              <button disabled={isSubmitting || !companyForm.name} type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 mt-4 flex justify-center items-center gap-2 shadow-sm">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Partner Company"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
