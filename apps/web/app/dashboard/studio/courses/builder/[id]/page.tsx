import { prisma } from "@/lib/prisma"
import BuilderClient from "./BuilderClient"
import Link from "next/link"

export default async function CourseBuilderPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id;
  
  let lmsCourse: any = null;

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
      let baseCourse = id ? await prisma.course.findUnique({ where: { id } }).catch(() => null) : null;
      
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
              draftStatus: "DRAFT"
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

  if (!lmsCourse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50 p-8 text-center text-slate-900">
        <div className="max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-slate-900">Course Not Found</h2>
          <p className="text-sm text-slate-500 font-medium">Unable to load the course builder. Please return to courses and select a valid course.</p>
          <Link href="/dashboard/studio/courses" className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-colors shadow-xs">
            Return to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      <BuilderClient initialCourse={lmsCourse} />
    </div>
  )
}
