"use client"

import { useState } from "react"
import { useApi } from "@/lib/useApi"
import { toast } from "sonner"
import { Loader2, X, Search, Filter, ChevronDown, GraduationCap, Download, Mail } from "lucide-react"

export default function MyStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: studentsData, isLoading } = useApi<any>("/academy/students")
  const rawStudents = studentsData?.data || []

  const students = rawStudents.map((s: any) => ({
    id: s.id,
    name: `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.trim() || 'Student',
    email: s.user?.email || '',
    course: s.enrollments?.[0]?.batch?.course?.name || 'Onsite Batch',
    progress: Math.min(s.xp || 50, 100),
    lastActive: s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : 'Recently',
    status: s.isAlumni ? 'Completed' : 'Active'
  }))

  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [messageText, setMessageText] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(`Message sent to ${selectedStudent ? selectedStudent.name : 'all students'}!`)
    setSelectedStudent(null)
    setMessageText("")
  }

  const handleExportCSV = () => {
    if (!students || students.length === 0) return;
    const headers = ["Name", "Email", "Course", "Progress", "Last Active", "Status"];
    const rows = students.map((s: any) => [s.name, s.email, s.course, s.progress, s.lastActive, s.status]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r: any) => r.map((c: any) => `"${c}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported successfully!");
  }

  return (
    <div className="flex-1 overflow-y-auto h-full bg-slate-50 text-slate-900">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Students</h1>
            <p className="text-slate-500 mt-1">Manage and track your students across all courses.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button onClick={handleExportCSV} className="flex-1 md:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 text-slate-700 shadow-sm">
              <Download className="w-4 h-4 text-slate-500" />
              Export CSV
            </button>
            <button className="flex-1 md:flex-none px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
              <Mail className="w-4 h-4" />
              Message All
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students by name or email..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shrink-0 text-slate-700 shadow-sm">
            <Filter className="w-4 h-4 text-slate-500" />
            Filters
            <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
          </button>
        </div>

        {/* Students Table */}
        {isLoading ? (
          <div className="text-slate-400 py-8 text-center">Loading students...</div>
        ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Enrolled Course</th>
                  <th className="px-6 py-4">Progress / XP</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students
                  .filter((s: any) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((student: any) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                          <span className="font-bold text-teal-700">{student.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{student.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        <span>{student.course}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-full max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className="h-full rounded-full bg-teal-600" 
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-slate-500 text-xs w-8">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{student.lastActive}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                        student.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        student.status === 'Completed' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors font-bold text-xs"
                      >
                        Action / Message
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

      {/* Message Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white border-l border-slate-200 w-full max-w-md h-full p-6 overflow-y-auto flex flex-col shadow-xl text-slate-900">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h2>
                <p className="text-xs text-slate-500">{selectedStudent.email}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>
            <form onSubmit={handleSendMessage} className="space-y-4 flex-1">
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-2">Message Content</label>
                <textarea rows={4} required value={messageText} onChange={e => setMessageText(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:border-teal-500 outline-none resize-none" placeholder="Type notification..." />
              </div>
              <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors shadow-sm">Send Message</button>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  )
}
