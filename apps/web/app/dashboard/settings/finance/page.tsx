"use client";

import { useEffect, useState } from "react";
import { ApiClient } from "@/lib/api";
import { Loader2, DollarSign, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const TAX_MODELS = ['GST', 'VAT', 'NONE'] as const;
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export default function FinanceSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    ApiClient.get("/settings/finance")
      .then((data) => {
        setCurrencies(data.currencies || []);
        setSettings(data);
      })
      .catch((err) => {
        toast.error("Failed to load finance settings");
      });
  }, []);

  const handleCurrencyChange = (code: string) => {
    const cur = currencies.find(c => c.code === code);
    if (cur) setSettings({ ...settings, baseCurrency: cur.code, currencySymbol: cur.symbol });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        baseCurrency: settings.baseCurrency || "INR",
        currencySymbol: settings.currencySymbol || "₹",
        taxModel: settings.taxModel || "NONE",
        gstNumber: settings.gstNumber ? settings.gstNumber.trim() : null,
        vatNumber: settings.vatNumber ? settings.vatNumber.trim() : null,
        fiscalYearStart: Number(settings.fiscalYearStart) || 4,
        invoicePrefix: settings.invoicePrefix ? settings.invoicePrefix.trim() : "INV",
        invoiceNextNumber: Number(settings.invoiceNextNumber) || 1,
      };

      const updated = await ApiClient.patch("/settings/finance", payload);
      setSettings({ ...updated, currencies });
      setSaved(true);
      toast.success("Finance settings saved successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Failed to save finance settings:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to save finance settings");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="p-12 flex flex-col items-center justify-center min-h-[350px]"><Loader2 className="w-6 h-6 animate-spin text-zinc-400 mb-2" /><p className="text-xs text-zinc-500">Loading settings...</p></div>;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">
            Finance & Currency
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Configure currency, tax model, and invoice numbering for your OS instance.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 cursor-pointer shadow-sm shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> :
           saved ? <><CheckCircle className="w-4 h-4 text-emerald-300" /> Saved</> :
           'Save changes'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-[#121620] border border-white/[0.08] rounded-xl p-6 space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-base font-semibold text-zinc-100">Base Currency</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Primary accounting and reporting currency across invoices and payouts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Currency</label>
              <select
                value={settings.baseCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full bg-[#0b0d13] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Currency Symbol</label>
              <input
                type="text"
                value={settings.currencySymbol || ""}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full bg-[#0b0d13] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#121620] border border-white/[0.08] rounded-xl p-6 space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-base font-semibold text-zinc-100">Tax Model</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Determines tax calculation engines on customer estimates and invoices.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-2">
            {TAX_MODELS.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setSettings({ ...settings, taxModel: m })}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                  settings.taxModel === m
                    ? 'border-blue-500/60 bg-blue-500/10 text-blue-400'
                    : 'border-white/[0.08] bg-[#0b0d13] text-zinc-400 hover:border-white/[0.15] hover:text-zinc-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {settings.taxModel === 'GST' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">GST Number (GSTIN)</label>
              <input
                type="text"
                value={settings.gstNumber || ""}
                onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                className="w-full bg-[#0b0d13] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 font-mono uppercase"
                placeholder="22AAAAA0000A1Z5"
              />
            </div>
          )}
          {settings.taxModel === 'VAT' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">VAT Number</label>
              <input
                type="text"
                value={settings.vatNumber || ""}
                onChange={(e) => setSettings({ ...settings, vatNumber: e.target.value })}
                className="w-full bg-[#0b0d13] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
                placeholder="GB123456789"
              />
            </div>
          )}
        </div>

        <div className="bg-[#121620] border border-white/[0.08] rounded-xl p-6 space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-base font-semibold text-zinc-100">Invoice Numbering & Fiscal Year</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Prefix convention and start of accounting period.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Invoice Prefix</label>
              <input
                type="text"
                value={settings.invoicePrefix || "INV"}
                onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                className="w-full bg-[#0b0d13] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
                placeholder="INV"
              />
              <p className="text-xs text-zinc-500">Preview: {(settings.invoicePrefix || 'INV').trim()}-{String(settings.invoiceNextNumber || 1).padStart(4, '0')}</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Next Invoice Number Counter</label>
              <input
                type="number"
                min="1"
                value={settings.invoiceNextNumber || 1}
                onChange={(e) => setSettings({ ...settings, invoiceNextNumber: parseInt(e.target.value) || 1 })}
                className="w-full bg-[#0b0d13] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
                placeholder="1"
              />
              <p className="text-xs text-zinc-500">Starts sequence at this number</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Fiscal Year Start</label>
              <select
                value={settings.fiscalYearStart}
                onChange={(e) => setSettings({ ...settings, fiscalYearStart: parseInt(e.target.value) })}
                className="w-full bg-[#0b0d13] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
              >
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
