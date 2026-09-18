import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized() {
      return true; // Password and auth restriction removed for development
    },
  },
  providers: [],
} satisfies NextAuthConfig

