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

  if (!settings) return <div className="p-8 flex justify-center bg-slate-50 min-h-screen"><Loader2 className="animate-spin text-teal-600" /></div>;

  return (
    <div className="p-8 max-w-4xl bg-slate-50 text-slate-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <DollarSign className="w-7 h-7 text-teal-600" /> Finance & Currency
        </h1>
        <p className="text-slate-500 mt-2">Configure currency, tax model, and invoice numbering for your Echo LMS instance.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-5">Currency</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Base Currency</label>
              <select
                value={settings.baseCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Currency Symbol</label>
              <input
                type="text"
                value={settings.currencySymbol || ""}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-5">Tax Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            {TAX_MODELS.map(m => (
              <button
                key={m}
                onClick={() => setSettings({ ...settings, taxModel: m })}
                className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                  settings.taxModel === m
                    ? 'border-teal-500 bg-teal-50 text-teal-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {settings.taxModel === 'GST' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">GST Number (GSTIN)</label>
              <input
                type="text"
                value={settings.gstNumber || ""}
                onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500 font-mono uppercase"
                placeholder="22AAAAA0000A1Z5"
              />
            </div>
          )}
          {settings.taxModel === 'VAT' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">VAT Number</label>
              <input
                type="text"
                value={settings.vatNumber || ""}
                onChange={(e) => setSettings({ ...settings, vatNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                placeholder="GB123456789"
              />
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-5">Invoice Numbering</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Invoice Prefix</label>
              <input
                type="text"
                value={settings.invoicePrefix || "INV"}
                onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                placeholder="INV"
              />
              <p className="text-xs text-slate-400">Preview: {settings.invoicePrefix || 'INV'}-{new Date().getFullYear()}-0001</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Fiscal Year Start</label>
              <select
                value={settings.fiscalYearStart}
                onChange={(e) => setSettings({ ...settings, fiscalYearStart: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
              >
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> :
             saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> :
             'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
