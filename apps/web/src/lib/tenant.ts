import { auth } from "@/auth"

export async function getTenantFilter() {
  const session = await auth()
  if (!session?.user) {
    return { organizationId: "__NO_ACCESS__" }
  }

  // Super Admin not impersonating sees all tenant records
  if (session.user.role === 'SUPER_ADMIN' && !session.user.impersonatedBySuperAdmin) {
    return {}
  }

  const tenantId = session.user.organizationId || session.user.tenantId
  if (!tenantId) {
    return { organizationId: null }
  }

  return { organizationId: tenantId }
}
