import { prisma } from "@/lib/prisma"
import { redirect } from 'next/navigation'

export default async function CourseBuilderIndex() {
  let firstCourse = null
  try {
    firstCourse = await prisma.course.findFirst()
    if (!firstCourse) {
      firstCourse = await prisma.course.create({
        data: {
          name: "Masterclass Course",
          code: `MC-${Date.now().toString().slice(-4)}`,
          duration: "3 Months",
          fee: 50000
        }
      })
    }
  } catch (err) {
    console.error("Error finding or creating starter course:", err)
  }

  if (firstCourse?.id) {
    redirect(`/dashboard/studio/courses/builder/${firstCourse.id}`)
  }
  
  redirect('/dashboard/studio/courses')
}
