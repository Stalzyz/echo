"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
export type LessonType = "VIDEO" | "RICH_TEXT" | "QUIZ" | "PDF" | string

async function getOrCreateLmsCourse(courseOrLmsId: string) {
  try {
    // 1. Try finding by LMSCourse ID
    let lmsCourse = await prisma.lMSCourse.findUnique({ where: { id: courseOrLmsId } }).catch(() => null)
    
    // 2. Try finding by courseId
    if (!lmsCourse) {
      lmsCourse = await prisma.lMSCourse.findUnique({ where: { courseId: courseOrLmsId } }).catch(() => null)
    }

    // 3. If missing, look up base course or create starter course
    if (!lmsCourse) {
      let baseCourse = await prisma.course.findUnique({ where: { id: courseOrLmsId } }).catch(() => null)
      if (!baseCourse) {
        baseCourse = await prisma.course.findFirst().catch(() => null)
      }
      if (!baseCourse) {
        baseCourse = await prisma.course.create({
          data: {
            name: "Masterclass Course",
            code: `MC-${Date.now().toString().slice(-4)}`,
            duration: "3 Months",
            fee: 50000
          }
        }).catch(() => null)
      }

      if (baseCourse) {
        lmsCourse = await prisma.lMSCourse.upsert({
          where: { courseId: baseCourse.id },
          create: {
            courseId: baseCourse.id,
            draftStatus: "DRAFT",
            outcomes: [],
            prerequisites: []
          },
          update: {}
        }).catch(() => null)
      }
    }

    return lmsCourse
  } catch (err) {
    console.error("Error in getOrCreateLmsCourse:", err)
    return null
  }
}

export async function createModule(lmsCourseId: string, title: string) {
  try {
    const lmsCourse = await getOrCreateLmsCourse(lmsCourseId)
    if (!lmsCourse) return null

    const existingModules = await prisma.lMSModule.findMany({
      where: { lmsCourseId: lmsCourse.id },
      orderBy: { sortOrder: 'desc' },
      take: 1
    }).catch(() => [])
    
    const sortOrder = existingModules.length > 0 ? (existingModules[0]?.sortOrder ?? -1) + 1 : 0

    const newModule = await prisma.lMSModule.create({
      data: {
        lmsCourseId: lmsCourse.id,
        title,
        sortOrder,
      }
    })

    try {
      revalidatePath(`/dashboard/studio/courses/builder/${lmsCourseId}`)
      revalidatePath(`/dashboard/studio/courses/builder/${lmsCourse.courseId}`)
    } catch {}

    return newModule
  } catch (err) {
    console.error("Error creating module:", err)
    return null
  }
}

export async function updateModule(id: string, title: string) {
  try {
    const module = await prisma.lMSModule.update({
      where: { id },
      data: { title }
    }).catch(() => null)

    if (module) {
      try {
        revalidatePath(`/dashboard/studio/courses/builder/${module.lmsCourseId}`)
      } catch {}
    }
  } catch (err) {
    console.error("Error updating module:", err)
  }
}

export async function deleteModule(id: string) {
  try {
    const module = await prisma.lMSModule.delete({
      where: { id }
    }).catch(() => null)

    if (module) {
      try {
        revalidatePath(`/dashboard/studio/courses/builder/${module.lmsCourseId}`)
      } catch {}
    }
  } catch (err) {
    console.error("Error deleting module:", err)
  }
}

export async function reorderModules(courseId: string, orderedModuleIds: string[]) {
  try {
    const operations = orderedModuleIds.map((id, index) => 
      prisma.lMSModule.update({
        where: { id },
        data: { sortOrder: index }
      })
    )
    
    await prisma.$transaction(operations).catch(() => {})
    try {
      revalidatePath(`/dashboard/studio/courses/builder/${courseId}`)
    } catch {}
  } catch (err) {
    console.error("Error reordering modules:", err)
  }
}

// Lessons

export async function createLesson(moduleId: string, title: string, type: string) {
  try {
    const mod = await prisma.lMSModule.findUnique({ where: { id: moduleId }}).catch(() => null)
    if (!mod) return null

    const existingLessons = await prisma.lMSLesson.findMany({
      where: { moduleId },
      orderBy: { sortOrder: 'desc' },
      take: 1
    }).catch(() => [])
    
    const sortOrder = existingLessons.length > 0 ? (existingLessons[0]?.sortOrder ?? -1) + 1 : 0

    const newLesson = await prisma.lMSLesson.create({
      data: {
        moduleId,
        title,
        type: type as any,
        sortOrder
      }
    })

    try {
      revalidatePath(`/dashboard/studio/courses/builder/${mod.lmsCourseId}`)
    } catch {}
    return newLesson
  } catch (err) {
    console.error("Error creating lesson:", err)
    return null
  }
}

export async function updateLesson(id: string, data: { title?: string, type?: any, contentUrl?: string, description?: string, richText?: string, resources?: any }) {
  try {
    const lesson: any = await prisma.lMSLesson.update({
      where: { id },
      data: data as any,
      include: { module: true }
    }).catch(() => null)

    if (lesson?.module?.lmsCourseId) {
      try {
        revalidatePath(`/dashboard/studio/courses/builder/${lesson.module.lmsCourseId}`)
      } catch {}
    }
  } catch (err) {
    console.error("Error updating lesson:", err)
  }
}

export async function deleteLesson(id: string) {
  try {
    const lesson: any = await prisma.lMSLesson.delete({
      where: { id },
      include: { module: true }
    }).catch(() => null)

    if (lesson?.module?.lmsCourseId) {
      try {
        revalidatePath(`/dashboard/studio/courses/builder/${lesson.module.lmsCourseId}`)
      } catch {}
    }
  } catch (err) {
    console.error("Error deleting lesson:", err)
  }
}

export async function reorderLessons(courseId: string, orderedLessonIds: string[]) {
  try {
    const operations = orderedLessonIds.map((id, index) => 
      prisma.lMSLesson.update({
        where: { id },
        data: { sortOrder: index }
      })
    )
    
    await prisma.$transaction(operations).catch(() => {})
    try {
      revalidatePath(`/dashboard/studio/courses/builder/${courseId}`)
    } catch {}
  } catch (err) {
    console.error("Error reordering lessons:", err)
  }
}

export async function updateCoursePricing(lmsCourseId: string, data: { fee?: number, salePrice?: number, listPrice?: number }) {
  try {
    const lmsCourse = await getOrCreateLmsCourse(lmsCourseId)
    if (!lmsCourse) return null

    await prisma.lMSCourse.update({
      where: { id: lmsCourse.id },
      data: {
        pricing: data.salePrice ?? data.fee
      }
    }).catch(() => null)

    if (lmsCourse.courseId && data.fee) {
      await prisma.course.update({
        where: { id: lmsCourse.courseId },
        data: { fee: data.fee }
      }).catch(() => null)
    }

    try {
      revalidatePath(`/dashboard/studio/courses/builder/${lmsCourseId}`)
      revalidatePath(`/dashboard/studio/courses/builder/${lmsCourse.courseId}`)
    } catch {}

    return true
  } catch (err) {
    console.error("Error updating course pricing:", err)
    return null
  }
}
