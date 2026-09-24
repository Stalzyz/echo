import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      role: string
      organizationId?: string | null
      tenantId?: string | null
      slug?: string | null
      impersonatedBySuperAdmin?: boolean
      originalSuperAdminId?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    organizationId?: string | null
    tenantId?: string | null
    slug?: string | null
    impersonatedBySuperAdmin?: boolean
    originalSuperAdminId?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    organizationId?: string | null
    tenantId?: string | null
    slug?: string | null
    impersonatedBySuperAdmin?: boolean
    originalSuperAdminId?: string | null
  }
}
