import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getTenantFilter } from "@/lib/tenant"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const slugParam = searchParams.get("slug") || req.headers.get("x-tenant-slug")

    let org: any = null

    if (slugParam) {
      org = await prisma.organization.findFirst({
        where: { OR: [{ slug: slugParam }, { domain: slugParam }] },
        include: { tenantSubscription: { include: { plan: true } } }
      })
    }

    if (!org) {
      const tenantFilter = await getTenantFilter()
      let activeTenantId = tenantFilter.organizationId !== '__NO_ACCESS__' ? tenantFilter.organizationId : null

      if (!activeTenantId && session.user.organizationId) {
        activeTenantId = session.user.organizationId
      }

      if (activeTenantId) {
        org = await prisma.organization.findUnique({
          where: { id: activeTenantId },
          include: { tenantSubscription: { include: { plan: true } } }
        })
      }
    }

    // Fallback ONLY for Super Admin outside tenant context
    if (!org && (session.user.role === 'SUPER_ADMIN' || session.user.role === 'Super Admin')) {
      org = await prisma.organization.findFirst({
        include: { tenantSubscription: { include: { plan: true } } }
      })
    }

    if (!org) {
      return NextResponse.json({
        id: "default",
        name: "Echo LMS",
        companyName: "Echo LMS Platform",
        logoUrl: "/echo_logo.png",
        academyLogoUrl: "/echo_logo.png",
        faviconUrl: "/favicon.ico",
        academyFaviconUrl: "/favicon.ico",
        primaryColor: "#0d9488",
        secondaryColor: "#f59e0b",
        accentColor: "#10b981",
        darkModeDefault: false,
        supportEmail: "support@echolms.com",
        subscription: "GROWTH",
        plan: null,
      })
    }

    const subPlan = org.tenantSubscription?.plan

    return NextResponse.json({
      ...org,
      name: org.name || "Echo LMS",
      logoUrl: org.logoUrl || "/echo_logo.png",
      academyLogoUrl: org.academyLogoUrl || "/echo_logo.png",
      faviconUrl: org.faviconUrl || "/favicon.ico",
      academyFaviconUrl: org.academyFaviconUrl || "/favicon.ico",
      primaryColor: org.primaryColor || "#0d9488",
      secondaryColor: org.secondaryColor || "#f59e0b",
      accentColor: org.accentColor || "#10b981",
      subscription: org.subscription || (subPlan ? subPlan.slug.toUpperCase() : "STARTER"),
      plan: subPlan ? {
        id: subPlan.id,
        name: subPlan.name,
        slug: subPlan.slug,
        badgeText: subPlan.badgeText,
        features: subPlan.features,
        maxStudents: subPlan.maxStudents,
        maxCourses: subPlan.maxCourses,
        maxBatches: subPlan.maxBatches,
        maxStaff: subPlan.maxStaff,
        maxStorageGB: subPlan.maxStorageGB,
      } : null
    })
  } catch (error: any) {
    console.error("Error in GET /api/v1/settings/organization:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch organization settings" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantFilter = await getTenantFilter()
    let activeTenantId = tenantFilter.organizationId !== '__NO_ACCESS__' ? tenantFilter.organizationId : null

    if (!activeTenantId && session.user.organizationId) {
      activeTenantId = session.user.organizationId
    }

    const body = await req.json()
    const dataToSave: any = { ...body }
    
    // Clean empty optional fields if necessary
    if (dataToSave.primaryColor === "") delete dataToSave.primaryColor
    if (dataToSave.secondaryColor === "") delete dataToSave.secondaryColor
    if (dataToSave.accentColor === "") delete dataToSave.accentColor

    let targetOrgId = activeTenantId

    if (!targetOrgId && session.user.role === 'SUPER_ADMIN') {
      const firstOrg = await prisma.organization.findFirst()
      targetOrgId = firstOrg?.id || null
    }

    if (!targetOrgId) {
      return NextResponse.json({ error: "Organization not found for update" }, { status: 404 })
    }

    const updatedOrg = await prisma.organization.update({
      where: { id: targetOrgId },
      data: dataToSave,
    })

    if (body.gstNumber !== undefined) {
      await prisma.financeSettings.updateMany({
        data: { gstNumber: body.gstNumber || null }
      }).catch(() => {})
    }

    return NextResponse.json(updatedOrg)
  } catch (error: any) {
    console.error("Error in PATCH /api/v1/settings/organization:", error)
    return NextResponse.json({ error: error.message || "Failed to update organization settings" }, { status: 500 })
  }
}
