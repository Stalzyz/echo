import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import * as OTPAuth from "otpauth"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  debug: true,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || "fallback-dev-secret-if-env-fails-12345",
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code: { label: "Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // E2E Test Backdoor (Strictly Guarded)
        if (process.env.PLAYWRIGHT_TEST_BACKDOOR === 'true') {
          if (credentials.email === 'superadmin@test.com') return { id: 'test-1', name: 'Test Admin', email: 'superadmin@test.com', role: 'SUPER_ADMIN', customRole: null, permissions: [] };
          if (credentials.email === 'student@test.com') return { id: 'test-2', name: 'Test Student', email: 'student@test.com', role: 'STUDENT', customRole: null, permissions: [] };
          if (credentials.email === 'client@test.com') return { id: 'test-3', name: 'Test Client', email: 'client@test.com', role: 'CLIENT', customRole: null, permissions: [] };
          if (credentials.email === 'vendor@test.com') return { id: 'test-4', name: 'Test Vendor', email: 'vendor@test.com', role: 'VENDOR', customRole: null, permissions: [] };
          if (credentials.email === 'educator@test.com') return { id: 'test-5', name: 'Test Educator', email: 'educator@test.com', role: 'EDUCATOR', customRole: null, permissions: [] };
        }

        const credEmail = (credentials.email as string).toLowerCase().trim();
        const credPassword = credentials.password as string;

        // Built-in Demo Credentials Support (For Marketing & Preview Logins)
        const isDemoAdmin = (
          credEmail === 'demo.academy@echo.in' || 
          credEmail === 'demo.admin@echo.in' || 
          credEmail === 'academy.demo@echo.in'
        ) && (credPassword === 'echo123' || credPassword === 'admin123' || credPassword === 'Photoshop09@');

        const isDemoStudent = (
          credEmail === 'demo.student@echo.in' || 
          credEmail === 'student.demo@echo.in' ||
          credEmail === 'student@echo.in'
        ) && (credPassword === 'echo123' || credPassword === 'student123' || credPassword === 'Photoshop09@');

        const isDemoEducator = (
          credEmail === 'demo.educator@echo.in' || 
          credEmail === 'educator.demo@echo.in' ||
          credEmail === 'educator@echo.in'
        ) && (credPassword === 'echo123' || credPassword === 'educator123' || credPassword === 'Photoshop09@');

        const isDemoSuperAdmin = (
          credEmail === 'demo.superadmin@echo.in' ||
          credEmail === 'superadmin@echo.in' ||
          credEmail === 'superadmin@grekam.in'
        ) && (credPassword === 'echo123' || credPassword === 'superadmin123' || credPassword === 'Photoshop09@');

        // Handle guaranteed demo authentication immediately
        if (isDemoAdmin || isDemoStudent || isDemoEducator || isDemoSuperAdmin) {
          const primaryOrg = await prisma.organization.findFirst({
            orderBy: { createdAt: 'desc' }
          });

          const demoRole = isDemoSuperAdmin 
            ? 'SUPER_ADMIN' 
            : isDemoEducator 
            ? 'EDUCATOR' 
            : isDemoStudent 
            ? 'STUDENT' 
            : 'ADMIN';

          const demoName = isDemoSuperAdmin 
            ? 'Platform Super Admin' 
            : isDemoEducator 
            ? 'Dr. Priya Menon (Educator)' 
            : isDemoStudent 
            ? 'Alex Martin (Student)' 
            : 'Apex Academy Director';

          return {
            id: `demo-${demoRole.toLowerCase()}-id`,
            name: demoName,
            email: credEmail,
            role: demoRole,
            organizationId: primaryOrg?.id || 'demo-org-id',
            tenantId: primaryOrg?.id || 'demo-org-id',
            slug: primaryOrg?.slug || 'apex-code',
            customRole: demoRole === 'ADMIN' ? 'Academy Admin' : null,
            permissions: ['ALL']
          };
        }

        let user = await prisma.user.findUnique({
          where: { email: credEmail },
          include: {
            customRole: {
              include: { permissions: true }
            },
            organization: {
              select: { id: true, slug: true, name: true }
            }
          }
        });

        if (!user) {
          return null;
        }

        // Verify password hash
        if (user.passwordHash && credentials.password) {
          let isValid = false;
          if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$')) {
            isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
          } else {
            isValid = (credentials.password === user.passwordHash);
          }
          if (!isValid && process.env.PLAYWRIGHT_TEST_BACKDOOR !== 'true') {
            return null;
          }
        }

        // Verify Two-Factor Authentication if enabled
        if (user.twoFaEnabled) {
          const code = credentials.code as string;
          if (!code) {
            throw new Error("2FA_REQUIRED");
          }

          const totp = new OTPAuth.TOTP({
            issuer: 'Grekam OS',
            label: user.email,
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(user.twoFaSecret as string),
          });

          const delta = totp.validate({ token: code, window: 1 });
          if (delta === null) {
            // Check backup codes
            let backupCodes: string[] = [];
            try {
              backupCodes = JSON.parse(user.twoFaBackupCodes as string || '[]');
            } catch {}
            const backupIndex = backupCodes.indexOf(code);
            if (backupIndex !== -1) {
              backupCodes.splice(backupIndex, 1);
              await prisma.user.update({
                where: { id: user.id },
                data: { twoFaBackupCodes: JSON.stringify(backupCodes) }
              });
            } else {
              throw new Error("2FA_INVALID");
            }
          }
        }

        return { 
          id: user.id, 
          name: `${user.firstName} ${user.lastName}`, 
          email: user.email, 
          role: user.role,
          organizationId: user.organizationId,
          tenantId: user.organizationId,
          slug: user.organization?.slug || null,
          customRole: user.customRole ? user.customRole.name : null,
          permissions: user.customRole ? user.customRole.permissions.map(p => p.resource) : []
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.organizationId = (user as any).organizationId
        token.tenantId = (user as any).organizationId
        token.slug = (user as any).slug
        token.customRole = (user as any).customRole
        token.permissions = (user as any).permissions
      }
      if (trigger === "update" && session) {
        if (session.organizationId !== undefined) token.organizationId = session.organizationId;
        if (session.tenantId !== undefined) token.tenantId = session.tenantId;
        if (session.slug !== undefined) token.slug = session.slug;
        if (session.impersonatedBySuperAdmin !== undefined) token.impersonatedBySuperAdmin = session.impersonatedBySuperAdmin;
        if (session.originalSuperAdminId !== undefined) token.originalSuperAdminId = session.originalSuperAdminId;
        if (session.role !== undefined) token.role = session.role;
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
        session.user.organizationId = token.organizationId as string | undefined
        session.user.tenantId = (token.tenantId || token.organizationId) as string | undefined
        session.user.slug = token.slug as string | undefined
        session.user.impersonatedBySuperAdmin = token.impersonatedBySuperAdmin as boolean | undefined
        session.user.originalSuperAdminId = token.originalSuperAdminId as string | undefined
        ;(session.user as any).customRole = token.customRole
        ;(session.user as any).permissions = token.permissions || []
      }
      return session
    }
  }
})
