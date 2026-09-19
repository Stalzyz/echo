import { prisma } from "@/lib/prisma"
import BuilderClient from "./BuilderClient"
import Link from "next/link"

export default async function CourseBuilderPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id;
  
  let lmsCourse: any = null;
  let baseCourse: any = null;

  try {
    if (id) {
      lmsCourse = await prisma.lMSCourse.findUnique({
        where: { courseId: id },
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
      }).catch(() => null)
    }

    if (!lmsCourse) {
      if (id) {
        baseCourse = await prisma.course.findUnique({ where: { id } }).catch(() => null);
      }
      
      if (!baseCourse) {
        baseCourse = await prisma.course.findFirst().catch(() => null);
        if (!baseCourse) {
          baseCourse = await prisma.course.create({
            data: {
              name: "Masterclass Course",
              code: `MC-${Date.now().toString().slice(-4)}`,
              duration: "3 Months",
              fee: 50000
            }
          }).catch(() => null);
        }
      }

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
        }).catch(() => null);

        if (!lmsCourse) {
          lmsCourse = await prisma.lMSCourse.create({
            data: {
              courseId: baseCourse.id,
              draftStatus: "DRAFT",
              outcomes: [],
              prerequisites: []
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
          }).catch(() => null);
        }
      }
    }
  } catch (err) {
    console.error("Error loading course in CourseBuilderPage:", err)
  }

  // Guaranteed fallback object if database query or create failed
  if (!lmsCourse) {
    const fallbackCourse = baseCourse || {
      id: id || "default-course",
      name: "Masterclass Course",
      code: "MC101",
      duration: "3 Months",
      fee: 50000
    };

    lmsCourse = {
      id: `lms_${fallbackCourse.id}`,
      courseId: fallbackCourse.id,
      course: fallbackCourse,
      modules: [],
      thumbnail: null,
      outcomes: [],
      prerequisites: [],
      isPublished: fallbackCourse.isPublished || false,
      pricing: fallbackCourse.fee || 50000,
      draftStatus: "DRAFT"
    };
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      <BuilderClient initialCourse={lmsCourse} />
    </div>
  )
}
