"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Organization {
  id: string;
  name: string;
  logoUrl?: string | null;
  academyLogoUrl?: string | null;
  faviconUrl?: string | null;
  academyFaviconUrl?: string | null;
  primaryColor: string;
  secondaryColor?: string | null;
  accentColor?: string | null;
  darkModeDefault: boolean;
  supportEmail?: string | null;
  billingAddress?: string | null;
  website?: string | null;
  phone?: string | null;
}

const defaultOrg: Organization = {
  id: "echo-saas-org",
  name: "Echo LMS",
  logoUrl: "/echo_logo.png",
  academyLogoUrl: "/echo_logo.png",
  faviconUrl: "/favicon.ico",
  academyFaviconUrl: "/favicon.ico",
  primaryColor: "#0d9488",
  secondaryColor: "#f59e0b",
  accentColor: "#10b981",
  darkModeDefault: false,
  supportEmail: "support@echolms.com",
  billingAddress: "SaaS Cloud Infrastructure",
  website: "https://echolms.com",
  phone: null,
};

const OrganizationContext = createContext<Organization>(defaultOrg);

export function useOrganization() {
  return useContext(OrganizationContext);
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [org, setOrg] = useState<Organization>(defaultOrg);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

    const applyThemeVariables = (targetOrg: Organization) => {
      if (typeof document === "undefined") return;
      const root = document.documentElement;

      const primary = targetOrg.primaryColor || "#0d9488";
      const secondary = targetOrg.secondaryColor || "#f59e0b";
      const accent = targetOrg.accentColor || "#10b981";

      root.style.setProperty("--org-primary", primary);
      root.style.setProperty("--primary", primary);
      root.style.setProperty("--secondary", secondary);
      root.style.setProperty("--accent", accent);
      root.style.setProperty("--ring", primary);
      root.style.setProperty("--sidebar-primary", primary);
      root.style.setProperty("--sidebar-ring", primary);
      root.style.setProperty("--chart-1", primary);
      root.style.setProperty("--chart-2", secondary);
      root.style.setProperty("--chart-3", accent);
    };

    const fetchOrg = () => {
      fetch(`${API_BASE}/settings/organization`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) {
            const orgData = data.data || data;
            const finalOrg: Organization = {
              ...defaultOrg,
              ...orgData,
              logoUrl: orgData.logoUrl || orgData.academyLogoUrl || "/echo_logo.png",
              academyLogoUrl: orgData.academyLogoUrl || orgData.logoUrl || "/echo_logo.png",
              faviconUrl: orgData.faviconUrl || "/favicon.ico",
              primaryColor: orgData.primaryColor || "#0d9488",
              secondaryColor: orgData.secondaryColor || "#f59e0b",
              accentColor: orgData.accentColor || "#10b981",
            };
            setOrg(finalOrg);
            applyThemeVariables(finalOrg);

            // Update page title
            if (orgData.name) {
              document.title = `${orgData.name} Academy`;
            }

            // Update Academy Favicon dynamically in browser tab
            const activeFavicon = orgData.academyFaviconUrl || orgData.faviconUrl;
            if (activeFavicon && typeof document !== "undefined") {
              let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
              if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                document.getElementsByTagName("head")[0].appendChild(link);
              }
              link.href = activeFavicon;
            }
          }
        })
        .catch(() => {});
    };

    fetchOrg();

    const handleUpdate = (e?: Event) => {
      if (e && (e as CustomEvent).detail) {
        // Optimistic update if event contains details
        const customData = (e as CustomEvent).detail;
        if (customData.primaryColor) {
          setOrg((prev) => {
            const updated = { ...prev, ...customData };
            applyThemeVariables(updated);
            return updated;
          });
        }
      }
      fetchOrg();
    };

    window.addEventListener("organization-updated", handleUpdate);
    return () => window.removeEventListener("organization-updated", handleUpdate);
  }, []);

  return (
    <OrganizationContext.Provider value={org}>
      {children}
    </OrganizationContext.Provider>
  );
}
