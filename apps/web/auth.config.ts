import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    // Session callback so middleware and layout can read role from JWT
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).role = token.role
        ;(session.user as any).id = token.id
        ;(session.user as any).organizationId = token.organizationId
        ;(session.user as any).tenantId = token.tenantId || token.organizationId
        ;(session.user as any).slug = token.slug
        ;(session.user as any).impersonatedBySuperAdmin = token.impersonatedBySuperAdmin
        ;(session.user as any).originalSuperAdminId = token.originalSuperAdminId
      }
      return session
    },
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
        if (!isLoggedIn) return false
        if (!isSuperAdmin) {
          if (role === 'CLIENT') return Response.redirect(new URL('/portal', nextUrl))
          if (role === 'STUDENT') return Response.redirect(new URL('/student', nextUrl))
          if (role === 'EDUCATOR') return Response.redirect(new URL('/dashboard/studio', nextUrl))
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
        return true
      }

      if (isOnVendorWorkspace) {
        if (!isLoggedIn) return false
        return true
      }

      if (isOnDashboard || isOnPortal || isOnStudent) {
        if (!isLoggedIn) return false

        // Super Admin must always be in their control plane
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
