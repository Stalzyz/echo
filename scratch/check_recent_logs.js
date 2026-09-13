const { prisma } = require('/root/grekam-os/apps/api/dist/db');

async function run() {
  const logs = await prisma.communicationLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { contact: true }
  });
  console.log('Recent communication logs:');
  logs.forEach(l => {
    console.log(l.createdAt.toISOString(), '| Contact:', l.contact?.name, '| Phone:', l.contact?.phone || l.contact?.whatsapp, '| Summary:', l.summary);
  });
}

run().finally(() => prisma.$disconnect());
