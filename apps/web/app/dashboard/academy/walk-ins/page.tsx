"use client"

import { useApi, fetchApi } from  "@/lib/useApi"
import { useOrganization } from  "@/context/OrganizationContext"
import { Users, Phone, MessageSquare, ArrowRight, Bot, Loader2 } from  "lucide-react"
import { useState } from  "react"
import { toast } from  "sonner"
import { formatDistanceToNow } from  "date-fns"

export default function WalkInsAdmin() {
  const org = useOrganization()
  const { data: stats } = useApi<any>("/academy/walk-ins/stats")
  const { data: walkIns, mutate, isLoading } = useApi<any[]>("/academy/walk-ins")
  
  const [selectedWalkIn, setSelectedWalkIn] = useState<any>(null)
  const [notes, setNotes] = useState("")
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)

  const [pitchWalkIn, setPitchWalkIn] = useState<any>(null)
  const [pitches, setPitches] = useState<string[]>([])
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false)

  const generatePitch = async (w: any) => {
    setPitchWalkIn(w)
    setPitches([])
    setIsGeneratingPitch(true)
    try {
      const data = await fetchApi(`/academy/walk-ins/${w.id}/generate-pitch`, { method: "POST" }) as any
      setPitches(data.pitches || [])
    } catch (err: any) {
      toast.error(err.message || "Failed to generate pitch")
      setPitchWalkIn(null)
    } finally {
      setIsGeneratingPitch(false)
    }
  }

  const openWhatsApp = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    const encodedText = encodeURIComponent(text)
    window.open(`whatsapp://send?phone=${cleanPhone}&text=${encodedText}`, '_blank')
    toast.success("Opening WhatsApp...")
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetchApi(`/academy/walk-ins/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      })
      toast.success(`Moved to ${status}`)
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to update status")
    }
  }

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWalkIn || !notes.trim()) return
    try {
      await fetchApi(`/academy/walk-ins/${selectedWalkIn.id}`, {
        method: "PATCH",
        body: JSON.stringify({ notes: `${selectedWalkIn.notes || ''}\n[${new Date().toLocaleDateString()}] ${notes}` })
      })
      toast.success("Note added")
      setNotes("")
      setSelectedWalkIn(null)
      mutate()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-teal-600" /> Walk-In Tracker
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage campus visitors, demo requests, and walk-in leads for {org?.name || 'your academy'}.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsQRModalOpen(true)} className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-5 py-2.5 rounded-xl transition-colors font-bold text-sm shadow-xs">
            Show QR Code
          </button>
          <a href="/kiosk" target="_blank" className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-5 py-2.5 rounded-xl transition-colors font-bold text-sm shadow-xs">
            <ArrowRight className="w-4 h-4 text-slate-500" /> Open Kiosk Mode
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Today's Walk-ins</h3>
          <div className="text-3xl font-black text-slate-900">{stats?.todayCount || 0}</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">New Leads</h3>
          <div className="text-3xl font-black text-slate-900">{stats?.totalNew || 0}</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h3 className="text-xs font-black text-teal-700 uppercase tracking-wider mb-2">Total Converted</h3>
          <div className="text-3xl font-black text-slate-900">{stats?.totalConverted || 0}</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Conversion Rate</h3>
          <div className="text-3xl font-black text-slate-900">{stats?.conversionRate || 0}%</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="p-4">Visitor Info</th>
              <th className="p-4">Visit Details</th>
              <th className="p-4">Timing</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium">Loading walk-ins...</td></tr>}
            {(walkIns || []).length === 0 && !isLoading && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No walk-ins recorded yet.</td></tr>
            )}
            {(walkIns || []).map((w: any) => (
              <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-extrabold text-slate-900 text-base">{w.name}</div>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {w.phone}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">{w.type}</span>
                    {w.interestArea}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 uppercase font-medium">Source: {w.source}</div>
                </td>
                <td className="p-4">
                  <div className="text-xs font-bold text-slate-800">{formatDistanceToNow(new Date(w.createdAt), { addSuffix: true })}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{new Date(w.createdAt).toLocaleTimeString()}</div>
                </td>
                <td className="p-4">
                  <select 
                    className={`text-xs font-extrabold px-3 py-1.5 rounded-lg border appearance-none cursor-pointer outline-none transition-colors
                      ${w.status === 'NEW' ? 'bg-teal-50 text-teal-800 border-teal-200' : 
                        w.status === 'COUNSELLING' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        w.status === 'CONVERTED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'}`}
                    value={w.status}
                    onChange={(e) => updateStatus(w.id, e.target.value)}
                  >
                    <option value="NEW">New Walk-In</option>
                    <option value="COUNSELLING">In Counselling</option>
                    <option value="DEMO_SCHEDULED">Demo Scheduled</option>
                    <option value="FOLLOW_UP">Follow Up Required</option>
                    <option value="CONVERTED">Converted to Admission</option>
                    <option value="COLD">Cold / No Response</option>
                    <option value="LOST">Lost</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setSelectedWalkIn(w)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> Notes
                    </button>
                    <button onClick={() => generatePitch(w)} className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-teal-600" /> AI Pitch
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedWalkIn && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-900">
            <h2 className="text-xl font-black mb-1 text-slate-900">Visitor Notes</h2>
            <p className="text-slate-500 text-xs font-medium mb-4">Tracking history for {selectedWalkIn.name}</p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 min-h-[100px] max-h-[200px] overflow-y-auto whitespace-pre-wrap text-xs text-slate-700 font-medium">
              {selectedWalkIn.notes || "No notes yet. Add one below."}
            </div>

            <form onSubmit={addNote} className="space-y-4">
              <textarea 
                required 
                placeholder="Add a new note or interaction..." 
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelectedWalkIn(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors text-slate-700">Close</button>
                <button type="submit" className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors shadow-xs">Add Note</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pitchWalkIn && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl flex flex-col max-h-[90vh] text-slate-900">
            <h2 className="text-xl font-black mb-1 flex items-center gap-2 text-teal-700">
              <Bot className="w-6 h-6" /> Tailored Pitch Generator
            </h2>
            <p className="text-slate-500 text-xs font-medium mb-6">Generated personalized communication options for {pitchWalkIn.name}.</p>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
              {isGeneratingPitch && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 font-medium">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-teal-600" />
                  <div>Crafting communication pitch...</div>
                </div>
              )}
              
              {!isGeneratingPitch && pitches.map((pitch, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-teal-300 transition-colors">
                  <div className="text-[10px] font-extrabold tracking-wider text-teal-700 uppercase mb-2">Option {idx + 1}</div>
                  <div className="text-sm whitespace-pre-wrap text-slate-800 leading-relaxed mb-4 font-medium">{pitch}</div>
                  <button onClick={() => openWhatsApp(pitchWalkIn.phone, pitch)} className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors text-sm flex justify-center items-center gap-2 shadow-xs">
                    <MessageSquare className="w-4 h-4" /> Send on WhatsApp
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 mt-auto">
              <button type="button" onClick={() => setPitchWalkIn(null)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors text-slate-700">Close</button>
            </div>
          </div>
        </div>
      )}

      {isQRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-8 flex flex-col items-center relative shadow-2xl text-slate-900">
            <h2 className="text-xl font-black text-slate-900 mb-1 text-center">Kiosk QR Code</h2>
            <p className="text-xs text-slate-500 font-medium text-center mb-6">
              Visitors can scan this code to register on their phone.
            </p>
            
            <div className="p-4 bg-white border border-slate-200 rounded-xl mb-6 shadow-xs">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent((typeof window !== 'undefined' ? window.location.origin : 'https://academy.echolms.com') + '/kiosk')}`}
                alt="Kiosk QR Code" 
                className="w-48 h-48"
              />
            </div>
            
            <button 
              onClick={() => setIsQRModalOpen(false)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold uppercase text-xs py-3 rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
