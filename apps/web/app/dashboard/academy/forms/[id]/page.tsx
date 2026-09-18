"use client"

import { useApi } from "@/lib/useApi"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ListChecks, Calendar } from "lucide-react"

export default function FormSubmissionsView() {
  const params = useParams()
  const router = useRouter()
  const { data: form, isLoading } = useApi<any>(`/academy/forms/id/${params.id}`)

  if (isLoading) return <div className="p-8 text-slate-400 bg-slate-50 min-h-screen">Loading form data...</div>
  if (!form) return <div className="p-8 text-rose-600 bg-slate-50 min-h-screen">Form not found.</div>

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-bold w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Forms
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-black flex items-center gap-3 text-slate-900">
          <ListChecks className="w-8 h-8 text-teal-600" /> {form.title}
        </h1>
        <p className="text-slate-500 mt-2">{form.description}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-widest border-b border-slate-200">
            <tr>
              <th className="p-4 font-bold w-48">Submitted At</th>
              <th className="p-4 font-bold">Responses</th>
              <th className="p-4 font-bold w-32 text-right">CRM Sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(form.submissions || []).length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-slate-400">No submissions yet.</td></tr>
            )}
            {(form.submissions || []).map((sub: any) => (
              <tr key={sub.id} className="hover:bg-slate-50">
                <td className="p-4 align-top">
                  <div className="flex items-center gap-2 font-medium text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" /> {new Date(sub.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </td>
                <td className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {form.fields.map((field: any) => (
                      <div key={field.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">{field.label}</div>
                        <div className="font-medium text-slate-900 break-words">
                          {sub.data[field.id] || <span className="text-slate-400 italic">Empty</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right align-top">
                  {sub.leadId ? (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded">LEAD CREATED</span>
                  ) : (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-1 rounded">NO LEAD</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
