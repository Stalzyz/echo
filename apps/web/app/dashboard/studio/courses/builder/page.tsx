import { prisma } from "@/lib/prisma"
import { redirect } from 'next/navigation'

export default async function CourseBuilderIndex() {
  const firstCourse = await prisma.course.findFirst()
  if (firstCourse) {
    redirect(`/dashboard/studio/courses/builder/${firstCourse.id}`)
  }
  redirect('/dashboard/studio/courses')
}

