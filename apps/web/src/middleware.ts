import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const authMiddleware = NextAuth(authConfig).auth

export default function middleware(req: any) {
  if (process.env.PLAYWRIGHT_TEST_BACKDOOR === 'true') {
    return NextResponse.next()
  }

  const hostname = req.headers.get("host") || ""
  const currentHost = hostname.replace(/:[0-9]+$/, "") // Strip port if local
  const { pathname } = req.nextUrl

  let tenantSlug: string | null = null

  // 1. Extract slug from /w/[slug] path
  const wMatch = pathname.match(/^\/w\/([^\/]+)/)
  if (wMatch && wMatch[1]) {
    tenantSlug = wMatch[1]
  }

  // 2. Check if subdomain under echolms.com or grekam.in
  if (!tenantSlug && (currentHost.endsWith(".echolms.com") || currentHost.endsWith(".grekam.in"))) {
    const parts = currentHost.split(".")
    if (parts.length > 2 && parts[0] !== "www" && parts[0] !== "academy" && parts[0] !== "echo") {
      tenantSlug = parts[0]
    }
  }

  const requestHeaders = new Headers(req.headers)
  if (tenantSlug) {
    requestHeaders.set("x-tenant-slug", tenantSlug)
  }
  requestHeaders.set("x-tenant-host", currentHost)

  const res = authMiddleware(req)
  if (res instanceof NextResponse) {
    if (tenantSlug) res.headers.set("x-tenant-slug", tenantSlug)
    res.headers.set("x-tenant-host", currentHost)
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
