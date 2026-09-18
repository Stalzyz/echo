import { prisma } from "@/lib/prisma"
import { auth } from "../../../../auth"
import ProfileBuilderClient from "./ProfileBuilderClient"

export default async function ProfileBuilderPage() {
  const session = await auth()
  const userId = session?.user?.id || "dev-educator-id"

  let educator = await prisma.educator.findUnique({
    where: { userId: userId },
    include: {
      batches: {
        include: {
          course: true
        }
      }
    }
  })

  if (!educator) {
    educator = {
      id: "dev-educator-id",
      userId: userId,
      slug: "stalin-kumar",
      tagline: "Senior Full Stack Instructor",
      bio: "Passionate about building scalable apps and teaching modern web development.",
      youtubeUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      linkedInUrl: "",
      isPublic: true,
      coverImageUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop",
      batches: []
    } as any
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      <ProfileBuilderClient initialEducator={educator} />
    </div>
  )
}
