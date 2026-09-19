# Echo LMS / Grekam OS — Comprehensive Module Architecture Map
**Document Version**: 2.5  
**Last Updated**: September 19, 2026  
**Architecture Pattern**: Monorepo (Next.js 14 App Router + Node.js Express/Fastify API + PostgreSQL / Prisma ORM)

---

## Architecture Overview

```
                          CLIENT LAYER
              ┌──────────────────────────────────┐
              │  Next.js 14 Web (Port 4444)      │
              │  Next.js Super Admin (Port 4445) │
              └────────────────┬─────────────────┘
                               │ HTTP / WebSocket
                               ▼
                          API GATEWAY
              ┌──────────────────────────────────┐
              │  Node.js API Server (Port 4400)  │
              │  Fastify Router + Zod Validators │
              └────────────────┬─────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   PERSISTENCE LAYER                       EXTERNAL SERVICES
 ┌──────────────────────┐               ┌──────────────────────┐
 │ PostgreSQL Database  │               │ Razorpay Gateway     │
 │ Prisma ORM Schema    │               │ WhatsApp Meta Cloud  │
 │ Webhook Audit Logs   │               │ SMTP Mailer          │
 └──────────────────────┘               └──────────────────────┘
```

---

## Detailed Map of 12 Enterprise Modules

### 1. Authentication, Identity & User Management
- **Description**: Manages multi-tenant user authentication, RBAC authorization, JWT session tokens, 2FA, and user profile management.
- **Database Models (`schema.prisma`)**: `User`, `Session`, `Role`, `ClientProfile`, `AuditLog`
- **Backend Routers (`apps/api/src`)**: `auth/auth.router.ts`, `auth/sessions.router.ts`
- **Frontend Routes (`apps/web`)**: `/auth/login`, `/auth/register`, `/dashboard/settings/security`
- **Key Enums**: `UserRole` (`SUPER_ADMIN`, `MANAGER`, `STAFF`, `STUDENT`, `EDUCATOR`, `VENDOR`), `UserStatus`

---

### 2. Academy Admissions & CRM
- **Description**: Lead pipelines, Meta Ads lead capture, demo sessions, walk-in kiosks, interactive forms, and sales proposals.
- **Database Models**: `Lead`, `LeadActivity`, `Form`, `FormSubmission`, `DemoSession`, `WalkIn`, `Proposal`
- **Backend Routers**: `crm/leads.router.ts`, `crm/proposals.router.ts`, `academy/admissions.router.ts`
- **Frontend Routes**: `/dashboard/academy/admissions`, `/dashboard/academy/forms`, `/dashboard/academy/walk-ins`, `/dashboard/academy/demo-sessions`

---

### 3. LMS & Course Administration
- **Description**: Student enrollments (onsite/remote), batch assignments, curriculum builder, quiz engine, assignment grading, certificate issuance, and analytics.
- **Database Models**: `Course`, `Batch`, `Module`, `Lesson`, `Student`, `Enrollment`, `Quiz`, `QuizSubmission`, `Assignment`, `AssignmentSubmission`, `Certificate`
- **Backend Routers**: `lms/courses.router.ts`, `lms/batches.router.ts`, `lms/progress.router.ts`, `lms/assignments.router.ts`
- **Frontend Routes**: `/dashboard/academy/students/onsite`, `/dashboard/academy/students/online`, `/dashboard/academy/batches`

---

### 4. Billing, Invoices & Fee Collection
- **Description**: Fee installments, student EMI plans, Razorpay payment webhooks, invoice generation, voucher discounts, and revenue tracking.
- **Database Models**: `Invoice`, `InvoiceItem`, `Payment`, `EmiPlan`, `EmiInstallment`, `BillingMilestone`, `Voucher`, `WebhookLog`
- **Backend Routers**: `finance/invoices.router.ts`, `finance/revenue.router.ts`, `webhooks/razorpay.router.ts`
- **Frontend Routes**: `/dashboard/academy/fees`, `/dashboard/academy/fees/emi`

---

### 5. Teaching Studio (Educator Perspective)
- **Description**: Dedicated workspace for instructors to manage active student cohorts, construct course material, grade assignments, issue certificates, run live video classes, and set office hours.
- **Database Models**: `Educator`, `Course`, `Assignment`, `Certificate`, `OfficeHour`, `InternalMeeting`
- **Backend Routers**: `studio/studio.router.ts`, `lms/progress.router.ts`
- **Frontend Routes**: `/dashboard/studio`, `/dashboard/studio/students`, `/dashboard/studio/courses`, `/dashboard/studio/course-builder`, `/dashboard/studio/quiz-builder`, `/dashboard/studio/assignments`, `/dashboard/studio/certificates`, `/dashboard/studio/analytics`, `/dashboard/studio/live`, `/dashboard/studio/office-hours`

