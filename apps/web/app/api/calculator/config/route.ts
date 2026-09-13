import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_CALCULATOR_CONFIG, CalculatorConfig } from '@/lib/calculator/calculator-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const page = await prisma.landingPage.findUnique({
      where: { slug: 'agency' },
      include: {
        sections: {
          where: { sectionId: 'calculator-config' },
        },
      },
    });

    if (page?.sections?.[0]?.content) {
      const savedConfig = page.sections[0].content as Partial<CalculatorConfig>;
      // Merge with default to guarantee complete structure
      const mergedConfig: CalculatorConfig = {
        ...DEFAULT_CALCULATOR_CONFIG,
        ...savedConfig,
      };
      return NextResponse.json({ success: true, config: mergedConfig });
    }
  } catch (error) {
    console.error('Error loading calculator config from DB:', error);
  }

  return NextResponse.json({ success: true, config: DEFAULT_CALCULATOR_CONFIG });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid config payload' }, { status: 400 });
    }

    let page = await prisma.landingPage.findUnique({
      where: { slug: 'agency' },
      include: {
        sections: {
          where: { sectionId: 'calculator-config' },
        },
      },
    });

    if (!page) {
      page = await prisma.landingPage.create({
        data: {
          slug: 'agency',
          title: 'Grekam Visuals Agency',
        },
        include: {
          sections: true,
        },
      });
    }

    const existingSection = page.sections?.find(s => s.sectionId === 'calculator-config');

    if (existingSection) {
      await prisma.pageSection.update({
        where: { id: existingSection.id },
        data: {
          content: body,
        },
      });
    } else {
      await prisma.pageSection.create({
        data: {
          landingPageId: page.id,
          sectionId: 'calculator-config',
          sortOrder: 99,
          content: body,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Calculator pricing updated successfully' });
  } catch (error: any) {
    console.error('Error saving calculator config:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update config' }, { status: 500 });
  }
}
