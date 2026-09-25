const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const orgs = await prisma.organization.findMany({
    select: { id: true, name: true, slug: true, status: true, _count: { select: { users: true, courses: true, batches: true, leads: true } } }
  });
  console.log("=== REMAINING ORGANIZATIONS ===");
  console.log(JSON.stringify(orgs, null, 2));

  const plans = await prisma.saaSPlan.findMany({
    select: { id: true, name: true, slug: true, maxStudents: true, maxCourses: true, maxBatches: true, maxWhatsAppMessages: true }
  });
  console.log("=== ACTIVE SAAS PLANS ===");
  console.log(JSON.stringify(plans, null, 2));

  const sub = await prisma.tenantSubscription.findFirst({
    include: { plan: true }
  });
  console.log("=== DEMO ACADEMY SUBSCRIPTION ===");
  console.log(JSON.stringify({
    planName: sub?.plan?.name,
    status: sub?.status,
    billingCycle: sub?.billingCycle,
    maxStudents: sub?.plan?.maxStudents,
    maxCourses: sub?.plan?.maxCourses,
    maxBatches: sub?.plan?.maxBatches,
    maxWhatsAppMessages: sub?.plan?.maxWhatsAppMessages,
    features: sub?.plan?.features
  }, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
