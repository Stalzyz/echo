"use client";

import { useEffect, useState } from "react";
import { ApiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, Palette, Image as ImageIcon, CheckCircle, BookOpen, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const THEME_PRESETS = [
  { name: "Echo Teal", primary: "#0d9488", secondary: "#f59e0b", accent: "#10b981" },
  { name: "Royal Indigo", primary: "#4f46e5", secondary: "#ec4899", accent: "#3b82f6" },
  { name: "Violet Studio", primary: "#7c3aed", secondary: "#f59e0b", accent: "#06b6d4" },
  { name: "Emerald Learn", primary: "#059669", secondary: "#d97706", accent: "#3b82f6" },
  { name: "Sunset Amber", primary: "#d97706", secondary: "#7c3aed", accent: "#10b981" },
  { name: "Crimson Red", primary: "#dc2626", secondary: "#f59e0b", accent: "#6366f1" },
];

export default function OrganizationSettingsPage() {
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    ApiClient.get("/settings/organization")
      .then((data) => {
        setOrg(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const triggerLiveThemeUpdate = (updatedOrg: any) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("organization-updated", {
          detail: {
            primaryColor: updatedOrg.primaryColor,
            secondaryColor: updatedOrg.secondaryColor,
            accentColor: updatedOrg.accentColor,
            name: updatedOrg.name,
          },
        })
      );
    }
  };

  const handleColorChange = (field: string, val: string) => {
    const updated = { ...org, [field]: val };
    setOrg(updated);
    triggerLiveThemeUpdate(updated);
  };

  const applyPreset = (preset: typeof THEME_PRESETS[0]) => {
    const updated = {
      ...org,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    };
    setOrg(updated);
    triggerLiveThemeUpdate(updated);
    toast.success(`Applied ${preset.name} color theme!`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {
        name: org.name || "",
        primaryColor: org.primaryColor || "#0d9488",
        secondaryColor: org.secondaryColor || "#f59e0b",
        accentColor: org.accentColor || "#10b981",
      };
      if (org.logoUrl) payload.logoUrl = org.logoUrl;
      if (org.faviconUrl) payload.faviconUrl = org.faviconUrl;
      if (org.supportEmail) payload.supportEmail = org.supportEmail;
      if (org.billingAddress) payload.billingAddress = org.billingAddress;
      if (org.darkModeDefault !== undefined) payload.darkModeDefault = org.darkModeDefault;
      if (org.openAiKey !== undefined) payload.openAiKey = org.openAiKey;
      if (org.resendApiKey !== undefined) payload.resendApiKey = org.resendApiKey;

      const updated = await ApiClient.patch("/settings/organization", payload);
      setOrg(updated);
      setSaved(true);
      triggerLiveThemeUpdate(updated);
      toast.success("Organization theme settings published live!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logoUrl" | "faviconUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === "logoUrl") setUploadingLogo(true);
    else setUploadingFavicon(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await ApiClient.post("/storage/upload-local", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.downloadUrl) {
        setOrg({ ...org, [field]: res.downloadUrl });
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("No download URL returned");
      }
    } catch (err: any) {
      console.error("Upload failed", err);
      toast.error("Upload failed. Please check console.");
    } finally {
      if (field === "logoUrl") setUploadingLogo(false);
      else setUploadingFavicon(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const primaryCol = org?.primaryColor || "#0d9488";
  const secondaryCol = org?.secondaryColor || "#f59e0b";
  const accentCol = org?.accentColor || "#10b981";

  return (
    <div className="flex-1 overflow-y-auto h-full bg-slate-50 text-slate-900 custom-scrollbar">
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organization Theme & Whitelabel</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Configure unified color palettes, brand assets, and platform identity for your organization.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            style={{ backgroundColor: primaryCol }}
            className="text-white font-bold text-xs rounded-xl shadow-sm px-6 py-2.5 transition-all hover:opacity-90"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" /> Saved!
              </>
            ) : (
              "Publish Theme Settings"
            )}
          </Button>
        </div>

        <div className="space-y-8">
          
          {/* Theme & Color Palettes Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" style={{ color: primaryCol }} /> Unified Color Theme
              </h2>
              <span className="text-[11px] font-bold text-slate-400">Live Global Sync Enabled</span>
            </div>

            {/* Presets */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-3 uppercase tracking-wider">
                Select Theme Preset
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {THEME_PRESETS.map((p) => {
                  const isSelected = org?.primaryColor === p.primary;
                  return (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-slate-50 font-bold border-2"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                      style={{ borderColor: isSelected ? p.primary : undefined }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.primary }} />
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.secondary }} />
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.accent }} />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{p.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4" style={{ color: p.primary }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              
              <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <label className="text-xs font-bold text-slate-800 block">Primary Color</label>
                <p className="text-[11px] text-slate-500">Buttons, active tabs, header elements, links</p>
                <div className="flex items-center space-x-3 pt-1">
                  <input
                    type="color"
                    value={primaryCol}
                    onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={primaryCol}
                    onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <label className="text-xs font-bold text-slate-800 block">Secondary Color</label>
                <p className="text-[11px] text-slate-500">Highlights, badges, secondary callouts</p>
                <div className="flex items-center space-x-3 pt-1">
                  <input
                    type="color"
                    value={secondaryCol}
                    onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={secondaryCol}
                    onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <label className="text-xs font-bold text-slate-800 block">Accent Color</label>
                <p className="text-[11px] text-slate-500">Status tags, progress bars, chart indicators</p>
                <div className="flex items-center space-x-3 pt-1">
                  <input
                    type="color"
                    value={accentCol}
                    onChange={(e) => handleColorChange("accentColor", e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={accentCol}
                    onChange={(e) => handleColorChange("accentColor", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

            </div>

            {/* Live Interactive Preview Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">Live Application UI Preview</span>
                <span className="text-[10px] font-bold text-slate-400">Updates live when colors change</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs" style={{ backgroundColor: primaryCol }}>
                      {org?.name?.slice(0, 1) || "G"}
                    </div>
                    <span className="font-bold text-sm text-slate-900">{org?.name || "Echo LMS"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${secondaryCol}20`, color: secondaryCol }}>
                      PRO SAAS
                    </span>
                    <button className="px-3 py-1.5 text-white text-xs font-bold rounded-lg shadow-xs" style={{ backgroundColor: primaryCol }}>
                      Action Button
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs border-b border-slate-100 pb-3">
                  <span className="px-3 py-1 rounded-lg font-bold text-white shadow-2xs" style={{ backgroundColor: primaryCol }}>
                    Active Tab
                  </span>
                  <span className="px-3 py-1 text-slate-500 font-medium hover:bg-slate-100 rounded-lg">
                    Inactive Tab
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 border rounded-xl" style={{ backgroundColor: `${primaryCol}08`, borderColor: `${primaryCol}30` }}>
                    <span className="font-bold block" style={{ color: primaryCol }}>Primary Component Highlight</span>
                    <span className="text-slate-500 text-[11px]">Sub-text themed dynamically</span>
                  </div>
                  <div className="p-3 border rounded-xl" style={{ backgroundColor: `${accentCol}10`, borderColor: `${accentCol}40` }}>
                    <span className="font-bold block" style={{ color: accentCol }}>Accent Feature Tag</span>
                    <span className="text-slate-500 text-[11px]">Accent color highlight</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Branding & Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-4">
              Organization Metadata
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">OS / Academy Display Name</label>
                <input
                  type="text"
                  value={org?.name || ""}
                  onChange={(e) => setOrg({ ...org, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                  placeholder="e.g. Grekam Academy"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Support Email</label>
                <input
                  type="email"
                  value={org?.supportEmail || ""}
                  onChange={(e) => setOrg({ ...org, supportEmail: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                  placeholder="contact@grekam.in"
                />
              </div>
            </div>
          </div>

          {/* Assets Upload */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-600" /> Logotype & Favicon Assets
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Main Logo URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={org?.logoUrl || ""}
                    onChange={(e) => setOrg({ ...org, logoUrl: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                    placeholder="https://cdn.example.com/logo.png"
                  />
                  <label className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl cursor-pointer flex items-center justify-center text-xs font-bold min-w-[90px] transition-colors">
                    {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Upload"}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "logoUrl")} />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Favicon Icon URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={org?.faviconUrl || ""}
                    onChange={(e) => setOrg({ ...org, faviconUrl: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
                    placeholder="https://cdn.example.com/favicon.ico"
                  />
                  <label className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl cursor-pointer flex items-center justify-center text-xs font-bold min-w-[90px] transition-colors">
                    {uploadingFavicon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Upload"}
                    <input type="file" className="hidden" accept="image/*, .ico" onChange={(e) => handleUpload(e, "faviconUrl")} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              style={{ backgroundColor: primaryCol }}
              className="text-white font-bold text-xs rounded-xl shadow-sm px-8 py-3 transition-all hover:opacity-90"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" /> Saved & Synced!
                </>
              ) : (
                "Save Organization Theme Settings"
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

