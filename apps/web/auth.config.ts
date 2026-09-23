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

      const isOnSuperAdmin = nextUrl.pathname.startsWith('/dashboard/super-admin')

      if (isOnSuperAdmin) {
        if (!isLoggedIn) return false
        const role = (auth?.user as any)?.role
        if (role !== 'SUPER_ADMIN' && role !== 'Super Admin') {
          // Academy Admins and students cannot access Super Admin control plane
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
        return true
      }

      if (isOnDashboard || isOnPortal || isOnStudent) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        if (
          nextUrl.pathname.startsWith('/auth/login') ||
          nextUrl.pathname.startsWith('/auth/admin/login') ||
          nextUrl.pathname.startsWith('/super-admin/login') ||
          nextUrl.pathname.startsWith('/academy/login') ||
          nextUrl.pathname === '/login'
        ) {
          const role = (auth?.user as any)?.role
          if (role === 'SUPER_ADMIN' || role === 'Super Admin') {
            return Response.redirect(new URL('/dashboard/super-admin', nextUrl))
          } else if (role === 'CLIENT') {
            return Response.redirect(new URL('/portal', nextUrl))
          } else if (role === 'STUDENT') {
            return Response.redirect(new URL('/student', nextUrl))
          } else if (role === 'EDUCATOR') {
            return Response.redirect(new URL('/dashboard/studio', nextUrl))
          }
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
      }
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
