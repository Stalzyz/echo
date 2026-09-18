import "./globals.css"
import { Sidebar } from "./Sidebar"
import { Toaster } from "sonner"

export const metadata = {
  title: "Gecho LMS • Super Admin Platform Suite",
  description: "Enterprise SaaS Super Admin Control Portal for Gecho LMS",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased h-screen overflow-hidden">
        <div className="flex h-screen w-full overflow-hidden bg-slate-50">
          
          {/* Vertical Sidebar Navigation */}
          <Sidebar />

          {/* Main Content Viewport */}
          <main className="flex-1 overflow-y-auto min-w-0 bg-slate-50 relative z-10 custom-scrollbar">
            {children}
          </main>

        </div>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
