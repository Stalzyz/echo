"use client"

import { Shield, Plus, Lock, Users, ArrowLeft, Loader2, Trash2, Check, Search, UserCheck, UserPlus, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useApi, fetchApi } from "@/lib/useApi"
import { SlideOver } from "@/components/SlideOver"
import { toast } from "sonner"

const SYSTEM_MODULES = [
  "Admissions CRM",
  "Form Builder & Kiosk",
  "Demo Sessions & Live Studio",
  "Campus & Remote Students",
  "Instructors & Faculty",
  "Fee Collection & EMI",
  "Batches & Course Builder",
  "Live Projects & Internships",
  "Placements",
  "Webinars & Funnels",
  "Social Community",
  "WhatsApp Messages",
  "Visual Automations",
  "Global Leaderboard",
  "Quiz & Certificates",
  "Branding & System Settings"
]

export default function RolesPage() {
  const { data, mutate, isLoading } = useApi<any>("/settings/roles")
  const roles = data?.roles || []

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [localPermissions, setLocalPermissions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"PERMISSIONS" | "STAFF">("PERMISSIONS")
  
  // Create Role SlideOver
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDesc, setNewRoleDesc] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingPerms, setIsSavingPerms] = useState(false)

  // Assign Staff SlideOver
  const [isAssignStaffOpen, setIsAssignStaffOpen] = useState(false)
  const [assignableUsers, setAssignableUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null)

  const selectedRole = roles.find((r: any) => r.id === selectedRoleId) || roles[0]

  useEffect(() => {
    if (selectedRole) {
      setLocalPermissions(selectedRole.permissions || [])
      setSelectedRoleId(selectedRole.id)
    }
  }, [selectedRole?.id, roles.length])

  const handleTogglePerm = (mod: string, action: string) => {
    setLocalPermissions(prev => {
      const exists = prev.find(p => p.resource === mod && p.action === action)
      if (exists) {
        return prev.filter(p => !(p.resource === mod && p.action === action))
      }
      return [...prev, { resource: mod, action }]
    })
  }

  const hasPerm = (mod: string, action: string) => {
    return localPermissions.some(p => p.resource === mod && p.action === action)
  }

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/settings/roles", {
        method: "POST",
        body: JSON.stringify({
          name: newRoleName,
          description: newRoleDesc,
          permissions: []
        })
      })
      toast.success("Role created successfully")
      setIsAddOpen(false)
      setNewRoleName("")
      setNewRoleDesc("")
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to create role")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSavePerms = async () => {
    if (!selectedRoleId) return
    setIsSavingPerms(true)
    try {
      await fetchApi(`/settings/roles/${selectedRoleId}`, {
        method: "PATCH",
        body: JSON.stringify({
          permissions: localPermissions.map(p => ({ resource: p.resource, action: p.action }))
        })
      })
      toast.success("Permissions updated successfully")
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to update permissions")
    } finally {
      setIsSavingPerms(false)
    }
  }

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (!confirm(`Are you sure you want to delete role "${roleName}"?\nAny staff assigned to this role will have their custom role reset.`)) return
    try {
      await fetchApi(`/settings/roles/${roleId}`, { method: "DELETE" })
      toast.success(`Role "${roleName}" deleted.`)
      mutate()
      setSelectedRoleId(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to delete role")
    }
  }

  const openAssignModal = async () => {
    setIsAssignStaffOpen(true)
    setLoadingUsers(true)
    try {
      const res = await fetchApi<any>("/settings/roles/assignable-users")
      setAssignableUsers(res?.users || [])
    } catch (err: any) {
      toast.error("Failed to load staff members")
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleAssignUser = async (userId: string) => {
    if (!selectedRole?.id) return
    setAssigningUserId(userId)
    try {
      await fetchApi(`/settings/roles/${selectedRole.id}/assign`, {
        method: "POST",
        body: JSON.stringify({ userId })
      })
      toast.success("Staff assigned to role successfully!")
      mutate()
      // Refresh local assignable users list
      setAssignableUsers(prev => prev.map(u => u.id === userId ? { ...u, customRoleId: selectedRole.id, customRole: { id: selectedRole.id, name: selectedRole.name } } : u))
    } catch (err: any) {
      toast.error(err.message || "Failed to assign staff member")
    } finally {
      setAssigningUserId(null)
    }
  }

  const handleUnassignUser = async (userId: string) => {
    if (!selectedRole?.id) return
    try {
      await fetchApi(`/settings/roles/${selectedRole.id}/unassign`, {
        method: "POST",
        body: JSON.stringify({ userId })
      })
      toast.success("Staff member unassigned from role.")
      mutate()
      setAssignableUsers(prev => prev.map(u => u.id === userId ? { ...u, customRoleId: null, customRole: null } : u))
    } catch (err: any) {
      toast.error(err.message || "Failed to unassign staff member")
    }
  }

  const getUserDisplayName = (u: any) => {
    if (!u) return ""
    const full = `${u.firstName || ''} ${u.lastName || ''}`.trim()
    return full || u.name || u.email || "Staff Member"
  }

  const assignedUsers = selectedRole?.User || []
  const filteredAssignableUsers = assignableUsers.filter(u => {
    const name = getUserDisplayName(u).toLowerCase()
    const email = (u.email || '').toLowerCase()
    const q = userSearch.toLowerCase()
    return name.includes(q) || email.includes(q)
  })

  return (
    <div className="flex flex-col min-h-full bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <div className="flex-none px-6 sm:px-8 py-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/settings" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2 text-slate-900">
              <Shield className="w-5 h-5 text-teal-600" /> Roles & Permissions
            </h1>
            <p className="text-xs text-slate-500 font-medium">Create granular roles and assign them to your academy faculty, counselors, and staff.</p>
          </div>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-700 text-white text-xs font-black rounded-xl hover:bg-teal-800 transition-all shadow-xs">
          <Plus className="w-4 h-4 shrink-0" /> Create Custom Role
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Roles List */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white p-4 sm:p-6 space-y-3 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Academy Roles ({roles.length})</h2>
          </div>
          <div className="space-y-2">
            {isLoading && <div className="p-4 text-xs font-bold text-slate-400">Loading roles...</div>}
            {roles.map((role: any) => {
              const staffCount = role.User?.length || 0
              const isSelected = selectedRoleId === role.id
              return (
                <div 
                  key={role.id} 
                  onClick={() => { setSelectedRoleId(role.id); setActiveTab("PERMISSIONS"); }}
                  className={`border rounded-2xl p-3.5 cursor-pointer transition-all ${isSelected ? 'bg-teal-50 border-teal-500 shadow-xs' : 'bg-slate-50 border-slate-200 hover:border-teal-300'}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-extrabold text-sm text-slate-900">{role.name}</h3>
                    {role.name === 'Super Admin' ? (
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-800 border border-teal-200 rounded-md text-[9px] font-mono font-black">SYSTEM</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-200/70 text-slate-700 rounded-md text-[10px] font-bold">
                        {staffCount} {staffCount === 1 ? 'member' : 'members'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{role.description || "No description provided."}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Editor & Staff Manager */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {selectedRole ? (
            <div className="max-w-4xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              {/* Role Header */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-950">{selectedRole.name}</h2>
                    {selectedRole.name !== "Super Admin" && (
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider">
                        Custom Role
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-medium">{selectedRole.description || "Configure access control and assign staff members to this role."}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={openAssignModal}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Assign Staff
                  </button>
                  {selectedRole.name !== "Super Admin" && (
                    <button 
                      onClick={() => handleDeleteRole(selectedRole.id, selectedRole.name)}
                      className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                      title="Delete Role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-6">
                <button
                  onClick={() => setActiveTab("PERMISSIONS")}
                  className={`py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "PERMISSIONS"
                      ? "border-teal-700 text-teal-900"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" /> Permissions Matrix
                </button>
                <button
                  onClick={() => setActiveTab("STAFF")}
                  className={`py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "STAFF"
                      ? "border-teal-700 text-teal-900"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Assigned Staff ({assignedUsers.length})
                </button>
              </div>

              {/* Tab 1: Permissions Matrix */}
              {activeTab === "PERMISSIONS" && (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-100/70 text-[10px] uppercase tracking-widest text-slate-600">
                          <th className="p-4 font-black">Module / Resource</th>
                          <th className="p-4 text-center font-black">View</th>
                          <th className="p-4 text-center font-black">Create</th>
                          <th className="p-4 text-center font-black">Edit</th>
                          <th className="p-4 text-center font-black">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {SYSTEM_MODULES.map((mod, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-bold text-xs sm:text-sm text-slate-900">{mod}</td>
                            <td className="p-4 text-center">
                              <input type="checkbox" checked={hasPerm(mod, 'VIEW')} onChange={() => handleTogglePerm(mod, 'VIEW')} className="accent-teal-600 w-4 h-4 cursor-pointer" />
                            </td>
                            <td className="p-4 text-center">
                              <input type="checkbox" checked={hasPerm(mod, 'CREATE')} onChange={() => handleTogglePerm(mod, 'CREATE')} className="accent-teal-600 w-4 h-4 cursor-pointer" />
                            </td>
                            <td className="p-4 text-center">
                              <input type="checkbox" checked={hasPerm(mod, 'EDIT')} onChange={() => handleTogglePerm(mod, 'EDIT')} className="accent-teal-600 w-4 h-4 cursor-pointer" />
                            </td>
                            <td className="p-4 text-center">
                              <input type="checkbox" checked={hasPerm(mod, 'DELETE')} onChange={() => handleTogglePerm(mod, 'DELETE')} className="accent-teal-600 w-4 h-4 cursor-pointer" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button onClick={handleSavePerms} disabled={isSavingPerms} className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-black transition-colors disabled:opacity-50 shadow-sm">
                      {isSavingPerms ? "Saving Permissions..." : "Save Permissions"}
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Assigned Staff */}
              {activeTab === "STAFF" && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">Staff Members with &ldquo;{selectedRole.name}&rdquo; Role</h3>
                      <p className="text-xs text-slate-500">These team members inherit all permissions defined in this role matrix.</p>
                    </div>
                    <button
                      onClick={openAssignModal}
                      className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> + Assign Staff
                    </button>
                  </div>

                  {assignedUsers.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-sm text-slate-800">No staff members assigned yet</div>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Click below to select faculty, instructors, or admins from your academy to assign them this role.
                      </p>
                      <button
                        onClick={openAssignModal}
                        className="px-4 py-2 bg-teal-700 text-white text-xs font-black rounded-xl hover:bg-teal-800 transition-colors shadow-xs"
                      >
                        Assign Staff Member
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {assignedUsers.map((u: any) => (
                        <div key={u.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0">
                              {getUserDisplayName(u).charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-sm text-slate-900 truncate">{getUserDisplayName(u)}</div>
                              <div className="text-xs text-slate-500 truncate">{u.email}</div>
                              <div className="text-[10px] font-mono text-teal-700 font-bold uppercase tracking-wider">{u.role}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnassignUser(u.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                            title="Remove role from this staff member"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">Select a role on the left to view permissions and staff.</div>
          )}
        </div>
      </div>

      {/* SlideOver: Create Role */}
      <SlideOver
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create Custom Role"
        subtitle="Define a new role and configure its permissions matrix."
      >
        <form onSubmit={handleCreateRole} className="space-y-5 text-slate-900">
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">Role Name *</label>
            <input 
              required
              value={newRoleName}
              onChange={e => setNewRoleName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 placeholder:text-slate-400 font-medium"
              placeholder="e.g. Admissions Counselor, Lead Faculty, Branch Manager"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">Description</label>
            <textarea 
              value={newRoleDesc}
              onChange={e => setNewRoleDesc(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 placeholder:text-slate-400 min-h-[100px] font-medium"
              placeholder="e.g. Manages admissions CRM, form submissions, and student demo sessions."
            />
          </div>
          <div className="pt-4 mt-6 border-t border-slate-200">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-teal-700 text-white font-black text-sm rounded-xl hover:bg-teal-800 transition-all disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? "Creating Role..." : "Create Role"}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* SlideOver: Assign Staff to Role */}
      <SlideOver
        open={isAssignStaffOpen}
        onClose={() => setIsAssignStaffOpen(false)}
        title={`Assign Staff: ${selectedRole?.name || 'Role'}`}
        subtitle="Choose team members from your academy directory to assign this role."
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {loadingUsers ? (
              <div className="p-8 text-center text-slate-400 text-xs font-bold flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-teal-700" />
                Loading staff directory...
              </div>
            ) : filteredAssignableUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium">No matching staff found.</div>
            ) : (
              filteredAssignableUsers.map((u: any) => {
                const isAssigned = u.customRoleId === selectedRole?.id
                return (
                  <div key={u.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-slate-900 truncate">{getUserDisplayName(u)}</div>
                      <div className="text-[11px] text-slate-500 truncate">{u.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="font-bold text-teal-700">{u.role}</span>
                        {u.customRole && (
                          <span>· Current: {u.customRole.name}</span>
                        )}
                      </div>
                    </div>
                    {isAssigned ? (
                      <button
                        onClick={() => handleUnassignUser(u.id)}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Assigned
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAssignUser(u.id)}
                        disabled={assigningUserId === u.id}
                        className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 shadow-xs"
                      >
                        {assigningUserId === u.id ? "Assigning..." : "Assign"}
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </SlideOver>
    </div>
  )
}
