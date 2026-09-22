import { FastifyInstance } from 'fastify';
import { z } from 'zod';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

const UpdateFinanceSettingsSchema = z.object({
  baseCurrency:    z.string().nullable().optional().or(z.literal('')),
  currencySymbol:  z.string().nullable().optional().or(z.literal('')),
  taxModel:        z.enum(['GST', 'VAT', 'NONE']).optional(),
  gstNumber:       z.string().nullable().optional().or(z.literal('')),
  panNumber:       z.string().nullable().optional().or(z.literal('')),
  vatNumber:       z.string().nullable().optional().or(z.literal('')),
  fiscalYearStart: z.number().min(1).max(12).optional(),
  invoicePrefix:   z.string().nullable().optional().or(z.literal('')),
  invoiceNextNumber: z.number().min(1).optional(),
});

export default async function financeSettingsRouter(app: FastifyInstance) {
  // GET /api/v1/settings/finance
  app.get('/finance', async (req, reply) => {
    let settings = await app.prisma.financeSettings.findFirst();
    if (!settings) {
      settings = await app.prisma.financeSettings.create({ data: {} });
    }
    const org = await app.prisma.organization.findFirst();
    return { ...settings, panNumber: org?.panNumber || null, currencies: CURRENCIES };

  });

  // PATCH /api/v1/settings/finance
  app.patch('/finance', async (req, reply) => {
    const body = UpdateFinanceSettingsSchema.parse(req.body);
    
    const dataToSave: any = { ...body };
    delete dataToSave.panNumber;
    if (!dataToSave.baseCurrency) delete dataToSave.baseCurrency;
    if (!dataToSave.currencySymbol) delete dataToSave.currencySymbol;
    if (!dataToSave.invoicePrefix) delete dataToSave.invoicePrefix;
    if (dataToSave.gstNumber === '') dataToSave.gstNumber = null;
    if (dataToSave.vatNumber === '') dataToSave.vatNumber = null;


    let settings = await app.prisma.financeSettings.findFirst();
    if (!settings) {
      settings = await app.prisma.financeSettings.create({ data: dataToSave });
    } else {
      settings = await app.prisma.financeSettings.update({
        where: { id: settings.id },
        data: dataToSave,
      });
    }

    // Keep GST and PAN synchronized with Organization if provided
    const orgUpdate: any = {}
    if (body.gstNumber !== undefined) orgUpdate.gstNumber = body.gstNumber || null;
    if (body.panNumber !== undefined) orgUpdate.panNumber = body.panNumber || null;

    if (Object.keys(orgUpdate).length > 0) {
      await app.prisma.organization.updateMany({
        data: orgUpdate
      }).catch(() => {});
    }

    return settings;
  });
}

