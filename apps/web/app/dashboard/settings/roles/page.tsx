"use client"

import { Shield, Plus, Lock, Users, ArrowLeft, Loader2 } from  "lucide-react"
import Link from "next/link"
import { useState, useEffect } from  "react"
import { useApi, fetchApi } from  "@/lib/useApi"
import { SlideOver } from  "@/components/SlideOver"
import { toast } from  "sonner"

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
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDesc, setNewRoleDesc] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingPerms, setIsSavingPerms] = useState(false)

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

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex-none px-8 py-6 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
              <Shield className="w-5 h-5 text-teal-600" /> Roles & Permissions
            </h1>
          </div>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left List */}
        <div className="w-1/3 border-r border-slate-200 bg-white p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Active Roles</h2>
          <div className="space-y-3">
            {isLoading && <div className="p-4 text-slate-400">Loading roles...</div>}
            {roles.map((role: any) => (
              <div 
                key={role.id} 
                onClick={() => setSelectedRoleId(role.id)}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedRoleId === role.id ? 'bg-teal-50 border-teal-500 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-teal-300'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900">{role.name}</h3>
                  {role.name === 'Super Admin' && (
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 border border-teal-200 rounded text-[10px] font-mono font-bold">SYSTEM</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-3">{role.description}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <Users className="w-3 h-3" /> Custom Role
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Editor */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50">
          <div className="max-w-3xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit Permissions: {selectedRole?.name}</h2>
                <p className="text-xs text-slate-500 mt-1">Configure what users with this role can view or modify.</p>
              </div>
              <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg">
                <Lock className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-[10px] uppercase tracking-widest text-slate-500">
                    <th className="p-4 font-bold">Module / Resource</th>
                    <th className="p-4 text-center font-bold">View</th>
                    <th className="p-4 text-center font-bold">Create</th>
                    <th className="p-4 text-center font-bold">Edit</th>
                    <th className="p-4 text-center font-bold">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SYSTEM_MODULES.map((mod, i) => {
                    return (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-sm text-slate-900">{mod}</td>
                        <td className="p-4 text-center">
                          <input type="checkbox" checked={hasPerm(mod, 'VIEW')} onChange={() => handleTogglePerm(mod, 'VIEW')} className="accent-teal-600 w-4 h-4" />
                        </td>
                        <td className="p-4 text-center">
                          <input type="checkbox" checked={hasPerm(mod, 'CREATE')} onChange={() => handleTogglePerm(mod, 'CREATE')} className="accent-teal-600 w-4 h-4" />
                        </td>
                        <td className="p-4 text-center">
                          <input type="checkbox" checked={hasPerm(mod, 'EDIT')} onChange={() => handleTogglePerm(mod, 'EDIT')} className="accent-teal-600 w-4 h-4" />
                        </td>
                        <td className="p-4 text-center">
                          <input type="checkbox" checked={hasPerm(mod, 'DELETE')} onChange={() => handleTogglePerm(mod, 'DELETE')} className="accent-teal-600 w-4 h-4" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button onClick={handleSavePerms} disabled={isSavingPerms} className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 shadow-sm">
                {isSavingPerms ? "Saving..." : "Save Permissions"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <SlideOver
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create Custom Role"
        subtitle="Define a new role and configure its permissions later."
      >
        <form onSubmit={handleCreateRole} className="space-y-5 text-slate-900">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role Name *</label>
            <input 
              required
              value={newRoleName}
              onChange={e => setNewRoleName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
              placeholder="e.g. Sales Executive"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
            <textarea 
              value={newRoleDesc}
              onChange={e => setNewRoleDesc(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 text-slate-900 placeholder:text-slate-400 min-h-[100px]"
              placeholder="Access to CRM, Leads, and Proposals only."
            />
          </div>
          <div className="pt-4 mt-6 border-t border-slate-200">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? "Creating..." : "Create Role"}
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  )
}
