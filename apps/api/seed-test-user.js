const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('password123', 10);
  const emails = ['admin@grekam.com', 'admin@grekam.in'];

  for (const email of emails) {
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash: hash, role: 'SUPER_ADMIN' },
      create: {
        email,
        passwordHash: hash,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN'
      }
    });
    console.log(`User ${email} created/updated with password: password123`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