---

### 6. WhatsApp & Automated Messaging
- **Description**: 1-click WhatsApp composer (Grafty Hub replica), live smartphone preview mockup, contact group bulk broadcasts, Meta Cloud API / Grafty WABA fallback, and event trigger automations.
- **Database Models**: `WebhookLog`, `Notification`, `LeadActivity`
- **Backend Routers**: `integrations/whatsapp.router.ts`, `webhooks/meta.router.ts`
- **Frontend Routes**: `/dashboard/academy/whatsapp`, `/dashboard/academy/automation`

---

### 7. HR, Staff & Payroll
- **Description**: Staff employee directory, attendance tracking, leave requests, performance goals, expense reimbursement, and monthly payroll processing.
- **Database Models**: `Employee`, `Attendance`, `LeaveRequest`, `PayrollRecord`, `ExpenseClaim`
- **Backend Routers**: `hr/payroll.router.ts`, `hr/attendance.router.ts`, `hr/requests.router.ts`, `hr/expenses.router.ts`
- **Frontend Routes**: `/dashboard/academy/educators/onsite`, `/dashboard/academy/educators/online`

---

### 8. Live Projects, Internships & Placements
- **Description**: Tracks real-world student client projects, internship assignments, alumni network, referral payouts, and career placement offers.
- **Database Models**: `LiveProject`, `Internship`, `Placement`, `ReferralPayout`, `Alumni`
- **Backend Routers**: `academy/placements.router.ts`, `academy/internships.router.ts`
- **Frontend Routes**: `/dashboard/academy/projects`, `/dashboard/academy/internships`, `/dashboard/academy/placements`

---

### 9. CMS & Landing Pages
- **Description**: Dynamic website page builder, course landing page templates, public brochure downloads, and announcement banners.
- **Database Models**: `CmsPage`, `CmsSection`, `GeneratedDocument`
- **Backend Routers**: `cms/index.ts`, `cms/academy.router.ts`
- **Frontend Routes**: `/dashboard/academy/webinars`

---

### 10. Social Community & Global Leaderboard
- **Description**: Student discussion forums, Q&A threads, XP points calculation, achievement badges, and academy leaderboard.
- **Database Models**: `ForumPost`, `ForumReply`, `StudentXp`
- **Backend Routers**: `academy/community.router.ts`, `academy/leaderboard.router.ts`
- **Frontend Routes**: `/dashboard/academy/community`, `/dashboard/academy/leaderboard`

---

### 11. Team Workspace & Internal Chat
- **Description**: Real-time team chat channels, direct messaging, team goal tracking, announcements, and achievement celebrations.
- **Database Models**: `ChatChannel`, `ChatMessage`, `ChatParticipant`, `TeamGoal`, `TeamAnnouncement`, `TeamAchievement`
- **Backend Routers**: `chat/chat.router.ts`, `team/team.router.ts`
- **Frontend Routes**: `/dashboard` (Team Workspace widgets)

---

### 12. Platform System Settings & Integrations
- **Description**: Multi-tenant organization branding, custom colors, typography, login portal customization, integration keys (Razorpay, WhatsApp, SMTP), audit logs, and security controls.
- **Database Models**: `Organization`, `IntegrationKey`, `AuditLog`, `Session`
- **Backend Routers**: `settings/organization.router.ts`, `settings/integrations.router.ts`
- **Frontend Routes**: `/dashboard/settings`, `/dashboard/settings/organization`, `/dashboard/settings/roles`, `/dashboard/settings/finance`, `/dashboard/settings/integrations`, `/dashboard/settings/audit-logs`, `/dashboard/settings/security`

---

## Data Flow Conventions

1. **Client Request**: Frontend pages invoke `ApiClient` (`apps/web/src/lib/api.ts`) configured with bearer session tokens.
2. **API Layer**: Express/Fastify routes in `apps/api` validate parameters via Zod schemas and verify authorization hooks (`app.requireAuth`).
3. **Database Access**: Queries use `@repo/db` Prisma Client instances with tenant filtering (`organizationId`).
4. **Response Envelope**: Output is returned using `sendSuccess` or `sendError` standard helpers (`{ success: true, data }`).
5. **Auditing**: Administrative and financial actions append records to `AuditLog` and `WebhookLog`.
