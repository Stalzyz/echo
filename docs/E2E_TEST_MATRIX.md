# ECHO LMS — Master E2E & Full-Stack QA Test Matrix

> **Generated on**: 2026-10-08  
> **Target System**: Echo LMS (`apps/web` + `apps/api` + `packages/db`)  
> **Testing Scope**: Full-Stack Route Discovery, Server-Side API Handlers, Database Persistence, Multi-Tenant Isolation, Role-Based Access Control, Entitlements, Integrations, and E2E Business Workflows.

---

## Legend
- ⬜ **Pending Audit / Implementation**
- 🔄 **In Progress**
- ✅ **Audited & Verified (Pass)**
- ⚠️ **Pass with Known Warnings**
- ❌ **Failed / Bug Identified**

---

## 1. Authentication, Sessions & Super-Admin Control Plane

| Module | Route / Component | Primary API Endpoint | Prisma Model(s) | Auth Roles | Tenant Filter | CRUD | Integration | E2E Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth Login** | `/auth/login` | `POST /api/auth/callback/credentials` | `User`, `Organization` | Anonymous | Auto-detect | R | Auth.js / JWT | ⬜ |
| **Admin Login** | `/auth/admin/login` | `POST /api/auth/callback/credentials` | `User`, `Organization` | Anonymous | Organization | R | Auth.js / JWT | ⬜ |
| **Super Admin Login** | `/super-admin/login` | `POST /api/auth/callback/credentials` | `User` | `SUPER_ADMIN` | Global (Null) | R | Auth.js / JWT | ⬜ |
| **Password Reset** | `/auth/forgot-password` | `POST /api/v1/auth/forgot-password` | `User` | Anonymous | Global | U | Resend / SMTP | ⬜ |
| **Super Admin Dashboard** | `/dashboard/super-admin` | `GET /api/v1/analytics/overview` | `Organization`, `User`, `Subscription` | `SUPER_ADMIN` | Global Aggregation | R | Analytics Engine | ⬜ |
| **Vendor / Academy Mgmt** | `/dashboard/super-admin/academies` | `GET/POST /api/v1/super-admin/academies` | `Organization`, `TenantSubscription` | `SUPER_ADMIN` | Global | C, R, U, D | Tenant Provisioner | ⬜ |
| **Academy Provisioning** | `/dashboard/super-admin/academies` | `POST /api/v1/super-admin/academies/provision` | `Organization`, `User`, `Role` | `SUPER_ADMIN` | Global | C | Seed & Provisioning | ⬜ |
| **Bulk Vendor Deletion** | `/dashboard/super-admin/academies` | `POST /api/v1/super-admin/academies/bulk-delete` | `Organization`, All Child Relations | `SUPER_ADMIN` | Global | D | Cascade Deletion | ⬜ |
| **Tenant Impersonation** | `/dashboard/super-admin/academies` | `POST /api/v1/super-admin/academies/impersonate` | `Organization`, `User` | `SUPER_ADMIN` | Session Cookie | R, U | Impersonation Middleware | ⬜ |
| **Exit Impersonation** | Header / TopNav | `POST /api/v1/super-admin/academies/impersonate/exit` | `Organization`, `User` | `SUPER_ADMIN` | Session Cookie | U | Cookie Cleared | ⬜ |
| **Super Admin Users** | `/dashboard/super-admin/users` | `GET/PATCH /api/v1/super-admin/users` | `User`, `Role` | `SUPER_ADMIN` | Multi-Tenant | R, U, D | RBAC / Password Reset | ⬜ |
| **Plans & Pricing** | `/dashboard/super-admin/plans` | `GET/POST /api/v1/super-admin/plans` | `SaaSPlan` | `SUPER_ADMIN` | Global | C, R, U, D | Razorpay Plans | ⬜ |
| **Subscriptions Mgmt** | `/dashboard/super-admin/subscriptions` | `GET /api/v1/super-admin/subscriptions` | `Subscription`, `Organization` | `SUPER_ADMIN` | Global | R, U | Subscription Engine | ⬜ |
| **Platform Payments** | `/dashboard/super-admin/payments` | `GET /api/v1/super-admin/payments` | `SubscriptionPayment` | `SUPER_ADMIN` | Global | R | Razorpay Webhooks | ⬜ |
| **Global Courses** | `/dashboard/super-admin/courses` | `GET/POST /api/v1/super-admin/courses` | `Course`, `LMSCourse` | `SUPER_ADMIN` | Global | C, R, U, D | Course Catalog | ⬜ |
| **Global Branding** | `/dashboard/super-admin/branding` | `GET/PATCH /api/v1/super-admin/branding` | `SystemSetting` | `SUPER_ADMIN` | Global | R, U | Cloudflare R2 | ⬜ |
| **Global Integrations** | `/dashboard/super-admin/integrations` | `GET/POST /api/v1/super-admin/integrations` | `IntegrationKey` | `SUPER_ADMIN` | Global | C, R, U, D | Meta / OpenAI / Resend | ⬜ |
| **Platform Reports** | `/dashboard/super-admin/reports` | `GET /api/v1/super-admin/reports` | `AuditLog`, `OrganizationUsageCounter` | `SUPER_ADMIN` | Global | R | CSV Exporter | ⬜ |
| **Super Admin Settings** | `/dashboard/super-admin/settings` | `GET/PATCH /api/v1/super-admin/settings` | `SystemSetting` | `SUPER_ADMIN` | Global | R, U | Config Engine | ⬜ |
| **White-Label Governance** | `/dashboard/super-admin/whitelabel` | `GET/PATCH /api/v1/super-admin/whitelabel` | `LandingPage`, `Organization` | `SUPER_ADMIN` | Multi-Tenant | R, U | Domain Routing / SSL | ⬜ |

