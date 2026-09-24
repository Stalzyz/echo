import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnPortal = nextUrl.pathname.startsWith('/portal')
      const isOnStudent = nextUrl.pathname.startsWith('/student')
      const isOnVendorWorkspace = nextUrl.pathname.startsWith('/w/')

      const isOnSuperAdmin = nextUrl.pathname.startsWith('/dashboard/super-admin')

      const role = (auth?.user as any)?.role
      const impersonated = (auth?.user as any)?.impersonatedBySuperAdmin
      const isSuperAdmin = (role === 'SUPER_ADMIN' || role === 'Super Admin') && !impersonated

      if (isOnSuperAdmin) {
        // Must be logged in
        if (!isLoggedIn) return false
        // Only real (non-impersonating) super admins can access this area
        if (!isSuperAdmin) {
          // Non-super-admin tried to access super-admin — send to their own area
          if (role === 'CLIENT') return Response.redirect(new URL('/portal', nextUrl))
          if (role === 'STUDENT') return Response.redirect(new URL('/student', nextUrl))
          if (role === 'EDUCATOR') return Response.redirect(new URL('/dashboard/studio', nextUrl))
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
        return true
      }

      // Protect /w/[slug] vendor workspace routes — require login
      if (isOnVendorWorkspace) {
        if (!isLoggedIn) return false
        return true
      }

      if (isOnDashboard || isOnPortal || isOnStudent) {
        if (!isLoggedIn) return false

        // Super Admin (without impersonation) must stay in their control plane
        if (isSuperAdmin && !isOnSuperAdmin) {
          return Response.redirect(new URL('/dashboard/super-admin/academies', nextUrl))
        }

        return true
      } else if (isLoggedIn) {
        if (
          nextUrl.pathname.startsWith('/auth/login') ||
          nextUrl.pathname.startsWith('/auth/admin/login') ||
          nextUrl.pathname.startsWith('/super-admin/login') ||
          nextUrl.pathname.startsWith('/academy/login') ||
          nextUrl.pathname === '/login'
        ) {
          const slug = (auth?.user as any)?.slug
          if (isSuperAdmin) {
            return Response.redirect(new URL('/dashboard/super-admin/academies', nextUrl))
          } else if (role === 'CLIENT') {
            return Response.redirect(new URL('/portal', nextUrl))
          } else if (role === 'STUDENT') {
            return Response.redirect(new URL('/student', nextUrl))
          } else if (role === 'EDUCATOR') {
            return Response.redirect(new URL('/dashboard/studio', nextUrl))
          } else if ((role === 'ADMIN' || role === 'Admin') && slug) {
            return Response.redirect(new URL(`/w/${slug}`, nextUrl))
          }
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
      }
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
