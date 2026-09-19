import { redirect } from "next/navigation"

export default function SuperAdminRootPage() {
  redirect("/dashboard/super-admin/vendors")
}
