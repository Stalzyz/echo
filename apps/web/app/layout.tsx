import type { Metadata } from "next"
import { Inter, Caveat, Space_Grotesk, Playfair_Display, Poppins } from "next/font/google"
import "./globals.css"
import { SmoothScroll } from "@/components/SmoothScroll"
import { OrganizationProvider } from "@/context/OrganizationContext"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({ weight: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"], variable: "--font-poppins" })
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  metadataBase: new URL('https://echo.grekam.in'),
  title: {
    default: 'echo — Your Academy. One Connected System.',
    template: '%s | echo LMS by Grekam'
  },
  description: 'echo is an Academy Operating System bringing courses, students, educators, live classes, payments, CRM, automation and academy website into one platform. A product by Grekam, Coimbatore, India.',
  openGraph: {
    title: 'echo — Your Academy. One Connected System.',
    description: 'echo brings your courses, students, educators, live classes, payments, CRM, automation and academy website into one connected platform. Product by Grekam, Coimbatore.',
    url: 'https://echo.grekam.in',
    siteName: 'echo by Grekam',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'echo Academy Operating System',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'echo by Grekam',
    description: 'Operating system for modern academies and education businesses.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${caveat.variable} ${spaceGrotesk.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <OrganizationProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </OrganizationProvider>
      </body>
    </html>
  )
}

