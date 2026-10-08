import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getTenantContext } from '../utils/tenant';

const UpdateOrganizationSchema = z.object({
  name: z.string().optional(),
  companyName: z.string().nullable().optional().or(z.literal('')),
  panNumber: z.string().nullable().optional().or(z.literal('')),
  gstNumber: z.string().nullable().optional().or(z.literal('')),
  logoUrl: z.string().nullable().optional().or(z.literal('')),
  faviconUrl: z.string().nullable().optional().or(z.literal('')),
  academyLogoUrl: z.string().nullable().optional().or(z.literal('')),
  academyFaviconUrl: z.string().nullable().optional().or(z.literal('')),
  primaryColor: z.string().nullable().optional().or(z.literal('')),
  secondaryColor: z.string().nullable().optional().or(z.literal('')),
  accentColor: z.string().nullable().optional().or(z.literal('')),
  darkModeDefault: z.boolean().optional(),
  supportEmail: z.string().email().nullable().optional().or(z.literal('')),
  billingAddress: z.string().nullable().optional().or(z.literal('')),
  website: z.string().nullable().optional().or(z.literal('')),
  phone: z.string().nullable().optional().or(z.literal('')),
  instagramUrl: z.string().nullable().optional().or(z.literal('')),
  youtubeUrl: z.string().nullable().optional().or(z.literal('')),
  linkedinUrl: z.string().nullable().optional().or(z.literal('')),
  twitterUrl: z.string().nullable().optional().or(z.literal('')),
  facebookUrl: z.string().nullable().optional().or(z.literal('')),
  whatsappNumber: z.string().nullable().optional().or(z.literal('')),
  openAiKey: z.string().nullable().optional().or(z.literal('')),
  resendApiKey: z.string().nullable().optional().or(z.literal('')),
  bankName: z.string().nullable().optional().or(z.literal('')),
  accountName: z.string().nullable().optional().or(z.literal('')),
  accountNumber: z.string().nullable().optional().or(z.literal('')),
  ifscCode: z.string().nullable().optional().or(z.literal('')),
  swiftCode: z.string().nullable().optional().or(z.literal('')),
  bankBranch: z.string().nullable().optional().or(z.literal('')),
});

export default async function organizationRouter(app: FastifyInstance) {
  // GET /api/v1/settings/organization — Get organization branding scoped to tenant
  app.get('/organization', async (req, reply) => {
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    let org: any = null;

    if (tenantId) {
      // Tenant-scoped: return THIS academy's organization record
      org = await app.prisma.organization.findUnique({
        where: { id: tenantId }
      });
    } else if (isGlobalSuperAdmin) {
      org = await app.prisma.organization.findFirst();
    }

    if (!org) {
      return reply.notFound('Organization not found');
    }

    return {
      ...org,
      name: org.name || "Echo LMS",
      logoUrl: org.logoUrl || "/echo_logo.png",
      academyLogoUrl: org.academyLogoUrl || "/echo_logo.png",
      faviconUrl: org.faviconUrl || "/favicon.ico",
      academyFaviconUrl: org.academyFaviconUrl || "/favicon.ico",
      primaryColor: org.primaryColor || "#0d9488",
      secondaryColor: org.secondaryColor || "#f59e0b",
      accentColor: org.accentColor || "#10b981",
    };
  });

  // PATCH /api/v1/settings/organization — Update the organization branding
  app.patch('/organization', async (req, reply) => {
    const { tenantId, isGlobalSuperAdmin } = getTenantContext(req);

    let targetOrgId = tenantId;
    if (!targetOrgId && isGlobalSuperAdmin) {
      const firstOrg = await app.prisma.organization.findFirst();
      targetOrgId = firstOrg?.id || null;
    }

    if (!targetOrgId) {
      return reply.code(403).send({ error: 'Forbidden', message: 'No organization available to update' });
    }

    const body = UpdateOrganizationSchema.parse(req.body);
    
    const dataToSave: any = { ...body };
    if (!dataToSave.primaryColor) delete dataToSave.primaryColor;
    if (!dataToSave.secondaryColor) delete dataToSave.secondaryColor;
    if (!dataToSave.accentColor) delete dataToSave.accentColor;
    if (!dataToSave.name) delete dataToSave.name;

    const org = await app.prisma.organization.update({
      where: { id: targetOrgId },
      data: dataToSave,
    });

    // Keep GST synchronized with FinanceSettings if provided
    if (body.gstNumber !== undefined) {
      await app.prisma.financeSettings.updateMany({
        data: { gstNumber: body.gstNumber || null }
      }).catch(() => {});
    }

    return org;
  });
}
