const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function clean() {
  const dummySlugs = ['alpha-academy', 'beta-academy', 'gamma-academy'];
  const orgs = await p.organization.findMany({ where: { slug: { in: dummySlugs } } });
  const ids = orgs.map(o => o.id);

  if (ids.length > 0) {
    const users = await p.user.findMany({ where: { organizationId: { in: ids } }, select: { id: true } });
    const userIds = users.map(u => u.id);
    const batches = await p.batch.findMany({ where: { organizationId: { in: ids } }, select: { id: true } });
    const batchIds = batches.map(b => b.id);
    const courses = await p.course.findMany({ where: { organizationId: { in: ids } }, select: { id: true } });
    const courseIds = courses.map(c => c.id);
    const students = await p.student.findMany({ where: { userId: { in: userIds } }, select: { id: true } });
    const studentIds = students.map(s => s.id);

    await p.enrollment.deleteMany({ where: { batchId: { in: batchIds } } });
    await p.lMSCourse.deleteMany({ where: { courseId: { in: courseIds } } });
    await p.student.deleteMany({ where: { id: { in: studentIds } } });
    await p.educator.deleteMany({ where: { userId: { in: userIds } } });
    await p.employee.deleteMany({ where: { userId: { in: userIds } } });
    await p.lead.deleteMany({ where: { organizationId: { in: ids } } });
    await p.batch.deleteMany({ where: { id: { in: batchIds } } });
    await p.course.deleteMany({ where: { id: { in: courseIds } } });
    await p.user.deleteMany({ where: { id: { in: userIds } } });
    await p.organization.deleteMany({ where: { id: { in: ids } } });
    console.log(`Cleaned ${ids.length} dummy academies from VPS DB`);
  } else {
    console.log('No dummy academies found on VPS DB');
  }
}

clean().catch(console.error).finally(() => p.$disconnect());
