"use client";

import { useApi } from  "./useApi";

export interface Organization {
  id: string;
  name: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  supportEmail?: string | null;
  billingAddress?: string | null;
}

export const ORG_FALLBACK: Organization = {
  id: "echo-default",
  name: "Echo LMS",
  logoUrl: null,
  primaryColor: "#0d9488",
};

/**
 * Hook to fetch the current organization's branding settings.
 * Falls back to sensible defaults while loading.
 */
export function useOrganization() {
  const { data, isLoading, error } = useApi<Organization>("/settings/organization");

  return {
    org: data ?? ORG_FALLBACK,
    isLoading,
    error,
  };
}
