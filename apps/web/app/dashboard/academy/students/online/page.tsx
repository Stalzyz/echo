"use client"

import { useState } from "react"
import { Search, Plus, GraduationCap, Mail, Phone, BookOpen, Fingerprint, X, Printer, LayoutGrid, List as ListIcon, ShieldCheck, Edit3, Trash2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useApi, fetchApi } from "@/lib/useApi"
import Link from "next/link"
import { toast } from "sonner"

export default function StudentDirectory() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("ALL")
  const [viewMode, setViewMode] = useState<"GRID"|"LIST">("GRID")
  
  const [activeStudent, setActiveStudent] = useState<any>(null)
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [enrollForm, setEnrollForm] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "", 
    dateOfBirth: "", 
    city: "", 
    address: "", 
    pincode: "", 
    idProofType: "Aadhaar Card", 
    idProofNumber: "", 
    batchId: "" 
  })

  const [editForm, setEditForm] = useState({ 
    id: "", 
    firstName: "", 
    lastName: "", 
    phone: "", 
    batchId: "", 
    city: "", 
    address: "" 
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { data: studentsData, mutate: refreshStudents } = useApi<any>("/academy/students?deliveryMode=ONLINE")
  const { data: batchesData } = useApi<any>("/academy/batches")
  const students = studentsData?.data || []
  const batches = batchesData?.data || []

  const mappedStudents = students.map((s: any) => ({
    id: s.id,
    userId: s.userId,
    code: s.studentCode,
    name: `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.trim(),
    firstName: s.user?.firstName || '',
    lastName: s.user?.lastName || '',
    email: s.user?.email || '',
    phone: s.user?.phone || 'N/A',
    city: s.city || 'N/A',
    address: s.address || '',
    pincode: s.pincode || '',
    idProofType: s.idProofType || '',
    idProofNumber: s.idProofNumber || '',
    batch: s.enrollments?.[0]?.batch?.name || 'Unassigned',
    batchId: s.enrollments?.[0]?.batchId || '',
    status: s.isAlumni ? 'ALUMNI' : 'ENROLLED'
  }))

  const filtered = mappedStudents.filter((s: any) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "ALL" || s.status === filter
    return matchSearch && matchFilter
  })

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/academy/students", {
        method: "POST",
        body: JSON.stringify({ ...enrollForm, deliveryMode: "ONLINE" })
      })
      toast.success("Remote student enrolled successfully!")
      setIsEnrollModalOpen(false)
      setEnrollForm({ 
        firstName: "", 
        lastName: "", 
        email: "", 
        phone: "", 
        dateOfBirth: "", 
        city: "", 
        address: "", 
        pincode: "", 
        idProofType: "Aadhaar Card", 
        idProofNumber: "", 
        batchId: "" 
      })
      refreshStudents()
    } catch (err: any) {
      toast.error(err.message || "Error enrolling student")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi(`/academy/students/${editForm.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          phone: editForm.phone,
          city: editForm.city,
          address: editForm.address,
          batchId: editForm.batchId || undefined
        })
      })
      toast.success("Student updated successfully!")
      setIsEditModalOpen(false)
      refreshStudents()
    } catch (err: any) {
      toast.error(err.message || "Error updating student")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to remove remote student ${studentName}?`)) {
      return
    }
    try {
      await fetchApi(`/academy/students/${studentId}`, {
        method: "DELETE"
      })
      toast.success(`Student ${studentName} deleted successfully`)
      refreshStudents()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete student")
    }
  }

  const openEditModal = (student: any) => {
    setEditForm({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone !== 'N/A' ? student.phone : '',
      city: student.city !== 'N/A' ? student.city : '',
      address: student.address || '',
      batchId: student.batchId || ''
    })
    setIsEditModalOpen(true)
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-slate-50 text-slate-900 relative">
      
      {/* Header */}
      <div className="flex-none px-8 py-6 border-b border-slate-200 bg-white relative z-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Remote Students</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">Manage and edit all active online virtual learning enrollments</p>
            </div>
          </div>
          <button onClick={() => setIsEnrollModalOpen(true)} className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-xs">
            <Plus className="w-4 h-4" /> Enroll Student
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {["ALL", "ENROLLED", "ALUMNI"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${
                  filter === f
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or code..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setViewMode("GRID")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'GRID' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("LIST")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'LIST' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative z-10">
        {viewMode === "GRID" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
            {filtered.map((student: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                key={student.id} 
                onClick={() => setActiveStudent(student)}
                className="cursor-pointer group bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-4 items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex-none flex items-center justify-center text-lg font-black text-teal-800">
                      {student.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="text-base font-extrabold text-slate-900 truncate group-hover:text-teal-700 transition-colors">{student.name}</h3>
                      <p className="text-[10px] font-mono font-bold uppercase text-slate-400 mt-0.5 flex items-center gap-1">
                        <Fingerprint className="w-3 h-3 text-slate-300" /> {student.code}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{student.batch}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{student.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                    student.status === 'ENROLLED' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {student.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditModal(student); }}
                      className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg border border-slate-200 transition-colors"
                      title="Edit Student"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteStudent(student.id, student.name); }}
                      className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                      title="Delete Student"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Link href={`/dashboard/academy/students/${student.id}/passport`}
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-lg transition-colors">
                      <ShieldCheck className="w-3.5 h-3.5" /> Passport
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-extrabold text-[11px] tracking-wider uppercase">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Batch</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((student: any) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setActiveStudent(student)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center font-black text-xs text-teal-800">
                          {student.name.charAt(0)}
                        </div>
                        <span className="text-sm font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-500">{student.code}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs font-medium text-slate-600">
                        <span>{student.email}</span>
                        <span className="text-slate-400">{student.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{student.batch}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border inline-flex items-center gap-1.5 ${
                        student.status === 'ENROLLED' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(student); }}
                        className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-teal-600" /> Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteStudent(student.id, student.name); }}
                        className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete
                      </button>
                      <Link href={`/dashboard/academy/students/${student.id}/passport`} onClick={e => e.stopPropagation()} className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1 rounded-lg transition-colors">
                        Passport
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-900">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
              <h3 className="text-lg font-black text-slate-900">Edit Remote Student</h3>
              <button onClick={() => setIsEditModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">First Name</label>
                  <input required value={editForm.firstName} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Last Name</label>
                  <input required value={editForm.lastName} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City / Location</label>
                  <input value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assign Batch</label>
                <select value={editForm.batchId} onChange={e => setEditForm({ ...editForm, batchId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold">
                  <option value="">Select Batch...</option>
                  {batches.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-900 max-h-[90vh] flex flex-col my-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4 shrink-0">
              <div>
                <h3 className="text-lg font-black text-slate-900">Enroll Remote Student</h3>
                <p className="text-xs text-slate-500 font-medium">Add online remote student profile with verified ID proof</p>
              </div>
              <button onClick={() => setIsEnrollModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEnrollSubmit} className="space-y-4 overflow-y-auto p-1 custom-scrollbar flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">First Name *</label>
                  <input required value={enrollForm.firstName} onChange={e => setEnrollForm({...enrollForm, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Last Name *</label>
                  <input required value={enrollForm.lastName} onChange={e => setEnrollForm({...enrollForm, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Email *</label>
                  <input required type="email" value={enrollForm.email} onChange={e => setEnrollForm({...enrollForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Phone Number</label>
                  <input value={enrollForm.phone} onChange={e => setEnrollForm({...enrollForm, phone: e.target.value})} placeholder="+91 9876543210" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Date of Birth</label>
                  <input type="date" value={enrollForm.dateOfBirth} onChange={e => setEnrollForm({...enrollForm, dateOfBirth: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Place / City</label>
                  <input value={enrollForm.city} onChange={e => setEnrollForm({...enrollForm, city: e.target.value})} placeholder="e.g. Bangalore, Mumbai" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Full Address</label>
                  <input value={enrollForm.address} onChange={e => setEnrollForm({...enrollForm, address: e.target.value})} placeholder="Door No, Street Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Pincode</label>
                  <input value={enrollForm.pincode} onChange={e => setEnrollForm({...enrollForm, pincode: e.target.value})} placeholder="560001" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">ID Proof Type</label>
                  <select value={enrollForm.idProofType} onChange={e => setEnrollForm({...enrollForm, idProofType: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50">
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Student ID">Student ID</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">ID Proof Number</label>
                  <input value={enrollForm.idProofNumber} onChange={e => setEnrollForm({...enrollForm, idProofNumber: e.target.value})} placeholder="Enter ID Proof No" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Assign Batch (Optional)</label>
                <select value={enrollForm.batchId} onChange={e => setEnrollForm({...enrollForm, batchId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50">
                  <option value="">Select a batch...</option>
                  {batches.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsEnrollModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-xs">
                  {isSubmitting ? "Enrolling..." : "Enroll Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
