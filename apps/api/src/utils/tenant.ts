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
  const isGlobalSuperAdmin = (user?.role === 'SUPER_ADMIN' || user?.role === 'Super Admin') && !impersonatedTenantId;
  const tenantId = (user?.role === 'SUPER_ADMIN' || user?.role === 'Super Admin')
    ? (impersonatedTenantId || null)
    : (user?.organizationId || null);

  const orgFilter = isGlobalSuperAdmin
    ? {}
    : { organizationId: tenantId || '__NO_ACCESS__' };

  return { user, tenantId, isGlobalSuperAdmin, orgFilter };
}
