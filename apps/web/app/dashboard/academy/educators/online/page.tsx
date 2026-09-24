"use client"

import { GraduationCap, Plus, Mail, Building, Briefcase, Loader2, X } from "lucide-react"
import { useApi, fetchApi } from "@/lib/useApi"
import { useOrganization } from "@/context/OrganizationContext"
import { useState } from "react"
import { toast } from "sonner"

export default function OnlineEducatorsPage() {
  const org = useOrganization()
  const { data: educatorsData, mutate, isLoading } = useApi<any[]>("/academy/educators")
  const educators = educatorsData?.filter(e => e.deliveryMode === 'ONLINE') || []
  
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    company: "",
    yearsExperience: 0,
    skills: "",
    bio: "",
    address: "",
    city: "",
    pincode: "",
    dateOfBirth: "",
    idProofType: "Aadhaar Card",
    idProofNumber: ""
  })

  const [editForm, setEditForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    designation: "",
    company: "",
    yearsExperience: 0,
    skills: "",
    bio: "",
    address: "",
    city: "",
    pincode: "",
    dateOfBirth: "",
    idProofType: "Aadhaar Card",
    idProofNumber: ""
  })

  const handleAddEducator = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/academy/educators", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          yearsExperience: Number(form.yearsExperience),
          skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          deliveryMode: 'ONLINE'
        })
      })
      toast.success("Educator added successfully!")
      setIsSlideOverOpen(false)
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        designation: "",
        company: "",
        yearsExperience: 0,
        skills: "",
        bio: "",
        address: "",
        city: "",
        pincode: "",
        dateOfBirth: "",
        idProofType: "Aadhaar Card",
        idProofNumber: ""
      })
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to add educator")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditEducator = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi(`/academy/educators/${editForm.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          phone: editForm.phone,
          designation: editForm.designation,
          company: editForm.company,
          yearsExperience: Number(editForm.yearsExperience),
          skills: editForm.skills ? editForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          bio: editForm.bio,
          address: editForm.address,
          city: editForm.city,
          pincode: editForm.pincode,
          dateOfBirth: editForm.dateOfBirth,
          idProofType: editForm.idProofType,
          idProofNumber: editForm.idProofNumber
        })
      })
      toast.success("Educator details updated successfully!")
      setIsEditModalOpen(false)
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to update educator")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditModal = (educator: any) => {
    setEditForm({
      id: educator.id,
      firstName: educator.user?.firstName || '',
      lastName: educator.user?.lastName || '',
      phone: educator.user?.phone || '',
      designation: educator.designation || '',
      company: educator.company || '',
      yearsExperience: educator.yearsExperience || 0,
      skills: educator.skills ? educator.skills.join(', ') : '',
      bio: educator.bio || '',
      address: educator.address || '',
      city: educator.city || '',
      pincode: educator.pincode || '',
      dateOfBirth: educator.dateOfBirth ? educator.dateOfBirth.split('T')[0] : '',
      idProofType: educator.idProofType || 'Aadhaar Card',
      idProofNumber: educator.idProofNumber || ''
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteEducator = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove remote educator ${name}?`)) return
    try {
      await fetchApi(`/academy/educators/${id}`, { method: "DELETE" })
      toast.success(`Educator ${name} deleted successfully`)
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete educator")
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto relative custom-scrollbar">
      <div className="flex-none border-b border-slate-200 bg-white p-6 rounded-2xl mb-8 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Remote Faculty</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">Manage all active online virtual learning educators for {org?.name || 'your academy'}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Educator
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(educators || []).map((educator: any) => (
            <div key={educator.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 relative group overflow-hidden shadow-xs flex flex-col justify-between">
              <div>
                <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wider">
                  ACTIVE
                </div>
                
                <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-xl font-black text-teal-800 mb-4">
                  {educator.user.firstName.charAt(0)}{educator.user.lastName.charAt(0)}
                </div>
                
                <h3 className="text-lg font-extrabold text-slate-900 truncate">{educator.user.firstName} {educator.user.lastName}</h3>
                <p className="text-xs text-teal-700 font-bold mb-4">{educator.designation || "Instructor"}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" /> <span className="truncate">{educator.user.email}</span>
                  </div>
                  {educator.company && (
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Building className="w-4 h-4 text-slate-400" /> {educator.company}
                    </div>
                  )}
                  {educator.yearsExperience > 0 && (
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Briefcase className="w-4 h-4 text-slate-400" /> {educator.yearsExperience} Years Experience
                    </div>
                  )}
                </div>
                
                {educator.skills && educator.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 mb-4">
                    {educator.skills.slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-semibold">{skill}</span>
                    ))}
                    {educator.skills.length > 3 && (
                      <span className="text-[10px] bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded font-semibold">+{educator.skills.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(educator)}
                  className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => handleDeleteEducator(educator.id, `${educator.user.firstName} ${educator.user.lastName}`)}
                  className="w-1/2 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {(!educators || educators.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 rounded-2xl bg-white shadow-xs">
              <GraduationCap className="w-16 h-16 text-slate-300 mb-4" />
              <h2 className="text-xl font-extrabold text-slate-900">No Remote Educators Found</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-md font-medium">Add your first virtual instructor by clicking the Add Educator button above.</p>
            </div>
          )}
        </div>
      )}

      {/* SlideOver for Add Educator */}
      {isSlideOverOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsSlideOverOpen(false)} />
          <div className="w-full sm:w-[480px] max-w-full bg-white h-full border-l border-slate-200 relative flex flex-col shadow-2xl z-10 text-slate-900">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-black flex items-center gap-2 text-slate-900">
                <GraduationCap className="w-5 h-5 text-teal-600" />
                Add Remote Educator
              </h2>
              <button onClick={() => setIsSlideOverOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddEducator} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">First Name *</label>
                  <input required value={form.firstName} onChange={e => setForm(p => ({...p, firstName: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Last Name *</label>
                  <input required value={form.lastName} onChange={e => setForm(p => ({...p, lastName: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                  <input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="+91 9876543210" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Date of Birth</label>
                  <input type="date" value={form.dateOfBirth} onChange={e => setForm(p => ({...p, dateOfBirth: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Place / City</label>
                  <input value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))} placeholder="e.g. Bangalore, Hyderabad" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Address</label>
                  <input value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))} placeholder="Street / Area" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pincode</label>
                  <input value={form.pincode} onChange={e => setForm(p => ({...p, pincode: e.target.value}))} placeholder="560001" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">ID Proof Type</label>
                  <select value={form.idProofType} onChange={e => setForm(p => ({...p, idProofType: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50">
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Government ID">Government ID</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">ID Proof Number</label>
                  <input value={form.idProofNumber} onChange={e => setForm(p => ({...p, idProofNumber: e.target.value}))} placeholder="Enter ID Proof No" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Designation / Role</label>
                <input value={form.designation} onChange={e => setForm(p => ({...p, designation: e.target.value}))} placeholder="e.g. Senior Frontend Instructor" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Current Company</label>
                  <input value={form.company} onChange={e => setForm(p => ({...p, company: e.target.value}))} placeholder="Optional" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Years of Experience</label>
                  <input type="number" min="0" value={form.yearsExperience} onChange={e => setForm(p => ({...p, yearsExperience: parseInt(e.target.value) || 0}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Skills (Comma Separated)</label>
                <input value={form.skills} onChange={e => setForm(p => ({...p, skills: e.target.value}))} placeholder="React, Node.js, System Design" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Short Bio</label>
                <textarea rows={3} value={form.bio} onChange={e => setForm(p => ({...p, bio: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50 resize-none" />
              </div>
            </form>

            <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
              <button disabled={isSubmitting} onClick={() => setIsSlideOverOpen(false)} className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold transition-colors text-slate-700">
                Cancel
              </button>
              <button disabled={isSubmitting} onClick={handleAddEducator} className="flex-[2] py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Educator"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Educator Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl text-slate-900 max-h-[90vh] flex flex-col my-auto space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 shrink-0">
              <h3 className="text-lg font-black text-slate-900">Edit Remote Faculty Details</h3>
              <button onClick={() => setIsEditModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            
            <form onSubmit={handleEditEducator} className="space-y-4 overflow-y-auto custom-scrollbar p-1 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">First Name *</label>
                  <input required value={editForm.firstName} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Last Name *</label>
                  <input required value={editForm.lastName} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Designation / Title</label>
                  <input value={editForm.designation} onChange={e => setEditForm({ ...editForm, designation: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Current Company</label>
                  <input value={editForm.company} onChange={e => setEditForm({ ...editForm, company: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Years of Experience</label>
                  <input type="number" min="0" value={editForm.yearsExperience} onChange={e => setEditForm({ ...editForm, yearsExperience: parseInt(e.target.value) || 0 })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City / Location</label>
                  <input value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date of Birth</label>
                  <input type="date" value={editForm.dateOfBirth} onChange={e => setEditForm({ ...editForm, dateOfBirth: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Address</label>
                  <input value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pincode</label>
                  <input value={editForm.pincode} onChange={e => setEditForm({ ...editForm, pincode: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ID Proof Type</label>
                  <select value={editForm.idProofType} onChange={e => setEditForm({ ...editForm, idProofType: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold">
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Government ID">Government ID</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ID Proof Number</label>
                  <input value={editForm.idProofNumber} onChange={e => setEditForm({ ...editForm, idProofNumber: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Skills (Comma Separated)</label>
                <input value={editForm.skills} onChange={e => setEditForm({ ...editForm, skills: e.target.value })} placeholder="React, Node.js, System Design" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Instructor Bio</label>
                <textarea rows={3} value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium resize-none" />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-xs">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
