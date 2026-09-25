"use client"

import { useApi } from  "@/lib/useApi"
import { useParams } from  "next/navigation"
import { useState } from  "react"
import { CheckCircle2, Loader2, GraduationCap } from  "lucide-react"

export default function PublicFormRenderer() {
  const params = useParams()
  const { data: form, isLoading, error: fetchError } = useApi<any>(`/academy/forms/${params.slug}`)
  
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">Loading form...</div>
  if (fetchError || !form) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-rose-600 font-medium">Form not found or is currently inactive.</div>

  const handleInput = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleFileUpload = async (id: string, file: File) => {
    if (!file) return;
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.grekam.in/api/v1"
      const res = await fetch(`${API_URL}/storage/upload-local`, {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to upload file")
      
      handleInput(id, data.downloadUrl)
    } catch (err: any) {
      alert(err.message || "File upload failed")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")
    setIsSubmitting(true)
    
    try {
      for (const field of form.fields) {
        if (field.required && !formData[field.id]) {
            throw new Error(`Field ${field.label} is required.`);
        }
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.grekam.in/api/v1"
      const res = await fetch(`${API_URL}/academy/forms/${params.slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error || "Failed to submit")
      setIsSuccess(true)
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center text-slate-900 bg-white border border-slate-200 rounded-3xl p-12 shadow-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black mb-3 text-slate-900">Submitted Successfully</h1>
          <p className="text-slate-500">Thank you for your response. Our team will get back to you shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-2xl w-full">
        
        <div className="text-center mb-8 text-slate-900">
          <div className="inline-flex items-center gap-2 mb-6 bg-teal-50 border border-teal-200 px-4 py-2 rounded-full shadow-sm">
            <GraduationCap className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold tracking-widest uppercase text-teal-800">Echo LMS</span>
          </div>
          <h1 className="text-4xl font-black mb-3 text-slate-900">{form.title}</h1>
          {form.description && <p className="text-slate-500 text-lg">{form.description}</p>}
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          
          {form.fields.map((field: any) => (
            <div key={field.id} className="space-y-3">
              <label className="text-sm font-bold text-slate-800 block">
                {field.label} {field.required && <span className="text-rose-500">*</span>}
              </label>

              {(field.type === "TEXT" || field.type === "EMAIL" || field.type === "PHONE" || field.type === "DATE") && (
                <input 
                  type={field.type === "EMAIL" ? "email" : field.type === "PHONE" ? "tel" : field.type === "DATE" ? "date" : "text"}
                  required={field.required}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:border-teal-500 transition-colors"
                  onChange={e => handleInput(field.id, e.target.value)}
                />
              )}

              {field.type === "FILE" && (
                <div className="space-y-2">
                  <input 
                    type="file"
                    required={field.required && !formData[field.id]}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:border-teal-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(field.id, file);
                    }}
                  />
                  {formData[field.id] && <div className="text-xs text-emerald-600 font-bold">✓ File uploaded successfully</div>}
                </div>
              )}

              {field.type === "TEXTAREA" && (
                <textarea 
                  required={field.required}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                  onChange={e => handleInput(field.id, e.target.value)}
                />
              )}

              {field.type === "SELECT" && (
                <select 
                  required={field.required}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:border-teal-500 transition-colors"
                  onChange={e => handleInput(field.id, e.target.value)}
                >
                  <option value="">Select an option</option>
                  {(field.options || []).map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {field.type === "RADIO" && (
                <div className="space-y-3">
                  {(field.options || []).map((opt: string) => (
                    <label key={opt} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="radio" 
                        name={field.id}
                        value={opt}
                        required={field.required}
                        className="w-5 h-5 accent-teal-600"
                        onChange={e => handleInput(field.id, e.target.value)}
                      />
                      <span className="text-slate-800 font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {submitError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
              {submitError}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-sm mt-4"
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Response"}
          </button>
        </form>
      </div>
    </div>
  )
}
