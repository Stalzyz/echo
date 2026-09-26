"use client"

import { useState, useEffect, useCallback } from  "react"
import { useSearchParams } from "next/navigation"
import { Plug, Workflow, Video, Mail, CreditCard, Save, CheckCircle2, Webhook, Plus, Trash2, Loader2, Eye, EyeOff, X, KeyRound, Send, Copy, AlertCircle, RefreshCw } from  "lucide-react"

type Service = "RAZORPAY" | "PHONEPE" | "STRIPE" | "SMTP" | "WHATSAPP" | "META" | "FIREBASE" | "GOOGLE" | "ZOOM"

interface IntegrationKey {
  id: string
  service: Service
  keyName: string
  encryptedValue: string // masked from server
  isActive: boolean
  updatedAt: string
}

interface WebhookEndpoint {
  id: string
  name: string
  url: string
  events: string[]
  secret: string
  isActive: boolean
  createdAt: string
}

const SERVICE_META: Record<Service, { label: string; icon: any; color: string; bg: string; border: string; desc: string }> = {
  RAZORPAY:  { label: "Razorpay",  icon: CreditCard, color: "text-indigo-400", bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  desc: "Payment gateway for Invoices & SaaS" },
  PHONEPE:   { label: "PhonePe",   icon: CreditCard, color: "text-violet-400", bg: "bg-violet-500/10",  border: "border-violet-500/20",  desc: "UPI payment collection" },
  STRIPE:    { label: "Stripe",    icon: CreditCard, color: "text-blue-400",   bg: "bg-blue-500/10",    border: "border-blue-500/20",    desc: "International card payments" },
  SMTP:      { label: "SMTP",      icon: Mail,       color: "text-cyan-400",   bg: "bg-cyan-500/10",    border: "border-cyan-500/20",    desc: "Transactional email delivery" },
  WHATSAPP:  { label: "WhatsApp",  icon: Workflow,        color: "text-emerald-400",bg: "bg-emerald-500/10", border: "border-emerald-500/20", desc: "WhatsApp Business API & Grafty Autopilot" },
  META:      { label: "Meta Leads & Ads", icon: Workflow,  color: "text-blue-500",   bg: "bg-blue-500/10",    border: "border-blue-500/20",    desc: "Facebook & Instagram Lead Ads Auto-Sync" },
  FIREBASE:  { label: "Firebase SMS & Auth", icon: KeyRound, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", desc: "Firebase Phone Auth SMS OTP & OAuth Provider" },
  GOOGLE:    { label: "Google",    icon: Video,      color: "text-red-400",    bg: "bg-red-500/10",     border: "border-red-500/20",     desc: "OAuth, Meet & Calendar integrations" },
  ZOOM:      { label: "Zoom",      icon: Video,      color: "text-sky-400",    bg: "bg-sky-500/10",     border: "border-sky-500/20",     desc: "Zoom Meetings & Webinars OAuth API" },
}

const SERVICES: Service[] = ["RAZORPAY", "PHONEPE", "STRIPE", "SMTP", "WHATSAPP", "META", "FIREBASE", "GOOGLE", "ZOOM"]

const AVAILABLE_EVENTS = [
  { id: "crm.lead_created", label: "New Lead Created (CRM)", desc: "Triggers when a lead is added via manual entry, Meta ads, or webform" },
  { id: "crm.lead_updated", label: "Lead Updated (CRM)", desc: "Triggers when lead details or pipeline stage changes" },
  { id: "crm.lead_won", label: "Lead Won / Closed", desc: "Triggers when a lead status moves to WON" },
  { id: "enquiry.received", label: "Public Enquiry Received", desc: "Triggers when someone submits an enquiry form on the website" },
  { id: "finance.invoice_paid", label: "Invoice Paid", desc: "Triggers when an invoice status changes to PAID" },
  { id: "lms.student_enrolled", label: "Student Enrolled", desc: "Triggers when a student enrolls in a course" },
]

const API = process.env.NEXT_PUBLIC_API_URL || "/api/v1"

async function apiGet(path: string) {
  const r = await fetch(`${API}${path}`, { credentials: "include" })
  if (!r.ok) throw new Error(`API ${r.status}`)
  return r.json()
}

async function apiPost(path: string, body: any) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    const errData = await r.json().catch(() => ({}))
    throw new Error(errData.error || `API ${r.status}`)
  }
  return r.json()
}

