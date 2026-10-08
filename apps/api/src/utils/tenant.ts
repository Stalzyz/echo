import * as cookie from 'cookie';

export interface TenantContext {
  user: any;
  tenantId: string | null;
  isGlobalSuperAdmin: boolean;
  orgFilter: Record<string, any>;
}

export function getTenantContext(req: any): TenantContext {
  const user = req.user;
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'Super Admin';
  const cookies = cookie.parse(req.headers?.cookie || '');
  const impersonatedTenantId = isSuperAdmin ? cookies['echo_impersonate_tenant'] : null;
  const headerTenantId = isSuperAdmin ? req.headers?.['x-tenant-id'] : null;

  let tenantId: string | null = null;

  if (isSuperAdmin) {
    if (headerTenantId) {
      tenantId = headerTenantId;
    } else if (impersonatedTenantId) {
      tenantId = impersonatedTenantId;
    } else {
      tenantId = null; // Global view for Super Admin if no impersonation
    }
  } else {
    // Non-super admin is ALWAYS bound strictly to their user.organizationId
    tenantId = user?.organizationId || null;
  }

  const isGlobalSuperAdmin = isSuperAdmin && !tenantId;

  const orgFilter = tenantId
    ? { organizationId: tenantId }
    : (isGlobalSuperAdmin ? {} : { organizationId: '__NO_ACCESS__' });

  return { user, tenantId, isGlobalSuperAdmin, orgFilter };
}
