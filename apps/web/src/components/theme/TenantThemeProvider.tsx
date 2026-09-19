"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { TenantTheme, DesignTokens } from "@/types/tenant-branding"

export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  primary: "#0d9488",
  secondary: "#f59e0b",
  accent: "#6366f1",
  background: "#f8fafc",
  surface: "#ffffff",
  card: "#ffffff",
  text: "#0f172a",
  mutedText: "#64748b",
  border: "#e2e8f0",
  link: "#0d9488",
  button: "#0d9488",
  buttonText: "#ffffff",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
}

export const DEFAULT_TENANT_THEME: TenantTheme = {
  id: "theme-default",
  tenantId: "tenant-echo",
  name: "Echo Academy Default",
  isPublished: true,
  version: 1,
  identity: {
    academyName: "Echo Academy",
    shortName: "Echo",
    tagline: "Empowering Next-Gen Learners & Educators",
    mainLogoUrl: "",
    faviconUrl: "",
  },
  colors: DEFAULT_DESIGN_TOKENS,
  darkColors: {
    ...DEFAULT_DESIGN_TOKENS,
    background: "#0f172a",
    surface: "#1e293b",
    card: "#1e293b",
    text: "#f8fafc",
    mutedText: "#94a3b8",
    border: "#334155",
  },
  typography: {
    fontFamily: "Inter",
    headingFont: "Inter",
    bodyFont: "Inter",
    baseFontSize: 16,
    headingScale: "NORMAL",
  },
  uiStyle: {
    borderRadius: 12,
    buttonStyle: "ROUNDED",
    cardStyle: "BORDERED",
    density: "COMFORTABLE",
  },
  loginPage: {
    backgroundColor: "#f8fafc",
    welcomeHeading: "Welcome to Echo LMS",
    description: "Sign in to access your courses, live studio, and CRM.",
    buttonText: "Sign In to Academy",
    showGechoBranding: true,
  },
  updatedAt: new Date().toISOString(),
}

interface TenantThemeContextType {
  theme: TenantTheme
  setTheme: React.Dispatch<React.SetStateAction<TenantTheme>>
  applyTokensToElement: (element: HTMLElement, tokens: DesignTokens, borderRadius: number, fontFamily: string) => void
  resetToDefault: () => void
}

const TenantThemeContext = createContext<TenantThemeContextType | undefined>(undefined)

export function TenantThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<TenantTheme>(DEFAULT_TENANT_THEME)

  const applyTokensToElement = (element: HTMLElement, tokens: DesignTokens, borderRadius: number, fontFamily: string) => {
    if (!element) return
    element.style.setProperty("--color-primary", tokens.primary)
    element.style.setProperty("--color-secondary", tokens.secondary)
    element.style.setProperty("--color-accent", tokens.accent)
    element.style.setProperty("--color-background", tokens.background)
    element.style.setProperty("--color-surface", tokens.surface)
    element.style.setProperty("--color-card", tokens.card)
    element.style.setProperty("--color-text", tokens.text)
    element.style.setProperty("--color-muted", tokens.mutedText)
    element.style.setProperty("--color-border", tokens.border)
    element.style.setProperty("--color-link", tokens.link)
    element.style.setProperty("--color-button", tokens.button)
    element.style.setProperty("--color-button-text", tokens.buttonText)
    element.style.setProperty("--color-success", tokens.success)
    element.style.setProperty("--color-warning", tokens.warning)
    element.style.setProperty("--color-error", tokens.error)
    element.style.setProperty("--color-info", tokens.info)
    element.style.setProperty("--border-radius", `${borderRadius}px`)
    element.style.setProperty("--font-family", fontFamily)
  }

  useEffect(() => {
    applyTokensToElement(document.documentElement, theme.colors, theme.uiStyle.borderRadius, theme.typography.fontFamily)
  }, [theme])

  const resetToDefault = () => {
    setTheme(DEFAULT_TENANT_THEME)
  }

  return (
    <TenantThemeContext.Provider value={{ theme, setTheme, applyTokensToElement, resetToDefault }}>
      {children}
    </TenantThemeContext.Provider>
  )
}

export function useTenantTheme() {
  const context = useContext(TenantThemeContext)
  if (!context) {
    throw new Error("useTenantTheme must be used within a TenantThemeProvider")
  }
  return context
}
