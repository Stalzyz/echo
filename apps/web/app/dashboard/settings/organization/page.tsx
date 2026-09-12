"use client";

import { useEffect, useState, useRef } from "react";
import { ApiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Palette, 
  Image as ImageIcon, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  Upload, 
  Trash2, 
  Globe, 
  CreditCard,
  Sparkles,
  ExternalLink,
  Share2,
  FileBadge2,
  Eye
} from "lucide-react";
import { 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube, 
  FaFacebookF, 
  FaWhatsapp 
} from "react-icons/fa";
import { toast } from "sonner";

const PRESET_PALETTES = [
  { name: "Electric Grekam", primary: "#4f46e5", secondary: "#7c3aed", accent: "#10b981" },
  { name: "Royal Sapphire", primary: "#2563eb", secondary: "#1d4ed8", accent: "#06b6d4" },
  { name: "Cyber Emerald", primary: "#059669", secondary: "#047857", accent: "#34d399" },
  { name: "Sunset Crimson", primary: "#e11d48", secondary: "#be123c", accent: "#f59e0b" },
  { name: "Violet Nebula", primary: "#9333ea", secondary: "#6b21a8", accent: "#ec4899" },
  { name: "Midnight Stealth", primary: "#334155", secondary: "#1e293b", accent: "#38bdf8" },
];

