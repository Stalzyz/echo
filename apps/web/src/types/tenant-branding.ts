export interface DesignTokens {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  card: string
  text: string
  mutedText: string
  border: string
  link: string
  button: string
  buttonText: string
  success: string
  warning: string
  error: string
  info: string
}

export interface TypographyConfig {
  fontFamily: string
  headingFont: string
  bodyFont: string
  baseFontSize: number
  headingScale: "NORMAL" | "LARGE" | "EXPANSIVE"
}

export interface UIStyleConfig {
  borderRadius: number
  buttonStyle: "ROUNDED" | "PILL" | "SHARP"
  cardStyle: "BORDERED" | "SHADOW" | "FLAT"
  density: "COMPACT" | "COMFORTABLE" | "SPACIOUS"
}

export interface LoginPageBranding {
  logoUrl?: string
  backgroundColor: string
  backgroundImageUrl?: string
  welcomeHeading: string
  description: string
  buttonText: string
  illustrationUrl?: string
  showEchoBranding: boolean
}

export interface TenantBrandIdentity {
  academyName: string
  shortName: string
  tagline: string
  mainLogoUrl?: string
  darkLogoUrl?: string
  lightLogoUrl?: string
  mobileLogoUrl?: string
  loginLogoUrl?: string
  emailLogoUrl?: string
  faviconUrl?: string
  appIconUrl?: string
  ogImageUrl?: string
}

export interface TenantTheme {
  id: string
  tenantId: string
  name: string
  isPublished: boolean
  version: number
  identity: TenantBrandIdentity
  colors: DesignTokens
  darkColors: DesignTokens
  typography: TypographyConfig
  uiStyle: UIStyleConfig
  loginPage: LoginPageBranding
  updatedAt: string
}

export interface PlanFeatureMatrix {
  planId: "STARTER" | "GROWTH" | "ENTERPRISE"
  planName: string
  allowCustomLogo: boolean
  allowCustomFavicon: boolean
  allowBasicColors: boolean
  allowFullColors: boolean
  allowDarkMode: boolean
  allowCustomLogin: boolean
  allowCustomDomain: boolean
  allowEmailWhiteLabel: boolean
  allowRemoveEchoBranding: boolean
  allowMobileAppBranding: boolean
}

export interface VendorWhiteLabelOverride {
  tenantId: string
  academyName: string
  subdomain: string
  whiteLabelEnabled: boolean
  customDomainAllowed: boolean
  customBrandingAllowed: boolean
  removeEchoBrandingAllowed: boolean
  emailWhiteLabelAllowed: boolean
  appWhiteLabelAllowed: boolean
  customDomain?: string
  cnameVerified: boolean
  sslStatus: "ACTIVE" | "PROVISIONING" | "FAILED"
}

export interface EchoBrandingPlacement {
  location: "LOGIN" | "DASHBOARD" | "SIDEBAR" | "FOOTER" | "EMAIL" | "CERTIFICATES" | "PUBLIC_PAGES" | "ERROR_PAGES"
  label: string
  rule: "ALWAYS_GECHO" | "VENDOR_BRANDING" | "HIDDEN"
}

export interface ThemeVersionHistory {
  version: number
  publishedAt: string
  publishedBy: string
  summary: string
  theme: TenantTheme
}
