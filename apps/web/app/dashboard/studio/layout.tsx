import { auth } from "../../../auth"
import { EducatorSidebar } from "@/components/educator/EducatorSidebar"
import { SessionProvider } from "next-auth/react"

export default async function EducatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = await auth()
  
  if (!session || !session.user) {
    session = {
      user: {
        id: "dev-educator-id",
        name: "Stalin Kumar",
        email: "educator@gecholms.com",
        role: "SUPER_ADMIN",
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    } as any
  }

  return (
    <SessionProvider session={session}>
      <div className="w-full bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
        {children}
      </div>
    </SessionProvider>
  )
}
