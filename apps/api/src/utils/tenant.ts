import * as cookie from 'cookie';

export interface TenantContext {
  user: any;
  tenantId: string | null;
  isGlobalSuperAdmin: boolean;
  orgFilter: Record<string, any>;
}

export function getTenantContext(req: any): TenantContext {
  const user = req.user;
  const cookies = cookie.parse(req.headers?.cookie || '');
  const impersonatedTenantId = cookies['echo_impersonate_tenant'];
  const headerTenantId = req.headers?.['x-tenant-id'];
  const headerTenantSlug = req.headers?.['x-tenant-slug'];

  let tenantId: string | null = null;

  if (headerTenantId) {
    tenantId = headerTenantId;
  } else if (impersonatedTenantId) {
    tenantId = impersonatedTenantId;
  } else if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'Super Admin') {
    tenantId = user?.organizationId || null;
  }

  const isGlobalSuperAdmin = (user?.role === 'SUPER_ADMIN' || user?.role === 'Super Admin') && !tenantId;

  const orgFilter = tenantId
    ? { organizationId: tenantId }
    : (isGlobalSuperAdmin ? {} : { organizationId: '__NO_ACCESS__' });

  return { user, tenantId, isGlobalSuperAdmin, orgFilter };
}