---

## 2. Academy Admin — Growth, CRM & Admissions

| Module | Route / Component | Primary API Endpoint | Prisma Model(s) | Auth Roles | Tenant Filter | CRUD | Integration | E2E Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Academy Dashboard** | `/dashboard` | `GET /api/v1/analytics/overview` | `Student`, `Lead`, `Invoice`, `Batch` | `ADMIN`, `MANAGER` | `organizationId` | R | Real-time Metrics | ⬜ |
| **Admissions CRM** | `/dashboard/academy/admissions` | `GET/POST /api/v1/crm/leads` | `Lead`, `LeadActivity`, `Contact` | `ADMIN`, `STAFF` | `organizationId` | C, R, U, D | Pipeline / Lead Scoring | ⬜ |
| **Lead Conversion** | `/dashboard/academy/admissions` | `POST /api/v1/academy/enroll` | `Lead`, `Student`, `Enrollment` | `ADMIN`, `STAFF` | `organizationId` | C, U | Lead to Student Pipeline | ⬜ |
| **Call Intelligence** | `/dashboard/academy/calls` | `GET/POST /api/v1/calls` | `CallIntelligence`, `CallRecord` | `ADMIN`, `STAFF` | `organizationId` | C, R, U, D | AI Transcribe / Sentiment | ⬜ |
| **Call Sync to CRM** | `/dashboard/academy/calls` | `POST /api/v1/calls/[id]/sync-crm` | `CallRecord`, `LeadActivity` | `ADMIN`, `STAFF` | `organizationId` | C, U | CRM Activity Sync | ⬜ |
| **Dynamic Form Builder** | `/dashboard/academy/forms` | `GET/POST /api/v1/academy/dynamic-forms` | `EnquiryForm`, `FormSubmission` | `ADMIN`, `STAFF` | `organizationId` | C, R, U, D | Schema JSON Builder | ⬜ |
| **Public Form Renderer** | `/f/[slug]` | `POST /api/v1/academy/dynamic-forms/submit` | `FormSubmission`, `Lead` | Public / Anon | Target Org Slug | C | Auto-creates Lead in CRM | ⬜ |
| **Walk-ins Kiosk** | `/dashboard/academy/walk-ins` | `GET/POST /api/v1/academy/walk-ins` | `WalkIn`, `Lead` | `ADMIN`, `STAFF` | `organizationId` | C, R, U, D | Reception Terminal | ⬜ |
| **Kiosk Terminal View** | `/kiosk` & `/staff/kiosk` | `POST /api/v1/academy/walk-ins` | `WalkIn` | Public / Tablet | `organizationId` | C | Instant SMS/WhatsApp Ping | ⬜ |
| **Demo Sessions** | `/dashboard/academy/demo-sessions` | `GET/POST /api/v1/academy/events` | `DemoSession`, `DemoRegistration` | `ADMIN`, `STAFF` | `organizationId` | C, R, U, D | Calendar / Meet Links | ⬜ |
| **Consultations** | `/dashboard/academy/consultations` | `GET/POST /api/v1/crm/calendar` | `ClientMeeting`, `Contact` | `ADMIN`, `STAFF` | `organizationId` | C, R, U, D | Google Calendar Sync | ⬜ |