export default function OrganizationSettingsPage() {
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Uploading states
  const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});

  const agencyLogoInputRef = useRef<HTMLInputElement>(null);
  const agencyFaviconInputRef = useRef<HTMLInputElement>(null);
  const academyLogoInputRef = useRef<HTMLInputElement>(null);
  const academyFaviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ApiClient.get("/settings/organization")
      .then((data) => {
        setOrg(data || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load organization settings");
        setLoading(false);
      });
  }, []);

  const handleUploadFile = async (file: File, field: 'logoUrl' | 'faviconUrl' | 'academyLogoUrl' | 'academyFaviconUrl') => {
    setUploadingState((prev) => ({ ...prev, [field]: true }));

    try {
      // 1. Request presigned upload URL or local upload endpoint
      const { uploadUrl, downloadUrl } = await ApiClient.post('/storage/upload-url', {
        filename: file.name,
        contentType: file.type || 'image/png',
        prefix: 'branding'
      });

      // 2. Upload file to target
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'image/png' }
      });

      // 3. Update state & auto-persist
      setOrg((prev: any) => ({ ...prev, [field]: downloadUrl }));
      await ApiClient.patch('/settings/organization', { [field]: downloadUrl }).catch(() => {});
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("organization-updated"));
      }
      toast.success(`${field.includes('Favicon') ? 'Favicon' : 'Logo'} uploaded and updated!`);
    } catch (err: any) {
      console.warn('Upload-url failed, falling back to data URI encoding...', err);
      // Fallback: Read as base64 data URI
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUri = e.target?.result as string;
        setOrg((prev: any) => ({ ...prev, [field]: dataUri }));
        await ApiClient.patch('/settings/organization', { [field]: dataUri }).catch(() => {});
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("organization-updated"));
        }
        toast.success(`${field.includes('Favicon') ? 'Favicon' : 'Logo'} updated successfully!`);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingState((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {
        name: org.name || "Grekam Visuals",
        companyName: org.companyName ? org.companyName.trim() : null,
        panNumber: org.panNumber ? org.panNumber.trim().toUpperCase() : null,
        gstNumber: org.gstNumber ? org.gstNumber.trim().toUpperCase() : null,
        logoUrl: org.logoUrl || null,
        faviconUrl: org.faviconUrl || null,
        academyLogoUrl: org.academyLogoUrl || null,
        academyFaviconUrl: org.academyFaviconUrl || null,
        primaryColor: org.primaryColor || "#4f46e5",
        secondaryColor: org.secondaryColor || "#7c3aed",
        accentColor: org.accentColor || "#10b981",
        darkModeDefault: org.darkModeDefault ?? true,
        supportEmail: org.supportEmail ? org.supportEmail.trim() : null,
        billingAddress: org.billingAddress ? org.billingAddress.trim() : null,
        website: org.website ? org.website.trim() : null,
        phone: org.phone ? org.phone.trim() : null,
        instagramUrl: org.instagramUrl ? org.instagramUrl.trim() : null,
        youtubeUrl: org.youtubeUrl ? org.youtubeUrl.trim() : null,
        linkedinUrl: org.linkedinUrl ? org.linkedinUrl.trim() : null,
        twitterUrl: org.twitterUrl ? org.twitterUrl.trim() : null,
        facebookUrl: org.facebookUrl ? org.facebookUrl.trim() : null,
        whatsappNumber: org.whatsappNumber ? org.whatsappNumber.trim() : null,
        openAiKey: org.openAiKey || null,
        bankName: org.bankName ? org.bankName.trim() : null,
        accountName: org.accountName ? org.accountName.trim() : null,
        accountNumber: org.accountNumber ? org.accountNumber.trim() : (org.bankAccountNo || null),
        ifscCode: org.ifscCode ? org.ifscCode.trim().toUpperCase() : (org.bankIfsc || null),
        swiftCode: org.swiftCode ? org.swiftCode.trim().toUpperCase() : null,
        bankBranch: org.bankBranch ? org.bankBranch.trim() : null,
      };

      const updated = await ApiClient.patch("/settings/organization", payload);
      setOrg(updated);
      setSaved(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("organization-updated"));
      }
      toast.success("Organization & branding settings updated successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-sm font-mono text-white/50 uppercase tracking-wider">Loading Brand Settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      {/* Page Title & Main Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" /> Workspace Identity
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Organization & Brand Identity
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Configure legal entity details, PAN & GST, brand colors, digital assets, and official social channels.
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3 rounded-xl shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all shrink-0 flex items-center gap-2 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
          {saving ? "Saving Changes..." : saved ? "Changes Saved!" : "Save Brand Settings"}
        </Button>
      </div>

      {/* ── 1. BRAND COLORS & VISUAL IDENTITY ── */}
      <div className="bg-[#0c101b] border border-blue-500/20 rounded-3xl p-7 shadow-xl space-y-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Brand Colors & Dynamic Theme</h2>
              <p className="text-xs text-white/50">Shapes the visual personality of customer invoices, proposals, emails, and platform accents.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold uppercase rounded-lg w-fit">
            Live Palette
          </span>
        </div>

        {/* Preset Palettes */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-white/50 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Curated Palettes
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PRESET_PALETTES.map((palette) => {
              const isSelected = 
                org?.primaryColor?.toLowerCase() === palette.primary.toLowerCase() &&
                org?.secondaryColor?.toLowerCase() === palette.secondary.toLowerCase() &&
                org?.accentColor?.toLowerCase() === palette.accent.toLowerCase();

              return (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => setOrg({
                    ...org,
                    primaryColor: palette.primary,
                    secondaryColor: palette.secondary,
                    accentColor: palette.accent,
                  })}
                  className={`p-3 rounded-xl border text-left transition-all group flex flex-col gap-2 relative ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/50' 
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: palette.primary }} />
                    <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: palette.secondary }} />
                    <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: palette.accent }} />
                  </div>
                  <span className="text-[11px] font-medium text-white/80 truncate group-hover:text-white">
                    {palette.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Individual Color Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Brand Color */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80">
                Primary Brand Color
              </label>
              <span className="text-[10px] font-mono text-white/40">Core Brand</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Main navigation highlights, primary CTAs, PDF invoice headers, and dominant brand elements.
            </p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={org?.primaryColor || "#4f46e5"}
                  onChange={(e) => setOrg({ ...org, primaryColor: e.target.value })}
                  className="w-12 h-12 rounded-xl border border-white/20 cursor-pointer bg-transparent p-0.5 overflow-hidden"
                />
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={org?.primaryColor || "#4f46e5"}
                  onChange={(e) => setOrg({ ...org, primaryColor: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white uppercase focus:outline-none focus:border-blue-500"
                  placeholder="#4F46E5"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Secondary Brand Color */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80">
                Secondary Brand Color
              </label>
              <span className="text-[10px] font-mono text-white/40">Gradient / Sub</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Hero gradients, secondary button fills, course cards, and complementary agency visual motifs.
            </p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={org?.secondaryColor || "#7c3aed"}
                  onChange={(e) => setOrg({ ...org, secondaryColor: e.target.value })}
                  className="w-12 h-12 rounded-xl border border-white/20 cursor-pointer bg-transparent p-0.5 overflow-hidden"
                />
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={org?.secondaryColor || "#7c3aed"}
                  onChange={(e) => setOrg({ ...org, secondaryColor: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white uppercase focus:outline-none focus:border-purple-500"
                  placeholder="#7C3AED"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Accent Highlight Color */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80">
                Accent Highlight Color
              </label>
              <span className="text-[10px] font-mono text-white/40">Glow & Success</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Status badges, verified checkmarks, quotation highlights, and vibrant interactive counters.
            </p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={org?.accentColor || "#10b981"}
                  onChange={(e) => setOrg({ ...org, accentColor: e.target.value })}
                  className="w-12 h-12 rounded-xl border border-white/20 cursor-pointer bg-transparent p-0.5 overflow-hidden"
                />
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={org?.accentColor || "#10b981"}
                  onChange={(e) => setOrg({ ...org, accentColor: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white uppercase focus:outline-none focus:border-emerald-500"
                  placeholder="#10B981"
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive UI Preview Card */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/70">
              <Eye className="w-4 h-4 text-blue-400" /> Live Theme Component Simulation
            </div>
            <span className="text-[10px] font-mono text-white/40">Auto-updates as you pick colors</span>
          </div>

          <div 
            className="rounded-2xl p-6 border relative overflow-hidden transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${org?.primaryColor || '#4f46e5'}15, #0a0d14 60%)`,
              borderColor: `${org?.primaryColor || '#4f46e5'}40`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border"
                    style={{ 
                      backgroundColor: `${org?.accentColor || '#10b981'}25`,
                      borderColor: `${org?.accentColor || '#10b981'}80`,
                      color: org?.accentColor || '#10b981'
                    }}
                  >
                    ● Verified Active Status
                  </span>
                  <span className="text-xs text-white/40 font-mono">Invoice #INV-2026-089</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  {org?.companyName || org?.name || "Grekam Visuals & Technologies Pvt Ltd"}
                </h4>
                <p className="text-xs text-white/60">
                  GSTIN: {org?.gstNumber || "33AAAAA0000A1Z5"} • PAN: {org?.panNumber || "ABCDE1234F"}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: org?.primaryColor || '#4f46e5',
                    boxShadow: `0 0 20px ${org?.primaryColor || '#4f46e5'}50`
                  }}
                >
                  Primary CTA
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-white/5 cursor-pointer"
                  style={{
                    borderColor: `${org?.secondaryColor || '#7c3aed'}80`,
                    color: org?.secondaryColor || '#7c3aed'
                  }}
                >
                  Secondary Action
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. LEGAL ENTITY & TAX PARTICULARS ── */}
      <div className="bg-[#111111] border border-white/10 rounded-3xl p-7 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileBadge2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Legal Entity & Tax Particulars</h2>
              <p className="text-xs text-white/50">Official corporate identification, Income Tax PAN, and GST credentials.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase rounded-lg">
            Compliance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Workspace Display Name */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/70">
              Workspace / Brand Display Name
            </label>
            <input
              type="text"
              value={org?.name || ""}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g. Grekam Visuals"
            />
            <p className="text-[11px] text-white/40">Short name used in UI navigation, breadcrumbs, and system greetings.</p>
          </div>

          {/* Registered Legal Company Name */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/70">
              Registered Legal Company Name
            </label>
            <input
              type="text"
              value={org?.companyName || ""}
              onChange={(e) => setOrg({ ...org, companyName: e.target.value })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g. Grekam Visuals & Technologies Pvt Ltd"
            />
            <p className="text-[11px] text-white/40">Full legal entity name printed at the top of official Tax Invoices & Legal Contracts.</p>
          </div>

          {/* Income Tax PAN */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-white/70">
                Income Tax PAN (Permanent Account Number)
              </label>
              <span className="text-[10px] font-mono text-emerald-400">10-Digit Alphanumeric</span>
            </div>
            <input
              type="text"
              value={org?.panNumber || ""}
              onChange={(e) => setOrg({ ...org, panNumber: e.target.value.toUpperCase() })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono uppercase text-white focus:outline-none focus:border-emerald-500"
              placeholder="ABCDE1234F"
              maxLength={10}
            />
            <p className="text-[11px] text-white/40">Mandatory for Indian TDS calculations and financial audit trails.</p>
          </div>

          {/* GSTIN */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-white/70">
                GSTIN (Goods and Services Tax ID)
              </label>
              <span className="text-[10px] font-mono text-emerald-400">Auto-synced with Finance</span>
            </div>
            <input
              type="text"
              value={org?.gstNumber || ""}
              onChange={(e) => setOrg({ ...org, gstNumber: e.target.value.toUpperCase() })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono uppercase text-white focus:outline-none focus:border-emerald-500"
              placeholder="33AAAAA0000A1Z5"
              maxLength={15}
            />
            <p className="text-[11px] text-white/40">Appears on B2B invoices and synchronizes directly with Finance & Currency settings.</p>
          </div>

          {/* Official Email */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/70">Support / Official Email</label>
            <input
              type="email"
              value={org?.supportEmail || ""}
              onChange={(e) => setOrg({ ...org, supportEmail: e.target.value })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="contact@grekam.in"
            />
          </div>

          {/* Official Website */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/70">Official Website URL</label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={org?.website || ""}
                onChange={(e) => setOrg({ ...org, website: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 pr-10"
                placeholder="https://grekam.in"
              />
              {org?.website && (
                <a
                  href={org.website.startsWith("http") ? org.website : `https://${org.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 text-white/40 hover:text-white transition-colors"
                  title="Test Website URL"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Contact Phone */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/70">Contact Phone / Direct Line</label>
            <input
              type="text"
              value={org?.phone || ""}
              onChange={(e) => setOrg({ ...org, phone: e.target.value })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="+91 98400 12345"
            />
          </div>

          {/* Billing Address */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/70">
              Registered Billing & Corporate Address (Printed on Invoices)
            </label>
            <textarea
              value={org?.billingAddress || ""}
              onChange={(e) => setOrg({ ...org, billingAddress: e.target.value })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 min-h-[90px]"
              placeholder="No. 42 Anna Salai, Chennai, Tamil Nadu, 600002"
            />
          </div>
        </div>
      </div>

      {/* ── 3. OFFICIAL SOCIAL MEDIA HANDLES ── */}
      <div className="bg-[#0b0f19] border border-purple-500/20 rounded-3xl p-7 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Social Media Handles & Public Channels</h2>
              <p className="text-xs text-white/50">Integrated into email footers, proposal presentations, course certificates, and client portals.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono font-bold uppercase rounded-lg">
            Channels
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instagram */}
          <div className="space-y-2 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <FaInstagram className="w-3.5 h-3.5" />
              </div>
              Instagram Profile URL
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={org?.instagramUrl || ""}
                onChange={(e) => setOrg({ ...org, instagramUrl: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 pr-10"
                placeholder="https://instagram.com/grekamvisuals"
              />
              {org?.instagramUrl && (
                <a
                  href={org.instagramUrl.startsWith("http") ? org.instagramUrl : `https://${org.instagramUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 text-pink-400 hover:text-pink-300 transition-colors"
                  title="Open Instagram Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* YouTube */}
          <div className="space-y-2 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <FaYoutube className="w-3.5 h-3.5" />
              </div>
              YouTube Channel URL
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={org?.youtubeUrl || ""}
                onChange={(e) => setOrg({ ...org, youtubeUrl: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 pr-10"
                placeholder="https://youtube.com/@grekamvisuals"
              />
              {org?.youtubeUrl && (
                <a
                  href={org.youtubeUrl.startsWith("http") ? org.youtubeUrl : `https://${org.youtubeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 text-red-400 hover:text-red-300 transition-colors"
                  title="Open YouTube Channel"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* LinkedIn */}
          <div className="space-y-2 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <FaLinkedinIn className="w-3.5 h-3.5" />
              </div>
              LinkedIn Organization URL
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={org?.linkedinUrl || ""}
                onChange={(e) => setOrg({ ...org, linkedinUrl: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 pr-10"
                placeholder="https://linkedin.com/company/grekam"
              />
              {org?.linkedinUrl && (
                <a
                  href={org.linkedinUrl.startsWith("http") ? org.linkedinUrl : `https://${org.linkedinUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 text-blue-400 hover:text-blue-300 transition-colors"
                  title="Open LinkedIn Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* X / Twitter */}
          <div className="space-y-2 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <FaTwitter className="w-3.5 h-3.5" />
              </div>
              X (Formerly Twitter) URL
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={org?.twitterUrl || ""}
                onChange={(e) => setOrg({ ...org, twitterUrl: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/40 pr-10"
                placeholder="https://x.com/grekamvisuals"
              />
              {org?.twitterUrl && (
                <a
                  href={org.twitterUrl.startsWith("http") ? org.twitterUrl : `https://${org.twitterUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 text-white/70 hover:text-white transition-colors"
                  title="Open X / Twitter Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Facebook */}
          <div className="space-y-2 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <FaFacebookF className="w-3.5 h-3.5" />
              </div>
              Facebook Official Page URL
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={org?.facebookUrl || ""}
                onChange={(e) => setOrg({ ...org, facebookUrl: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 pr-10"
                placeholder="https://facebook.com/grekamvisuals"
              />
              {org?.facebookUrl && (
                <a
                  href={org.facebookUrl.startsWith("http") ? org.facebookUrl : `https://${org.facebookUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 text-blue-400 hover:text-blue-300 transition-colors"
                  title="Open Facebook Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* WhatsApp Business */}
          <div className="space-y-2 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FaWhatsapp className="w-3.5 h-3.5" />
              </div>
              WhatsApp Business Number / wa.me Link
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={org?.whatsappNumber || ""}
                onChange={(e) => setOrg({ ...org, whatsappNumber: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 pr-10"
                placeholder="+91 98400 12345 or https://wa.me/919840012345"
              />
              {org?.whatsappNumber && (
                <a
                  href={
                    org.whatsappNumber.startsWith("http") 
                      ? org.whatsappNumber 
                      : `https://wa.me/${org.whatsappNumber.replace(/[^0-9]/g, '')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 text-emerald-400 hover:text-emerald-300 transition-colors"
                  title="Open WhatsApp Chat"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. DIGITAL AGENCY BRAND ASSETS ── */}
      <div className="bg-[#0b0f19] border border-blue-500/20 rounded-3xl p-7 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Digital Agency Brand (Grekam Visuals)</h2>
              <p className="text-xs text-white/50">Used across Tax Invoices, Proposals, Client Estimates, HR Documents, and Garage OS.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold uppercase rounded-lg">
            Agency Unit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Agency Landscape Logo */}
          <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-400" /> Agency Logo (Landscape)
              </label>
              <span className="text-[10px] font-mono text-white/40">~3:1 / 4:1 Ratio</span>
            </div>
            <p className="text-[11px] text-white/40">Pulls automatically into PDF invoices, proposals, estimates, and email letterheads.</p>

            {/* Preview Box */}
            <div className="w-full h-28 rounded-xl border border-white/10 bg-[#06080e] p-3 flex items-center justify-center relative overflow-hidden group">
              {org?.logoUrl ? (
                <img 
                  src={org.logoUrl} 
                  alt="Agency Logo" 
                  className="max-h-full max-w-full object-contain" 
                />
              ) : (
                <div className="text-center text-white/30 text-xs font-mono">
                  No Landscape Logo Uploaded
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="file" 
                ref={agencyLogoInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadFile(file, 'logoUrl');
                }} 
              />
              <button
                type="button"
                onClick={() => agencyLogoInputRef.current?.click()}
                disabled={uploadingState['logoUrl']}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                {uploadingState['logoUrl'] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {uploadingState['logoUrl'] ? "Uploading..." : "Upload Logo"}
              </button>
              {org?.logoUrl && (
                <button
                  type="button"
                  onClick={() => setOrg({ ...org, logoUrl: "" })}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 border border-white/10 rounded-xl transition-all cursor-pointer"
                  title="Remove Logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <input 
              type="text" 
              placeholder="Or enter logo image URL (https://...)" 
              value={org?.logoUrl || ""} 
              onChange={(e) => setOrg({ ...org, logoUrl: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500" 
            />
          </div>

          {/* Agency Favicon */}
          <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" /> Agency Favicon (Square)
              </label>
              <span className="text-[10px] font-mono text-white/40">1:1 Square</span>
            </div>
            <p className="text-[11px] text-white/40">Appears on browser tabs for garage.grekam.in & grekam.in, app bookmarks and portal icons.</p>

            {/* Preview Box with Mock Browser Tab */}
            <div className="w-full h-28 rounded-xl border border-white/10 bg-[#06080e] p-3 flex flex-col justify-between">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 max-w-[220px]">
                <div className="w-4 h-4 rounded shrink-0 flex items-center justify-center overflow-hidden bg-black/40">
                  {org?.faviconUrl ? (
                    <img src={org.faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                  ) : (
                    <Globe className="w-3 h-3 text-white/40" />
                  )}
                </div>
                <span className="text-[11px] font-mono text-white/70 truncate">Grekam OS — Agency</span>
              </div>
              <div className="flex items-center justify-end">
                <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center p-1">
                  {org?.faviconUrl ? (
                    <img src={org.faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] font-mono text-white/20">1:1</span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="file" 
                ref={agencyFaviconInputRef} 
                accept="image/*, .ico" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadFile(file, 'faviconUrl');
                }} 
              />
              <button
                type="button"
                onClick={() => agencyFaviconInputRef.current?.click()}
                disabled={uploadingState['faviconUrl']}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                {uploadingState['faviconUrl'] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {uploadingState['faviconUrl'] ? "Uploading..." : "Upload Favicon"}
              </button>
              {org?.faviconUrl && (
                <button
                  type="button"
                  onClick={() => setOrg({ ...org, faviconUrl: "" })}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 border border-white/10 rounded-xl transition-all cursor-pointer"
                  title="Remove Favicon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <input 
              type="text" 
              placeholder="Or enter favicon URL (https://.../favicon.ico)" 
              value={org?.faviconUrl || ""} 
              onChange={(e) => setOrg({ ...org, faviconUrl: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500" 
            />
          </div>
        </div>
      </div>

      {/* ── 5. ACADEMY BRAND ASSETS ── */}
      <div className="bg-[#0f0e1a] border border-indigo-500/20 rounded-3xl p-7 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Academy Brand (Grekam Academy)</h2>
              <p className="text-xs text-white/50">Used across Fee Receipts, Certificates, Course Agreements, LMS, and Student Portals.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold uppercase rounded-lg">
            Academy Unit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Academy Landscape Logo */}
          <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" /> Academy Logo (Landscape)
              </label>
              <span className="text-[10px] font-mono text-white/40">~3:1 / 4:1 Ratio</span>
            </div>
            <p className="text-[11px] text-white/40">Appears on course certificates, student enrollment cards, and educational fee receipts.</p>

            {/* Preview Box */}
            <div className="w-full h-28 rounded-xl border border-white/10 bg-[#07060f] p-3 flex items-center justify-center relative overflow-hidden group">
              {org?.academyLogoUrl ? (
                <img 
                  src={org.academyLogoUrl} 
                  alt="Academy Logo" 
                  className="max-h-full max-w-full object-contain" 
                />
              ) : (
                <div className="text-center text-white/30 text-xs font-mono">
                  No Academy Logo Uploaded
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="file" 
                ref={academyLogoInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadFile(file, 'academyLogoUrl');
                }} 
              />
              <button
                type="button"
                onClick={() => academyLogoInputRef.current?.click()}
                disabled={uploadingState['academyLogoUrl']}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                {uploadingState['academyLogoUrl'] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {uploadingState['academyLogoUrl'] ? "Uploading..." : "Upload Academy Logo"}
              </button>
              {org?.academyLogoUrl && (
                <button
                  type="button"
                  onClick={() => setOrg({ ...org, academyLogoUrl: "" })}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 border border-white/10 rounded-xl transition-all cursor-pointer"
                  title="Remove Academy Logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <input 
              type="text" 
              placeholder="Or enter academy logo URL (https://...)" 
              value={org?.academyLogoUrl || ""} 
              onChange={(e) => setOrg({ ...org, academyLogoUrl: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500" 
            />
          </div>

          {/* Academy Favicon */}
          <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono uppercase tracking-wider text-white/80 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" /> Academy Favicon (Square)
              </label>
              <span className="text-[10px] font-mono text-white/40">1:1 Square</span>
            </div>
            <p className="text-[11px] text-white/40">Appears on browser tabs for academy.grekam.in & LMS course player interfaces.</p>

            {/* Preview Box with Mock Browser Tab */}
            <div className="w-full h-28 rounded-xl border border-white/10 bg-[#07060f] p-3 flex flex-col justify-between">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 max-w-[220px]">
                <div className="w-4 h-4 rounded shrink-0 flex items-center justify-center overflow-hidden bg-black/40">
                  {org?.academyFaviconUrl ? (
                    <img src={org.academyFaviconUrl} alt="Academy Favicon" className="w-full h-full object-contain" />
                  ) : (
                    <GraduationCap className="w-3 h-3 text-white/40" />
                  )}
                </div>
                <span className="text-[11px] font-mono text-white/70 truncate">Grekam OS — Academy</span>
              </div>
              <div className="flex items-center justify-end">
                <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center p-1">
                  {org?.academyFaviconUrl ? (
                    <img src={org.academyFaviconUrl} alt="Academy Favicon" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] font-mono text-white/20">1:1</span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="file" 
                ref={academyFaviconInputRef} 
                accept="image/*, .ico" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadFile(file, 'academyFaviconUrl');
                }} 
              />
              <button
                type="button"
                onClick={() => academyFaviconInputRef.current?.click()}
                disabled={uploadingState['academyFaviconUrl']}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                {uploadingState['academyFaviconUrl'] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {uploadingState['academyFaviconUrl'] ? "Uploading..." : "Upload Academy Favicon"}
              </button>
              {org?.academyFaviconUrl && (
                <button
                  type="button"
                  onClick={() => setOrg({ ...org, academyFaviconUrl: "" })}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 border border-white/10 rounded-xl transition-all cursor-pointer"
                  title="Remove Academy Favicon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <input 
              type="text" 
              placeholder="Or enter academy favicon URL (https://.../favicon.ico)" 
              value={org?.academyFaviconUrl || ""} 
              onChange={(e) => setOrg({ ...org, academyFaviconUrl: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500" 
            />
          </div>
        </div>
      </div>

      {/* ── 6. BANK SETTLEMENT & UPI DETAILS ── */}
      <div className="bg-[#111111] border border-white/10 rounded-3xl p-7 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Bank Settlement & Wire Details</h2>
              <p className="text-xs text-white/50">Printed on invoice footers and payment links for direct NEFT/RTGS/IMPS wire transfers.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase rounded-lg">
            Settlement
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/50">Bank Name</label>
            <input
              type="text"
              value={org?.bankName || ""}
              onChange={(e) => setOrg({ ...org, bankName: e.target.value })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g. HDFC Bank"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/50">Account Holder Name</label>
            <input
              type="text"
              value={org?.accountName || ""}
              onChange={(e) => setOrg({ ...org, accountName: e.target.value })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="Grekam Visuals & Technologies Pvt Ltd"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/50">Account Number</label>
            <input
              type="text"
              value={org?.accountNumber || org?.bankAccountNo || ""}
              onChange={(e) => setOrg({ ...org, accountNumber: e.target.value, bankAccountNo: e.target.value })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              placeholder="50200012345678"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/50">IFSC Code</label>
            <input
              type="text"
              value={org?.ifscCode || org?.bankIfsc || ""}
              onChange={(e) => setOrg({ ...org, ifscCode: e.target.value.toUpperCase(), bankIfsc: e.target.value.toUpperCase() })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
              placeholder="HDFC0001234"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/50">Branch Name</label>
            <input
              type="text"
              value={org?.bankBranch || ""}
              onChange={(e) => setOrg({ ...org, bankBranch: e.target.value })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="Anna Salai Branch, Chennai"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/50">SWIFT / BIC (For International Wire)</label>
            <input
              type="text"
              value={org?.swiftCode || ""}
              onChange={(e) => setOrg({ ...org, swiftCode: e.target.value.toUpperCase() })}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
              placeholder="HDFCINBBXXX"
            />
          </div>
        </div>
      </div>

      {/* Save Button Bar at Bottom */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all min-w-[180px] cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
          {saving ? "Saving Changes..." : saved ? "Changes Saved!" : "Save All Brand Changes"}
        </Button>
      </div>
    </div>
  );
}
