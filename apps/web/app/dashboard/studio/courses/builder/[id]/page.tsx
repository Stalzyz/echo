import { prisma } from "@/lib/prisma"
import BuilderClient from "./BuilderClient"

export default async function CourseBuilderPage({ params }: { params: { id: string } }) {
  const id = (await params).id;
  
  let lmsCourse = await prisma.lMSCourse.findUnique({
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
  })

  if (!lmsCourse) {
    let baseCourse = await prisma.course.findUnique({ where: { id } })
    
    if (!baseCourse) {
      baseCourse = await prisma.course.findFirst()
      if (!baseCourse) {
        baseCourse = await prisma.course.create({
          data: {
            name: "Masterclass Course",
            code: "MC101",
            duration: "3 Months",
            fee: 50000
          }
        })
      }
    }
    
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
      })
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      <BuilderClient initialCourse={lmsCourse} />
    </div>
  )
}

