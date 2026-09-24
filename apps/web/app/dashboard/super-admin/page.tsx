"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SuperAdminDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Super Admin root page always redirects to Vendor Management
    router.replace("/dashboard/super-admin/academies")
  }, [router])

  // Show nothing while redirecting
  return null
}
