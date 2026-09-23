import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const organizations = await prisma.organization.findMany({
      include: {
        users: {
          select: {
            id: true,
            role: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const academies = await Promise.all(organizations.map(async (org) => {
      const totalUsers = org.users.length
      const studentsCount = org.users.filter(u => u.role === 'STUDENT').length
      const admin = org.users.find(u => u.role === 'ADMIN') || org.users[0]
      
      const coursesCount = await prisma.course.count({
        where: { organizationId: org.id }
      })

      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        domain: org.domain || `${org.slug}.echolms.com`,
        status: org.status || 'ACTIVE',
        subscription: org.subscription || 'PRO',
        ownerName: org.ownerName || (admin ? `${admin.firstName} ${admin.lastName}` : 'N/A'),
        ownerEmail: org.ownerEmail || (admin ? admin.email : 'N/A'),
        ownerPhone: org.ownerPhone || 'N/A',
        totalUsers,
        studentsCount,
        coursesCount,
        revenue: `₹${(studentsCount * 12500).toLocaleString()}`,
        createdAt: org.createdAt.toISOString()
      }
    }))

    return NextResponse.json({ academies })
  } catch (error: any) {
    console.error("Error listing academies:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch academies" }, { status: 500 })
  }
}
