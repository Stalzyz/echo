"use client"

import { useApi, fetchApi } from "@/lib/useApi"
import { FileText, Plus, Save, Trash2, ListChecks, Link, Loader2, Edit3 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function FormBuilderAdmin() {
  const { data: forms, mutate } = useApi<any[]>("/academy/forms")
  const [isBuilding, setIsBuilding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formMeta, setFormMeta] = useState({ title: "", description: "", createLead: true })
  const [fields, setFields] = useState<any[]>([])

  const startNewForm = () => {
    setEditingId(null)
    setFormMeta({ title: "", description: "", createLead: true })
    setFields([])
    setIsBuilding(true)
  }

  const editForm = (form: any) => {
    setEditingId(form.id)
    setFormMeta({ title: form.title, description: form.description || "", createLead: form.createLead })
    setFields(form.fields.map((f: any) => ({
      ...f,
      options: Array.isArray(f.options) ? f.options.join(", ") : f.options
    })))
    setIsBuilding(true)
  }

  const addField = () => {
    setFields([...fields, { id: `field_${Date.now()}`, label: "", type: "TEXT", required: true, options: "" }])
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const updateField = (index: number, key: string, value: any) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], [key]: value }
    setFields(newFields)
  }

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formMeta.title) return toast.error("Title is required")
    if (fields.length === 0) return toast.error("Add at least one field")
    
    if (fields.some(f => !f.label.trim())) return toast.error("All fields must have a label")

    setIsSubmitting(true)
    try {
      const cleanFields = fields.map(f => ({
        ...f,
        options: f.type === "SELECT" || f.type === "RADIO" 
          ? f.options.split(',').map((s:string) => s.trim()).filter(Boolean) 
          : []
      }))

      if (editingId) {
        await fetchApi(`/academy/forms/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify({ ...formMeta, fields: cleanFields })
        })
        toast.success("Form updated successfully!")
      } else {
        await fetchApi("/academy/forms", {
          method: "POST",
          body: JSON.stringify({ ...formMeta, fields: cleanFields })
        })
        toast.success("Form published successfully!")
      }
      
      setIsBuilding(false)
      setEditingId(null)
      setFormMeta({ title: "", description: "", createLead: true })
      setFields([])
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to save form")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/f/${slug}`)
    toast.success("Public link copied to clipboard")
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-slate-900">
            <ListChecks className="w-8 h-8 text-teal-600" /> Form Builder
          </h1>
          <p className="text-slate-500 mt-2">Create custom enquiry and registration forms instantly.</p>
        </div>
        {!isBuilding && (
          <button onClick={startNewForm} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Create New Form
          </button>
        )}
      </div>

      {!isBuilding && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(forms || []).map((form: any) => (
            <div key={form.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col group relative shadow-sm hover:border-teal-400 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest border ${form.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                  {form.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
                {form.createLead && <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-1 rounded font-bold uppercase border border-sky-200">CRM SYNC</span>}
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">{form.title}</h3>
              <p className="text-xs text-slate-500 mb-6 flex-1">{form.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <a href={`/dashboard/academy/forms/${form.id}`} className="text-sm font-bold text-teal-600 hover:text-teal-700">
                  {form._count?.submissions || 0} Submissions
                </a>
                <div className="flex gap-2">
                  <button onClick={() => editForm(form)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors" title="Edit form">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => copyLink(form.slug)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors" title="Copy public link">
                    <Link className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isBuilding && (
        <div className="max-w-4xl w-full mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-6 shadow-sm">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900">
              <FileText className="w-5 h-5 text-teal-600" /> Form Settings
            </h2>
            <div className="space-y-4">
              <input required placeholder="Form Title (e.g. Scholarship Application)" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:border-teal-500 transition-colors outline-none"
                value={formMeta.title} onChange={e => setFormMeta(p => ({...p, title: e.target.value}))} />
              
              <div className="relative">
                <textarea placeholder="Form Description (Optional)" rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pb-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 transition-colors outline-none resize-none"
                  value={formMeta.description} onChange={e => setFormMeta(p => ({...p, description: e.target.value}))} />
              </div>

              <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input type="checkbox" className="w-5 h-5 accent-teal-600"
                  checked={formMeta.createLead} onChange={e => setFormMeta(p => ({...p, createLead: e.target.checked}))} />
                <div>
                  <div className="font-bold text-sm text-slate-900">Auto-create CRM Lead</div>
                  <div className="text-xs text-slate-500">If checked, we'll try to extract Name, Phone, and Email to create a Lead automatically.</div>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-black mb-4 px-2 text-slate-900">Fields Configuration</h2>
            
            {fields.map((field, index) => (
              <div key={field.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-4 items-start relative group shadow-sm">
                <div className="flex-1 space-y-4">
                  <div className="flex gap-4">
                    <input required placeholder="Question / Field Label" 
                      className="flex-[2] bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-500"
                      value={field.label} onChange={e => updateField(index, "label", e.target.value)} />
                    
                    <select className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none"
                      value={field.type} onChange={e => updateField(index, "type", e.target.value)}>
                      <option value="TEXT">Short Text</option>
                      <option value="TEXTAREA">Long Paragraph</option>
                      <option value="EMAIL">Email</option>
                      <option value="PHONE">Phone Number</option>
                      <option value="DATE">Date Picker</option>
                      <option value="FILE">File Upload</option>
                      <option value="SELECT">Dropdown Select</option>
                      <option value="RADIO">Radio Buttons</option>
                    </select>

                    <label className="flex items-center gap-2 px-4 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer">
                      <input type="checkbox" className="accent-teal-600"
                        checked={field.required} onChange={e => updateField(index, "required", e.target.checked)} />
                      <span className="text-xs font-bold text-slate-700">Required</span>
                    </label>
                  </div>

                  {(field.type === "SELECT" || field.type === "RADIO") && (
                    <input placeholder="Enter options separated by commas (e.g. Graphic Design, UI/UX, Web Dev)" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-500"
                      value={field.options} onChange={e => updateField(index, "options", e.target.value)} />
                  )}
                </div>
                
                <button type="button" onClick={() => removeField(index)} className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button type="button" onClick={addField} className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white rounded-2xl flex items-center justify-center gap-2 text-slate-500 font-bold transition-all">
              <Plus className="w-5 h-5 text-teal-600" /> Add Field
            </button>
          </div>

          <div className="flex gap-4 sticky bottom-8">
            <button onClick={() => {setIsBuilding(false); setEditingId(null)}} className="flex-1 py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl font-bold transition-colors">Cancel</button>
            <button onClick={handleSaveForm} disabled={isSubmitting} className="flex-[2] py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black shadow-sm transition-colors flex justify-center items-center gap-2">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> {editingId ? "Save Changes" : "Publish Form"}</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