---

## 3. Academy Admin — Academics, Faculty & Students

| Module | Route / Component | Primary API Endpoint | Prisma Model(s) | Auth Roles | Tenant Filter | CRUD | Integration | E2E Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **All Students Directory** | `/dashboard/academy/students` | `GET/POST /api/v1/academy/students` | `Student`, `User`, `Enrollment` | `ADMIN`, `STAFF` | `organizationId` | C, R, U, D | Student Profile & Passport | ⬜ |
| **Campus (Onsite) Students** | `/dashboard/academy/students/onsite` | `GET /api/v1/academy/students?type=ONSITE` | `Student`, `Geofence` | `ADMIN`, `STAFF` | `organizationId` | R, U | Campus RFID / Attendance | ⬜ |
| **Remote (Online) Students** | `/dashboard/academy/students/online` | `GET /api/v1/academy/students?type=ONLINE` | `Student`, `User` | `ADMIN`, `STAFF` | `organizationId` | R, U | LMS Virtual Portal | ⬜ |
| **Student Passport Card** | `/dashboard/academy/students/[id]/passport` | `GET /api/v1/academy/passport/[id]` | `Student`, `StudentBadge`, `Portfolio` | `ADMIN`, `STAFF`, `STUDENT` | `organizationId` | R, U | QR Digital Passport | ⬜ |
| **Campus Faculty** | `/dashboard/academy/educators/onsite` | `GET/POST /api/v1/academy/educators` | `Educator`, `Employee`, `User` | `ADMIN` | `organizationId` | C, R, U, D | Biometric / Schedule | ⬜ |
| **Remote Instructors** | `/dashboard/academy/educators/online` | `GET/POST /api/v1/academy/educators` | `Educator`, `User` | `ADMIN` | `organizationId` | C, R, U, D | Virtual Classroom Alloc | ⬜ |
| **Batches & Courses** | `/dashboard/academy/batches` | `GET/POST /api/v1/academy/batches` | `Batch`, `Course`, `BatchSession` | `ADMIN`, `STAFF` | `organizationId` | C, R, U, D | Academic Scheduler | ⬜ |
| **Class Attendance** | `/dashboard/academy/attendance` | `GET/POST /api/v1/academy/attendance` | `StudentAttendance`, `Session` | `ADMIN`, `STAFF`, `TRAINER` | `organizationId` | C, R, U | QR / Face Verification | ⬜ |
| **QR Scanner Terminal** | `/scanner` | `POST /api/v1/academy/attendance/scan` | `StudentAttendance`, `Student` | `STAFF`, `TRAINER` | `organizationId` | C | Real-time Scan Ingestion | ⬜ |
| **Master Schedule** | `/dashboard/academy/schedule` | `GET /api/v1/academy/batches/with-course` | `BatchSession`, `Educator` | `ADMIN`, `STAFF` | `organizationId` | R, U | Calendar View | ⬜ |

---

## 4. Academy Admin — Finance, Invoicing & EMI Plans

| Module | Route / Component | Primary API Endpoint | Prisma Model(s) | Auth Roles | Tenant Filter | CRUD | Integration | E2E Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Fee Collection Console** | `/dashboard/academy/fees` | `GET/POST /api/v1/finance/invoices` | `Invoice`, `Payment`, `Student` | `ADMIN`, `STAFF` | `organizationId` | C, R, U, D | Payment Receipts / GST | ⬜ |
| **Student Fee Ledger** | `/dashboard/academy/fees/[studentId]` | `GET /api/v1/academy/fees/[studentId]` | `Invoice`, `FeeInstallment`, `Payment`| `ADMIN`, `STAFF` | `organizationId` | R, U | PDF Invoice Generator | ⬜ |
| **Student EMI Plans** | `/dashboard/academy/fees/emi` | `GET/POST /api/v1/finance/subscriptions` | `FeeInstallment`, `BillingSchedule` | `ADMIN`, `STAFF` | `organizationId` | C, R, U | Auto-Debit / Overdue Calc | ⬜ |
| **Coupons & Discounts** | `/dashboard/academy/coupons` | `GET/POST /api/v1/academy/marketplace` | `Product`, `MarketplaceItem` | `ADMIN` | `organizationId` | C, R, U, D | Checkout Discount Engine | ⬜ |
| **Finance Settings** | `/dashboard/settings/finance` | `GET/PATCH /api/v1/settings/finance` | `FinanceSettings`, `Organization` | `ADMIN` | `organizationId` | R, U | Bank / UPI / GST Config | ⬜ |

