import { auth } from "@/auth"
import { cookies } from "next/headers"

export async function getTenantFilter() {
  const session = await auth()
  if (!session?.user) {
    return { organizationId: "__NO_ACCESS__" }
  }

  const cookieStore = await cookies()
  const impersonatedTenantId = cookieStore.get('echo_impersonate_tenant')?.value

  // Super Admin handling:
  if (session.user.role === 'SUPER_ADMIN' || session.user.role === 'Super Admin') {
    const activeTenantId = impersonatedTenantId || session.user.tenantId || session.user.organizationId
    if (activeTenantId && (session.user.impersonatedBySuperAdmin || impersonatedTenantId)) {
      return { organizationId: activeTenantId }
    }
    // Global view: sees all records
    return {}
  }

  // Regular tenant user (Academy Admin, Educator, Student, etc.):
  // Strictly bound to their own organizationId — ignore any impersonation cookies
  const tenantId = session.user.organizationId
  if (!tenantId) {
    return { organizationId: "__NO_ACCESS__" }
  }

  return { organizationId: tenantId }
}

