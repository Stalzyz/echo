"use client"

import { useState } from "react"
import { 
  BookOpen, Plus, Tag, Layers, CheckCircle2, ShieldCheck, 
  Sparkles, Check, X, Edit3, Settings2
} from "lucide-react"
import { toast } from "sonner"

interface CourseCategory {
  id: string
  name: string
  slug: string
  totalCourses: number
  status: "ACTIVE" | "DISABLED"
}

const INITIAL_CATEGORIES: CourseCategory[] = [
  { id: "cat-1", name: "Software Development & AI", slug: "software-dev", totalCourses: 142, status: "ACTIVE" },
  { id: "cat-2", name: "Business & Management", slug: "business-mgmt", totalCourses: 86, status: "ACTIVE" },
  { id: "cat-3", name: "Design & Media", slug: "design-media", totalCourses: 54, status: "ACTIVE" },
  { id: "cat-4", name: "Civil Services & Competitive Exams", slug: "civil-services", totalCourses: 62, status: "ACTIVE" },
  { id: "cat-5", name: "Healthcare & Life Sciences", slug: "healthcare", totalCourses: 29, status: "ACTIVE" },
]

export default function GlobalCoursesGovernancePage() {
  const [categories, setCategories] = useState<CourseCategory[]>(INITIAL_CATEGORIES)
  const [newCatName, setNewCatName] = useState("")
  const [autoApproval, setAutoApproval] = useState(true)

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName) return
    const newCat: CourseCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      totalCourses: 0,
      status: "ACTIVE"
    }
    setCategories([...categories, newCat])
    setNewCatName("")
    toast.success(`Global course category "${newCatName}" created successfully!`)
  }

  const toggleCategoryStatus = (id: string) => {
    setCategories(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === "DISABLED" ? "ACTIVE" : "DISABLED"
        toast.success(`Category "${c.name}" status set to ${nextStatus}`)
        return { ...c, status: nextStatus }
      }
      return c
    }))
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              GLOBAL LMS CATALOG
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Global Course Governance</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage global LMS course categories, course types, approval settings, and featured curriculum across all academies.</p>
        </div>
      </div>

      {/* Global Settings Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-black text-slate-900">Global Course Approval Queue</h3>
          <p className="text-xs text-slate-500 mt-0.5">Control whether tenant academies can publish courses directly or require Super Admin approval.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">Auto-Approve Tenant Courses</span>
          <button 
            onClick={() => {
              setAutoApproval(!autoApproval)
              toast.success(`Course approval queue setting set to ${!autoApproval ? 'Auto-Approve' : 'Require Review'}`)
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${autoApproval ? "bg-teal-600" : "bg-slate-300"}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${autoApproval ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs mb-8">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-slate-900 text-lg">Global Course Categories</h3>
            <p className="text-xs text-slate-500">Categories available for tenant academies when creating courses.</p>
          </div>

          <form onSubmit={handleAddCategory} className="flex items-center gap-2 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="New category name..."
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button type="submit" className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 transition-colors shrink-0">
              Add Category
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Category Name</th>
                <th className="py-4 px-6">URL Slug</th>
                <th className="py-4 px-6">Total Published Courses</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-extrabold text-slate-900">
                    {c.name}
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-slate-500">
                    {c.slug}
                  </td>

                  <td className="py-4 px-6 font-mono font-bold text-slate-800">
                    {c.totalCourses}
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      c.status === "ACTIVE" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                      {c.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => toggleCategoryStatus(c.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                        c.status === "DISABLED"
                          ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700"
                      }`}
                    >
                      {c.status === "DISABLED" ? "Enable" : "Disable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