---

## 5. Academy Admin — Career, Experiential & Community

| Module | Route / Component | Primary API Endpoint | Prisma Model(s) | Auth Roles | Tenant Filter | CRUD | Integration | E2E Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Live Projects Studio** | `/dashboard/academy/projects` | `GET/POST /api/v1/academy/academy-projects` | `AcademyProject`, `AcademyProjectTask` | `ADMIN`, `STAFF`, `TRAINER` | `organizationId` | C, R, U, D | Client Briefs / Milestones | ⬜ |
| **Student Internships** | `/dashboard/academy/internships` | `GET/POST /api/v1/academy/internships` | `Internship`, `InternshipLog`, `Company` | `ADMIN`, `STAFF` | `organizationId` | C, R, U, D | Corporate Evaluation | ⬜ |
| **Placement Drives & Jobs**| `/dashboard/academy/placements` | `GET/POST /api/v1/academy/placements` | `PlacementJob`, `PlacementCompany` | `ADMIN`, `STAFF` | `organizationId` | C, R, U, D | Applicant Tracking | ⬜ |
| **Course Marketplace** | `/dashboard/academy/marketplace` | `GET/POST /api/v1/academy/marketplace` | `MarketplaceItem`, `Purchase` | `ADMIN`, `STUDENT` | `organizationId` | C, R, U | Student Self-Enrollment | ⬜ |
| **Webinars & Funnels** | `/dashboard/academy/webinars` | `GET/POST /api/v1/academy/events` | `CampusEvent`, `EventRegistration` | `ADMIN`, `STAFF` | `organizationId` | C, R, U, D | Funnel Landing Pages | ⬜ |
| **Public Webinar Route** | `/w/[slug]` & `/webinar/[slug]` | `POST /api/v1/academy/events/register` | `EventRegistration`, `Lead` | Public / Anon | Target Org Slug | C | WhatsApp Reminder Drips | ⬜ |
| **Social Community** | `/dashboard/academy/community` | `GET/POST /api/v1/academy/forums` | `ForumCategory`, `ForumPost`, `Reply` | `ADMIN`, `STAFF`, `STUDENT` | `organizationId` | C, R, U, D | Thread Discussions | ⬜ |

---

## 6. Intelligence, Automations & Growth Engine

| Module | Route / Component | Primary API Endpoint | Prisma Model(s) | Auth Roles | Tenant Filter | CRUD | Integration | E2E Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **WhatsApp Messages** | `/dashboard/academy/whatsapp` | `GET/POST /api/v1/integrations/whatsapp` | `CommunicationLog`, `GraftyMessage` | `ADMIN`, `STAFF` | `organizationId` | C, R | Meta WhatsApp Cloud API | ⬜ |
| **Visual Automations** | `/dashboard/academy/automation` | `GET/POST /api/v1/automations/workflows` | `Workflow`, `WorkflowStep`, `Log` | `ADMIN` | `organizationId` | C, R, U, D | Trigger-Condition-Action | ⬜ |
| **Email Automation Drips**| `/dashboard/academy/automation/email` | `GET/POST /api/v1/settings/emailTemplates` | `EmailTemplate`, `Campaign` | `ADMIN` | `organizationId` | C, R, U, D | Resend / SMTP Drip Engine | ⬜ |
| **Academy Landing Page** | `/dashboard/website/theme` | `GET/POST /api/v1/cms/academy` | `LandingPage`, `PageSection` | `ADMIN` | `organizationId` | C, R, U | Drag-and-drop Customizer | ⬜ |
| **Public White-Label Page**| `/[slug]` | `GET /api/v1/cms/academy/public/[slug]` | `LandingPage`, `Course`, `Lead` | Public / Visitor | Target Org Slug | R | Next.js Dynamic SSG/SSR | ⬜ |
| **Referrals & Rewards** | `/dashboard/academy/referrals` | `GET/POST /api/v1/academy/referrals` | `Referral`, `ReferralPayout` | `ADMIN`, `STUDENT` | `organizationId` | C, R, U | Tracking Link & Wallet | ⬜ |
| **AI Student Risk Engine** | `/dashboard/academy/risk` | `GET /api/v1/academy/risk` | `Student`, `Attendance`, `QuizAttempt` | `ADMIN`, `STAFF` | `organizationId` | R, U | Dropout Predictor Model | ⬜ |
| **Global Leaderboard** | `/dashboard/academy/leaderboard` | `GET /api/v1/academy/leaderboard` | `StudentBadge`, `StudentPortfolio` | `ADMIN`, `STUDENT` | `organizationId` | R | Gamification Points | ⬜ |
| **Notifications Feed** | `/dashboard/notifications` | `GET/PATCH /api/v1/notifications` | `Notification` | All Authenticated | `userId` + `orgId` | R, U | WebSockets / In-App Ping | ⬜ |

