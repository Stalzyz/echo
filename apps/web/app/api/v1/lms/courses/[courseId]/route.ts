import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> | { courseId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const courseId = resolvedParams?.courseId

    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 })
    }

    // Try finding by LMSCourse ID or Course ID
    let lmsCourse = await prisma.lMSCourse.findFirst({
      where: {
        OR: [
          { id: courseId },
          { courseId: courseId }
        ]
      },
      include: {
        course: true,
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' }
            }
          }
        }
      }
    })

    // If not found, check if a base Course exists
    if (!lmsCourse) {
      const baseCourse = await prisma.course.findUnique({
        where: { id: courseId }
      })

      if (baseCourse) {
        lmsCourse = await prisma.lMSCourse.findUnique({
          where: { courseId: baseCourse.id },
          include: {
            course: true,
            modules: {
              orderBy: { sortOrder: 'asc' },
              include: {
                lessons: {
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          }
        })
      }
    }

    // Fallback: if courseId is 'default-course' or not found, find the most relevant existing course
    if (!lmsCourse) {
      lmsCourse = await prisma.lMSCourse.findFirst({
        orderBy: { updatedAt: 'desc' },
        include: {
          course: true,
          modules: {
            orderBy: { sortOrder: 'asc' },
            include: {
              lessons: {
                orderBy: { sortOrder: 'asc' }
              }
            }
          }
        }
      })
    }

    if (!lmsCourse) {
      return NextResponse.json({ error: "No courses found" }, { status: 404 })
    }

    // Format modules and lessons for player
    const formattedModules = lmsCourse.modules.map(mod => ({
      id: mod.id,
      title: mod.title,
      lessons: mod.lessons.map(les => ({
        id: les.id,
        title: les.title,
        duration: les.duration ? `${les.duration} mins` : "10:00",
        videoUrl: les.contentUrl || "",
        description: les.description || "",
        richText: les.richText || "",
        type: les.type ? les.type.toLowerCase() : "video",
        isCompleted: false
      }))
    }))

    return NextResponse.json({
      course: {
        id: lmsCourse.courseId || lmsCourse.id,
        title: lmsCourse.course?.name || "LMS Course",
        code: lmsCourse.course?.code,
        description: lmsCourse.course?.description,
        thumbnail: lmsCourse.thumbnail,
        trailerUrl: lmsCourse.trailerVideoId,
        isPublished: lmsCourse.isPublished
      },
      modules: formattedModules,
      progress: 0
    })
  } catch (error: any) {
    console.error("Error fetching student course data:", error)
    return NextResponse.json({ error: error.message || "Failed to load course" }, { status: 500 })
  }
}
