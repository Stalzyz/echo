"use client"

import { useState } from "react"
import { 
  Users, Search, Filter, ShieldCheck, UserCheck, GraduationCap, 
  Briefcase, Check, X, ShieldAlert, Eye, Mail, Phone, Building2
} from "lucide-react"
import { toast } from "sonner"

interface UserRecord {
  id: string
  name: string
  email: string
  phone: string
  role: "ACADEMY_ADMIN" | "INSTRUCTOR" | "STUDENT" | "STAFF"
  academy: string
  status: "ACTIVE" | "SUSPENDED"
  createdAt: string
}

export default function PlatformUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/v1/super-admin/users")
      if (res.ok) {
        const json = await res.json()
        setUsers(json.users || [])
      }
    } catch (err) {
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.academy.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const toggleUserStatus = async (id: string, currentStatus: string, name: string) => {
    const nextStatus = currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED"
    try {
      const res = await fetch("/api/v1/super-admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, status: nextStatus })
      })
      if (res.ok) {
        toast.success(`User ${name} status updated to ${nextStatus}`)
        fetchUsers()
      } else {
        toast.error("Failed to update status")
      }
    } catch (err) {
      toast.error("Error updating user status")
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              PLATFORM USER DIRECTORY
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Platform Users Overview</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Cross-tenant user accounts across Academy Admins, Instructors, Students, and Staff.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search name, email, or academy..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="ACADEMY_ADMIN">Academy Admins</option>
            <option value="INSTRUCTOR">Instructors</option>
            <option value="STUDENT">Students</option>
            <option value="STAFF">Staff Members</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">User Name</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Assigned Academy</th>
                <th className="py-4 px-6">Contact</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-slate-900">{u.name}</div>
                    <div className="text-xs text-slate-400 font-mono">ID: {u.id}</div>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                      u.role === "ACADEMY_ADMIN"
                        ? "bg-purple-50 text-purple-800 border-purple-200"
                        : u.role === "INSTRUCTOR"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : u.role === "STUDENT"
                        ? "bg-teal-50 text-teal-800 border-teal-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-semibold text-slate-800">
                    {u.academy}
                  </td>

                  <td className="py-4 px-6">
                    <div className="text-xs text-slate-700 font-medium">{u.email}</div>
                    <div className="text-xs text-slate-400 font-mono">{u.phone}</div>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      u.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                      {u.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedUser(u)}
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Account Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => toggleUserStatus(u.id, u.status, u.name)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg border transition-colors ${
                          u.status === "SUSPENDED"
                            ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700"
                        }`}
                      >
                        {u.status === "SUSPENDED" ? "Activate" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-xl relative text-slate-900">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
              <h3 className="font-black text-lg text-slate-900">Platform Account Overview</h3>
              <button onClick={() => setSelectedUser(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Full Name</span>
                <div className="font-extrabold text-base text-slate-900">{selectedUser.name}</div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Platform Role</span>
                <div className="font-bold text-xs text-teal-700 mt-0.5">{selectedUser.role}</div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Associated Academy</span>
                <div className="font-bold text-xs text-slate-800">{selectedUser.academy}</div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Email Address</span>
                <div className="font-mono text-xs text-slate-800">{selectedUser.email}</div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Phone Number</span>
                <div className="font-mono text-xs text-slate-800">{selectedUser.phone}</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <button onClick={() => setSelectedUser(null)} className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl">
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