---

## 7. Teaching Studio (Educator Workspace)

| Module | Route / Component | Primary API Endpoint | Prisma Model(s) | Auth Roles | Tenant Filter | CRUD | Integration | E2E Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Studio Dashboard** | `/dashboard/studio` | `GET /api/v1/lms/analytics` | `LMSCourse`, `Student`, `Assignment` | `EDUCATOR`, `ADMIN` | `organizationId` | R | Educator KPI Metrics | ⬜ |
| **My Students (Studio)** | `/dashboard/studio/students` | `GET /api/v1/academy/students` | `Student`, `Enrollment` | `EDUCATOR`, `ADMIN` | `organizationId` | R | Student Progress Tracking | ⬜ |
| **My Courses** | `/dashboard/studio/courses` | `GET/POST /api/v1/lms/courses` | `LMSCourse`, `LMSModule`, `LMSLesson` | `EDUCATOR`, `ADMIN` | `organizationId` | C, R, U, D | Curriculum Structure | ⬜ |
| **Visual Course Builder**| `/dashboard/studio/course-builder` | `GET/PUT /api/v1/lms/courses/[id]` | `LMSCourse`, `LMSModule`, `LMSLesson` | `EDUCATOR`, `ADMIN` | `organizationId` | C, R, U, D | Video / Resource Uploader | ⬜ |
| **Interactive Quiz Builder**| `/dashboard/studio/quiz-builder` | `GET/POST /api/v1/lms/quizzes` | `Quiz`, `QuizQuestion` | `EDUCATOR`, `ADMIN` | `organizationId` | C, R, U, D | Auto-Grading Engine | ⬜ |
| **Student Quizzes** | `/dashboard/studio/quizzes` | `GET /api/v1/lms/quizzes/attempts` | `QuizAttempt`, `Student` | `EDUCATOR`, `ADMIN` | `organizationId` | R, U | Score Breakdown | ⬜ |
| **Assignments & Submissions**| `/dashboard/studio/assignments` | `GET/POST /api/v1/lms/assignments` | `Assignment`, `AssignmentSubmission` | `EDUCATOR`, `ADMIN` | `organizationId` | C, R, U | AI Grading & Feedback | ⬜ |
| **Certificate Generator**| `/dashboard/studio/certificates` | `GET/POST /api/v1/academy/certificates` | `Certificate`, `CertificateTemplate` | `EDUCATOR`, `ADMIN` | `organizationId` | C, R, U | PDF Generation & QR Hash | ⬜ |
| **Certificate Verification**| `/verify/[certificateId]` | `GET /api/v1/academy/certificates/verify` | `Certificate`, `Student`, `Course` | Public / Employer | Global Lookup | R | Tamper-Proof QR Hash | ⬜ |
| **Studio Analytics** | `/dashboard/studio/analytics` | `GET /api/v1/lms/analytics/completion` | `LessonProgress`, `QuizAttempt` | `EDUCATOR`, `ADMIN` | `organizationId` | R | Course Retention Graphs | ⬜ |
| **Live Studio Classroom**| `/dashboard/studio/live` | `GET/POST /api/v1/academy/events/live` | `CampusEvent`, `Session` | `EDUCATOR`, `ADMIN` | `organizationId` | C, R, U | WebRTC / Streaming Hook | ⬜ |
| **Educator Office Hours**| `/dashboard/studio/office-hours` | `GET/POST /api/v1/academy/office-hours` | `OfficeHour`, `OfficeHourBooking` | `EDUCATOR`, `ADMIN` | `organizationId` | C, R, U, D | 1-on-1 Student Slots | ⬜ |
| **Educator Profile** | `/dashboard/studio/profile` | `GET/PATCH /api/v1/auth/me` | `User`, `Educator` | `EDUCATOR` | `userId` | R, U | Bio / Specialization | ⬜ |

---

## 8. Student Experience Portal