async function apiDelete(path: string) {
  const r = await fetch(`${API}${path}`, { method: "DELETE", credentials: "include" })
  if (!r.ok && r.status !== 204) throw new Error(`API ${r.status}`)
}

export default function IntegrationsDashboard() {
  const searchParams               = useSearchParams()
  const [activeTab, setActiveTab]   = useState<"api" | "webhooks">("api")
  const [keys, setKeys]             = useState<IntegrationKey[]>([])
  const [webhooks, setWebhooks]     = useState<WebhookEndpoint[]>([])
  const [loading, setLoading]       = useState(true)
  const [loadingWebhooks, setLoadingWebhooks] = useState(false)
  const [showAdd, setShowAdd]       = useState(false)
  const [showAddWebhook, setShowAddWebhook] = useState(false)
  const [saving, setSaving]         = useState(false)
  const [savingWebhook, setSavingWebhook] = useState(false)
  const [testingWa, setTestingWa]   = useState(false)
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null)

  const [showValues, setShowValues] = useState<Record<string, boolean>>({})
  const [showWebhookSecret, setShowWebhookSecret] = useState<Record<string, boolean>>({})

  const [selectedService, setSelectedService] = useState<Service>("RAZORPAY")
  const [formValues, setFormValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const tabParam = searchParams.get("tab")?.toUpperCase()
    const serviceParam = searchParams.get("service")?.toUpperCase()
    const targetService = serviceParam || tabParam
    if (targetService === "META" || targetService === "GOOGLE" || targetService === "WHATSAPP" || targetService === "RAZORPAY" || targetService === "SMTP") {
      setSelectedService(targetService as Service)
      setShowAdd(true)
    }
  }, [searchParams])
  
  // Custom Webhook form state
  const [webhookForm, setWebhookForm] = useState({
    name: "",
    url: "",
    events: ["crm.lead_created"],
    secret: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [waTestResult, setWaTestResult] = useState<any>(null)
  const [webhookTestResult, setWebhookTestResult] = useState<Record<string, any>>({})
  const [copiedText, setCopiedText] = useState("")

  const KEY_SUGGESTIONS: Record<Service, string[]> = {
    SMTP: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"],
    WHATSAPP: ["META_ACCESS_TOKEN", "META_PHONE_NUMBER_ID", "META_WABA_ID", "GRAFTY_API_KEY", "GRAFTY_INSTANCE_ID", "WEBHOOK_VERIFY_TOKEN"],
    META: ["META_ACCESS_TOKEN", "META_PHONE_NUMBER_ID", "META_WABA_ID", "META_APP_SECRET", "META_VERIFY_TOKEN"],
    FIREBASE: ["NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "NEXT_PUBLIC_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "NEXT_PUBLIC_FIREBASE_APP_ID"],
    RAZORPAY: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"],
    PHONEPE: ["PHONEPE_MERCHANT_ID", "PHONEPE_SALT_KEY", "PHONEPE_SALT_INDEX"],
    STRIPE: ["STRIPE_PUBLISHABLE_KEY", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    GOOGLE: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI"],
    ZOOM: ["ZOOM_ACCOUNT_ID", "ZOOM_CLIENT_ID", "ZOOM_CLIENT_SECRET", "ZOOM_SDK_KEY", "ZOOM_SDK_SECRET"],
  }

  const loadKeys = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiGet("/settings/integrations")
      setKeys(data)
    } catch { setKeys([]) }
    finally { setLoading(false) }
  }, [])

  const loadWebhooks = useCallback(async () => {
    setLoadingWebhooks(true)
    try {
      const data = await apiGet("/settings/webhooks")
      setWebhooks(data)
    } catch { setWebhooks([]) }
    finally { setLoadingWebhooks(false) }
  }, [])

  useEffect(() => {
    loadKeys()
    loadWebhooks()
  }, [loadKeys, loadWebhooks])

  async function handleSaveKey() {
    const keysToSave = Object.entries(formValues).filter(([k, v]) => v.trim() !== "")
    if (keysToSave.length === 0) {
      setError("Please fill in at least one value.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await Promise.all(
        keysToSave.map(([keyName, value]) => 
          apiPost("/settings/integrations", { service: selectedService, keyName, value: value.trim() })
        )
      )
      setSuccess("Integration keys saved successfully!")
      setShowAdd(false)
      setSelectedService("RAZORPAY")
      setFormValues({})
      await loadKeys()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save keys. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteKey(id: string) {
    if (!confirm("Delete this integration key? This cannot be undone.")) return
    try {
      await apiDelete(`/settings/integrations/${id}`)
      setKeys(prev => prev.filter(k => k.id !== id))
    } catch { setError("Failed to delete key.") }
  }

  async function handleSaveWebhook() {
    if (!webhookForm.url || !webhookForm.url.startsWith("http")) {
      setError("Please enter a valid HTTP or HTTPS endpoint URL.")
      return
    }
    if (webhookForm.events.length === 0) {
      setError("Please select at least one trigger event.")
      return
    }

    setSavingWebhook(true)
    setError("")
    try {
      await apiPost("/settings/webhooks", webhookForm)
      setSuccess("Custom webhook endpoint saved successfully!")
      setShowAddWebhook(false)
      setWebhookForm({ name: "", url: "", events: ["crm.lead_created"], secret: "" })
      await loadWebhooks()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save webhook endpoint.")
    } finally {
      setSavingWebhook(false)
    }
  }

  async function handleDeleteWebhook(id: string) {
    if (!confirm("Remove this webhook endpoint subscription?")) return
    try {
      await apiDelete(`/settings/webhooks/${id}`)
      setWebhooks(prev => prev.filter(w => w.id !== id))
    } catch { setError("Failed to remove webhook endpoint.") }
  }

  async function handleTestWebhook(id: string) {
    setTestingWebhookId(id)
    setError("")
    try {
      const res = await apiPost(`/settings/webhooks/${id}/test`, {})
      setWebhookTestResult(prev => ({ ...prev, [id]: res }))
    } catch (err: any) {
      setWebhookTestResult(prev => ({ ...prev, [id]: { success: false, error: err.message } }))
    } finally {
      setTestingWebhookId(null)
    }
  }

  async function handleTestWhatsApp() {
    setTestingWa(true)
    setWaTestResult(null)
    try {
      const res = await apiPost("/settings/integrations/whatsapp/test", {})
      setWaTestResult(res)
    } catch (err: any) {
      setWaTestResult({ error: err.message })
    } finally {
      setTestingWa(false)
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(""), 2500)
  }

  // Group keys by service
  const grouped = SERVICES.reduce<Record<Service, IntegrationKey[]>>((acc, s) => {
    acc[s] = keys.filter(k => k.service === s)
    return acc
  }, {} as any)

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-none px-6 py-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-primary" /> Integrations Hub
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage Meta Lead Ads, WhatsApp API, Payment Gateways & Custom Event Webhooks. All API secrets are AES-256 encrypted.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "api" ? (
              <button
                id="add-integration-btn"
                onClick={() => { setShowAdd(true); setError("") }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Key
              </button>
            ) : (
              <button
                id="add-webhook-btn"
                onClick={() => { setShowAddWebhook(true); setError("") }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Webhook Endpoint
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {success && (
        <div className="mx-6 mt-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-2.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
        </div>
      )}
      {error && (
        <div className="mx-6 mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-lg">
          <X className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Add Integration Key Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <div className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">Add Integration Key</h2>
              <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5"/></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Service</label>
                <select
                  id="integration-service-select"
                  value={selectedService}
                  onChange={e => {
                    setSelectedService(e.target.value as Service)
                    setFormValues({})
                  }}
                  className="w-full bg-background border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {SERVICES.map(s => <option key={s} value={s}>{SERVICE_META[s].label}</option>)}
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">Configure {SERVICE_META[selectedService].label} Keys</div>
                {KEY_SUGGESTIONS[selectedService].map(keyName => (
                  <div key={keyName}>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                      {keyName.replace(/_/g, " ")}
                    </label>
                    <input
                      type={keyName.includes("PASS") || keyName.includes("SECRET") || keyName.includes("KEY") || keyName.includes("TOKEN") ? "password" : "text"}
                      placeholder={`Enter ${keyName}`}
                      value={formValues[keyName] || ""}
                      onChange={e => setFormValues(prev => ({ ...prev, [keyName]: e.target.value }))}
                      className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/40">
                <button
                  id="integration-save-btn"
                  onClick={handleSaveKey}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Encrypting & Saving…" : "Save Keys"}
                </button>
                <button onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground border border-border/60 hover:bg-muted/50 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Webhook Endpoint Modal */}
      {showAddWebhook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAddWebhook(false)}>
          <div className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Webhook className="w-5 h-5 text-primary" /> Add Custom Webhook Endpoint
              </h2>
              <button onClick={() => setShowAddWebhook(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5"/></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Endpoint Name</label>
                <input
                  type="text"
                  placeholder="e.g. Slack CRM Channel, Zapier Sync, Custom Backend"
                  value={webhookForm.name}
                  onChange={e => setWebhookForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Payload Target URL *</label>
                <input
                  type="url"
                  placeholder="https://your-domain.com/webhooks/receiver"
                  value={webhookForm.url}
                  onChange={e => setWebhookForm(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm text-foreground font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Subscribe to Event Triggers *</label>
                <div className="space-y-2 border border-border/50 rounded-lg p-3 bg-muted/20">
                  {AVAILABLE_EVENTS.map(evt => {
                    const checked = webhookForm.events.includes(evt.id)
                    return (
                      <label key={evt.id} className="flex items-start gap-2.5 cursor-pointer text-xs group">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => {
                            if (e.target.checked) {
                              setWebhookForm(p => ({ ...p, events: [...p.events, evt.id] }))
                            } else {
                              setWebhookForm(p => ({ ...p, events: p.events.filter(x => x !== evt.id) }))
                            }
                          }}
                          className="mt-0.5 rounded border-border text-primary focus:ring-primary"
                        />
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{evt.label}</div>
                          <div className="text-muted-foreground text-[11px]">{evt.desc}</div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Signing Secret (Optional)</label>
                <input
                  type="text"
                  placeholder="Auto-generated if left blank (whsec_...)"
                  value={webhookForm.secret}
                  onChange={e => setWebhookForm(prev => ({ ...prev, secret: e.target.value }))}
                  className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm text-foreground font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Used to calculate HMAC-SHA256 signature in <code className="bg-muted px-1 rounded">X-Echo-Signature</code> header.</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/40">
                <button
                  id="save-webhook-btn"
                  onClick={handleSaveWebhook}
                  disabled={savingWebhook}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {savingWebhook ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {savingWebhook ? "Saving Endpoint…" : "Save Webhook Endpoint"}
                </button>
                <button onClick={() => setShowAddWebhook(false)} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground border border-border/60 hover:bg-muted/50 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-5xl">
        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-border/50 mb-6">
          <button
            id="tab-api-connections"
            onClick={() => setActiveTab("api")}
            className={`px-4 py-2 font-medium text-sm transition-all border-b-2 ${activeTab === 'api' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            API Connections & Credentials
          </button>
          <button
            id="tab-webhooks"
            onClick={() => setActiveTab("webhooks")}
            className={`px-4 py-2 font-medium text-sm transition-all border-b-2 ${activeTab === 'webhooks' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Webhooks & Meta Integration Hub
          </button>
        </div>

        {/* TAB 1: API CONNECTIONS */}
        {activeTab === "api" && (
          loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="space-y-6">
              {/* WhatsApp & Meta Connection Test Box */}
              <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-5 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-emerald-500" /> WhatsApp & Meta Direct Cloud Diagnostics
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Test Meta Graph API & Grafty WhatsApp credentials to verify phone number ID and WABA connection.
                    </p>
                  </div>
                  <button
                    onClick={handleTestWhatsApp}
                    disabled={testingWa}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm disabled:opacity-50"
                  >
                    {testingWa ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    {testingWa ? "Testing API..." : "Test Connection"}
                  </button>
                </div>

                {waTestResult && (
                  <div className="mt-4 border-t border-emerald-500/20 pt-3 space-y-2">
                    <div className="text-xs font-mono">
                      <div className="font-bold text-foreground mb-1">Diagnostic Output:</div>
                      {waTestResult.meta?.connected ? (
                        <div className="text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
                          ✓ Meta Cloud API Connected! (Account: {waTestResult.meta.account?.name || waTestResult.meta.account?.id}, Phone ID: {waTestResult.meta.phoneNumberId})
                        </div>
                      ) : (
                        <div className="text-amber-400 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/40">
                          ⚠ Meta Cloud API: {waTestResult.meta?.error || "Not connected"}
                        </div>
                      )}

                      {waTestResult.grafty?.connected ? (
                        <div className="text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40 mt-1">
                          ✓ Grafty Engine Connected! ({waTestResult.grafty.templates} templates available)
                        </div>
                      ) : (
                        <div className="text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40 mt-1">
                          ℹ Grafty Engine: {waTestResult.grafty?.error || "Not configured"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Service Cards */}
              <div className="space-y-4">
                {SERVICES.map(service => {
                  const meta = SERVICE_META[service]
                  const Icon = meta.icon
                  const serviceKeys = grouped[service]
                  return (
                    <div key={service} className={`bg-card border rounded-xl p-5 shadow-xs transition-all hover:border-border ${serviceKeys.length > 0 ? 'border-primary/40 bg-card' : 'border-border/60'}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-border/60 bg-muted/40 text-foreground">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-foreground text-sm tracking-tight">{meta.label}</h3>
                            {serviceKeys.length > 0 ? (
                              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                <CheckCircle2 className="w-3.5 h-3.5" /> {serviceKeys.length} key{serviceKeys.length > 1 ? "s" : ""} active
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-0.5 rounded-full border border-border/40">Not configured</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{meta.desc}</p>

                          {serviceKeys.length > 0 && (
                            <div className="space-y-2">
                              {serviceKeys.map(k => (
                                <div key={k.id} className="flex items-center gap-2 bg-muted/40 border border-border/40 rounded-lg px-3 py-2">
                                  <Plug className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  <span className="text-xs font-mono text-muted-foreground w-44 shrink-0 truncate font-semibold">{k.keyName}</span>
                                  <span className={`flex-1 font-mono text-xs ${showValues[k.id] ? "text-foreground" : "text-muted-foreground"}`}>
                                    {showValues[k.id] ? k.encryptedValue : "••••••••••••••••"}
                                  </span>
                                  <button
                                    onClick={() => setShowValues(p => ({ ...p, [k.id]: !p[k.id] }))}
                                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                    title={showValues[k.id] ? "Hide" : "Show masked value"}
                                  >
                                    {showValues[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteKey(k.id)}
                                    className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                                    title="Delete key"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        )}

        {/* TAB 2: WEBHOOKS & META INTEGRATION */}
        {activeTab === "webhooks" && (
          <div className="space-y-6">
            {/* META LEAD ADS SETUP CARD */}
            <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-blue-300 text-base flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-blue-400" /> Meta Lead Ads Callback URL (Facebook & Instagram)
                  </h3>
                  <p className="text-xs text-blue-200/70 mt-1">
                    Copy this Webhook URL into Facebook Developers Console → App → Webhooks → Leadgen.
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-md">
                  Official Webhook Receiver
                </span>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[11px] font-bold text-blue-400 block mb-1">Callback URL:</label>
                  <div className="flex items-center gap-2 bg-black/50 border border-blue-500/30 rounded-lg p-2.5">
                    <input
                      type="text"
                      readOnly
                      value="https://echo.grekam.in/api/v1/webhooks/meta"
                      className="flex-1 bg-transparent text-blue-200 border-none outline-none text-xs"
                    />
                    <button
                      onClick={() => copyToClipboard("https://echo.grekam.in/api/v1/webhooks/meta", "meta-url")}
                      className="flex items-center gap-1 text-[11px] bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-2.5 py-1 rounded transition-colors"
                    >
                      <Copy className="w-3 h-3" /> {copiedText === "meta-url" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-blue-300/80 font-sans">
                  💡 Set your <strong>META_VERIFY_TOKEN</strong> in the API Credentials tab above. Meta will send a GET request to verify token, and POST requests whenever a lead form is submitted.
                </p>
              </div>
            </div>

            {/* CUSTOM INCOMING CRM LEAD WEBHOOK CARD */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-emerald-300 text-base flex items-center gap-2">
                    <Send className="w-5 h-5 text-emerald-400" /> Custom Lead Ingestion Webhook (Zapier, Make, Typeform)
                  </h3>
                  <p className="text-xs text-emerald-200/70 mt-1">
                    Send JSON payload to this endpoint to create leads directly in Echo LMS CRM.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[11px] font-bold text-emerald-400 block mb-1">POST URL:</label>
                  <div className="flex items-center gap-2 bg-black/50 border border-emerald-500/30 rounded-lg p-2.5">
                    <input
                      type="text"
                      readOnly
                      value="https://echo.grekam.in/api/v1/crm/public/webhooks/custom"
                      className="flex-1 bg-transparent text-emerald-200 border-none outline-none text-xs"
                    />
                    <button
                      onClick={() => copyToClipboard("https://echo.grekam.in/api/v1/crm/public/webhooks/custom", "ingest-url")}
                      className="flex items-center gap-1 text-[11px] bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded transition-colors"
                    >
                      <Copy className="w-3 h-3" /> {copiedText === "ingest-url" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="bg-black/60 p-3 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-200 space-y-1 overflow-x-auto">
                  <div className="text-emerald-400 font-bold">// Sample JSON Payload:</div>
                  <pre>{`{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "phone": "+919876543210",
  "company": "Tech Corp",
  "source": "ZAPIER_CUSTOM",
  "notes": "Inquired via WordPress Contact Form"
}`}</pre>
                </div>
              </div>
            </div>

            {/* OUTGOING EVENT WEBHOOKS LIST */}
            <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                    <Webhook className="w-5 h-5 text-primary" /> Active Outgoing Webhooks ({webhooks.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Echo LMS automatically triggers these external HTTP POST endpoints whenever events occur.
                  </p>
                </div>
                <button
                  onClick={() => { setShowAddWebhook(true); setError("") }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Webhook
                </button>
              </div>

              {loadingWebhooks ? (
                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : webhooks.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border/60 rounded-xl bg-muted/20">
                  <Webhook className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-foreground">No Outgoing Webhooks Configured</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Add custom webhooks to push real-time CRM lead, billing, or LMS enrollment events to Slack, Zapier, or your custom server.
                  </p>
                  <button
                    onClick={() => setShowAddWebhook(true)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add First Webhook Endpoint
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {webhooks.map(wh => {
                    const testRes = webhookTestResult[wh.id]
                    return (
                      <div key={wh.id} className="bg-muted/30 border border-border/60 rounded-xl p-4 transition-all hover:border-border">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-foreground text-sm">{wh.name || "Custom Webhook"}</span>
                              {wh.isActive ? (
                                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Active</span>
                              ) : (
                                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Inactive</span>
                              )}
                            </div>

                            <div className="text-xs font-mono text-primary font-medium truncate mb-2">{wh.url}</div>

                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {wh.events.map(evt => (
                                <span key={evt} className="text-[10px] font-mono font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                                  {evt}
                                </span>
                              ))}
                            </div>

                            {wh.secret && (
                              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                <span className="text-[11px]">Signing Secret:</span>
                                <span>{showWebhookSecret[wh.id] ? wh.secret : "whsec_••••••••••••••••"}</span>
                                <button
                                  onClick={() => setShowWebhookSecret(p => ({ ...p, [wh.id]: !p[wh.id] }))}
                                  className="text-muted-foreground hover:text-foreground p-0.5"
                                >
                                  {showWebhookSecret[wh.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleTestWebhook(wh.id)}
                              disabled={testingWebhookId === wh.id}
                              className="flex items-center gap-1.5 bg-background border border-border/60 hover:bg-muted text-foreground text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                            >
                              {testingWebhookId === wh.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                              Test Ping
                            </button>
                            <button
                              onClick={() => handleDeleteWebhook(wh.id)}
                              className="text-muted-foreground hover:text-red-400 p-1.5 transition-colors"
                              title="Delete Webhook"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {testRes && (
                          <div className="mt-3 border-t border-border/40 pt-2.5">
                            {testRes.success ? (
                              <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 p-2 rounded-lg font-mono">
                                ✓ Test Delivered Successfully! (HTTP {testRes.statusCode})
                              </div>
                            ) : (
                              <div className="text-xs text-red-400 bg-red-950/30 border border-red-800/40 p-2 rounded-lg font-mono">
                                ✕ Delivery Failed: {testRes.error || `HTTP ${testRes.statusCode}`}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
