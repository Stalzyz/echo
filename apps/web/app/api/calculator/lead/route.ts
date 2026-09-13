import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateWebsiteEstimate, DEFAULT_CALCULATOR_CONFIG, CalculatorState } from '@/lib/calculator/calculator-config';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const state: CalculatorState = body.state;
    const clientDetails = body.customer || {};

    if (!clientDetails.name && !state.customerName) {
      return NextResponse.json({ success: false, error: 'Customer name is required' }, { status: 400 });
    }

    const customerName = clientDetails.name || state.customerName || 'Website Lead';
    const businessName = clientDetails.businessName || state.businessName || '';
    const email = clientDetails.email || state.email || '';
    const phone = clientDetails.phone || state.phone || '';
    const city = clientDetails.city || state.city || '';
    const websiteUrl = clientDetails.websiteUrl || state.websiteUrl || '';
    const additionalNotes = clientDetails.additionalNotes || state.additionalNotes || '';

    // Calculate official estimate
    const estimate = calculateWebsiteEstimate(state, DEFAULT_CALCULATOR_CONFIG);

    // Format comprehensive project brief
    const notesSummary = [
      `### Website Cost Calculator Submission`,
      `**Business Name:** ${businessName || 'N/A'}`,
      `**Customer Name:** ${customerName}`,
      `**Phone:** ${phone || 'N/A'}`,
      `**Email:** ${email || 'N/A'}`,
      `**City:** ${city || 'N/A'}`,
      `**Current Website / Instagram:** ${websiteUrl || 'N/A'}`,
      ``,
      `#### Estimate Details`,
      `- **Website Type:** ${state.websiteType.toUpperCase()}`,
      `- **Pages Tier:** ${state.pageTier}`,
      `- **Design Style:** ${state.designTier.toUpperCase()}`,
      `- **Delivery Timeline:** ${state.deliverySpeed.toUpperCase()}`,
      `- **GST Included:** ${state.includeGst ? 'YES (18%)' : 'NO'}`,
      `- **Estimated One-Time Cost:** ₹${estimate.oneTimeTotal.toLocaleString('en-IN')}`,
      `- **Custom Project Flag:** ${estimate.isCustomProject ? 'YES' : 'NO'}${estimate.customProjectReasons.length ? ` (${estimate.customProjectReasons.join(', ')})` : ''}`,
      ``,
      `#### Recurring Cost Estimates`,
      `- Hosting / Domain: ₹${estimate.yearlyHosting.toLocaleString('en-IN')}/year`,
      `- Maintenance: ₹${estimate.monthlyMaintenance.toLocaleString('en-IN')}/month`,
      `- SEO: ₹${estimate.monthlySeo.toLocaleString('en-IN')}/month`,
      ``,
      `#### Selected Scope & Add-ons`,
      `- Features: ${state.selectedFeatures.length ? state.selectedFeatures.join(', ') : 'None'}`,
      state.selectedEcommerceFeatures.length ? `- E-commerce Features: ${state.selectedEcommerceFeatures.join(', ')}` : null,
      state.selectedEcommerceFeatures.length ? `- Catalogue: ${state.productTier} | Upload: ${state.productUploadTier}` : null,
      `- Integrations: ${state.selectedIntegrations.length ? state.selectedIntegrations.join(', ') : 'None'}${state.customIntegrationText ? ` (${state.customIntegrationText})` : ''}`,
      `- SEO Tier: ${state.seoOption}`,
      `- Content Sourcing: ${state.contentOption} | Images: ${state.imageOption}`,
      `- Branding Tier: ${state.brandingOption}`,
      `- Migration: ${state.migrationOption}`,
      ``,
      additionalNotes ? `#### Additional Client Notes\n${additionalNotes}` : null,
    ].filter(Boolean).join('\n');

    // Create lead in CRM Database
    const lead = await prisma.lead.create({
      data: {
        name: customerName,
        company: businessName || null,
        email: email || null,
        phone: phone || null,
        source: 'WEBSITE',
        businessUnit: 'AGENCY',
        projectType: state.websiteType.toUpperCase(),
        estimatedBudget: estimate.oneTimeTotal,
        notes: notesSummary,
        status: 'NEW',
      },
      select: {
        id: true,
      },
    });

    // Also attempt contact upsert if email is provided
    if (email) {
      try {
        const nameParts = customerName.split(' ');
        const firstName = nameParts[0] || 'Unknown';
        const lastName = nameParts.slice(1).join(' ') || '';

        await (prisma as any).contact.upsert({
          where: { email },
          update: {
            firstName,
            lastName,
            phone: phone || undefined,
          },
          create: {
            firstName,
            lastName,
            email,
            phone: phone || null,
          },
        }).catch(() => {});
      } catch (cErr) {
        // Ignore contact upsert errors if table schema differs
      }
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      estimatedBudget: estimate.oneTimeTotal,
      isCustomProject: estimate.isCustomProject,
      message: 'Estimate saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving calculator lead:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit quote estimate' },
      { status: 500 }
    );
  }
}