| Module | Route / Component | Primary API Endpoint | Prisma Model(s) | Auth Roles | Tenant Filter | CRUD | Integration | E2E Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Student Dashboard** | `/student` | `GET /api/v1/academy/lms-student/dashboard` | `Enrollment`, `Attendance`, `Invoice` | `STUDENT` | `studentId` + `orgId` | R | Student Summary Hub | ⬜ |
| **Course Learning Player** | `/student/learn/[courseId]` | `GET/POST /api/v1/lms/lessons/progress` | `LMSCourse`, `LMSLesson`, `Progress` | `STUDENT` | `studentId` + `orgId` | R, U | Video Streaming & Notes | ⬜ |
| **Student Assignments** | `/student/assignments` | `GET/POST /api/v1/lms/assignments/submit`| `AssignmentSubmission`, `Assignment` | `STUDENT` | `studentId` + `orgId` | R, C | File Upload / Submissions | ⬜ |
| **My Certificates** | `/dashboard/student/certificates` | `GET /api/v1/academy/certificates/my` | `Certificate` | `STUDENT` | `studentId` + `orgId` | R | PDF Download / LinkedIn | ⬜ |
| **Student Profile & Edit** | `/student/profile` & `/edit` | `GET/PATCH /api/v1/academy/students/me` | `Student`, `User`, `Portfolio` | `STUDENT` | `studentId` | R, U | Profile Photo / Resume | ⬜ |
| **Parent Portal** | `/portal/parent/[studentId]` | `GET /api/v1/academy/students/[id]/parent`| `Student`, `Attendance`, `Invoice` | Parent / OTP | `studentId` + `orgId` | R | Attendance & Fee Ledger | ⬜ |

---

## 9. System Settings & Enterprise Governance

| Module | Route / Component | Primary API Endpoint | Prisma Model(s) | Auth Roles | Tenant Filter | CRUD | Integration | E2E Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Branding & Theme** | `/dashboard/settings` | `GET/PATCH /api/v1/settings/organization`| `Organization` | `ADMIN` | `organizationId` | R, U | Color Tokens / Logo / R2 | ⬜ |
| **Company & Academy Info**| `/dashboard/settings/organization` | `GET/PATCH /api/v1/settings/organization`| `Organization` | `ADMIN` | `organizationId` | R, U | Contact / Address / GST | ⬜ |
| **Roles & Permissions (RBAC)**| `/dashboard/settings/roles` | `GET/POST/DELETE /api/v1/settings/roles` | `Role`, `Permission`, `User` | `ADMIN` | `organizationId` | C, R, U, D | Matrix & Staff Assignment | ⬜ |
| **Integrations & API Keys**| `/dashboard/settings/integrations` | `GET/POST /api/v1/settings/integrations` | `IntegrationKey` | `ADMIN` | `organizationId` | C, R, U, D | WhatsApp, Razorpay, SMTP | ⬜ |
| **Audit Logs** | `/dashboard/settings/audit-logs` | `GET /api/v1/settings/audit-logs` | `AuditLog` | `ADMIN` | `organizationId` | R | Security Event Logs | ⬜ |
| **Security, 2FA & Auth** | `/dashboard/settings/security` | `GET/POST /api/v1/auth/2fa` | `User` | `ADMIN`, All | `userId` | R, U | TOTP QR Codes / Backup | ⬜ |
| **Tenant Billing & Upgrade**| `/dashboard/settings/billing` | `GET/POST /api/v1/subscription/checkout` | `TenantSubscription`, `Payment` | `ADMIN` | `organizationId` | R, C | Plan Upgrade Modal | ⬜ |

---

## 10. Audit Summary & Module Counts

- **Total Main Navigation Groups**: 4 (`Main`, `Academy Admin`, `Studio & Content`, `System`) + `Super Admin`
- **Total Discovered Frontend Pages (`page.tsx`)**: **117 pages**
- **Total Next.js Route Handlers (`route.ts`)**: **30 API routes**
- **Total Fastify Backend Routers (`*.router.ts`)**: **53 router suites**
- **Total Core Prisma Models**: **142 database entities**
- **Dedicated Isolated E2E Database**: `echo_lms_e2e` (PostgreSQL on VPS)
- **Deterministic E2E Seed Script**: `npm run test:e2e:db:reset` (`packages/db/scripts/reset-e2e.js`)
- **Phase Status**:
  - ✅ **Phase 1: Full System Inventory & Route Discovery** (COMPLETE)
  - ✅ **Phase 2: Isolated E2E Database, Deterministic Reset & Seed Infrastructure** (COMPLETE)
  - 🔄 **Phase 3: Multi-Tenant Isolation & IDOR Security Audit** (NEXT)

