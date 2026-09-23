"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import SuperAdminLoginPage from "../../../super-admin/login/page"

export default function AdminLoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/super-admin/login")
  }, [router])

  return <SuperAdminLoginPage />
}
