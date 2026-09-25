const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  let org = await prisma.organization.findFirst({
    where: { OR: [{ slug: "echo-academy" }, { slug: "apex-code" }, { name: "Apex Coding Academy" }, { name: "Echo Academy" }] }
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "Echo Academy",
        slug: "echo-academy",
        domain: "echo-academy.echolms.com",
        ownerName: "Echo Academy Director",
        ownerEmail: "demo.academy@echo.in",
        ownerPhone: "+91 9876543210",
        subscription: "GROWTH",
        status: "ACTIVE",
        primaryColor: "#0f766e",
        secondaryColor: "#1e1b4b",
        accentColor: "#6366f1"
      }
    });
  } else {
    org = await prisma.organization.update({
      where: { id: org.id },
      data: {
        name: "Echo Academy",
        slug: "echo-academy",
        domain: "echo-academy.echolms.com",
        ownerName: "Echo Academy Director",
        ownerEmail: "demo.academy@echo.in",
        subscription: "GROWTH",
        status: "ACTIVE",
        primaryColor: "#0f766e",
        secondaryColor: "#1e1b4b",
        accentColor: "#6366f1"
      }
    });
  }

  const passwordHash = "$2b$10$s0bAH5frbigHJnR3HvS70upJ/Ml8VrF9dGV7Pd.IlrmtX3BuUjFEi";

  // 1. Academy Admin
  await prisma.user.upsert({
    where: { email: "demo.academy@echo.in" },
    update: { passwordHash, role: "ADMIN", status: "ACTIVE", firstName: "Echo", lastName: "Director", organizationId: org.id },
    create: { email: "demo.academy@echo.in", passwordHash, role: "ADMIN", status: "ACTIVE", firstName: "Echo", lastName: "Director", organizationId: org.id }
  });

  // 2. Demo Student
  const stu = await prisma.user.upsert({
    where: { email: "demo.student@echo.in" },
    update: { passwordHash, role: "STUDENT", status: "ACTIVE", firstName: "Alex", lastName: "Martin", organizationId: org.id },
    create: { email: "demo.student@echo.in", passwordHash, role: "STUDENT", status: "ACTIVE", firstName: "Alex", lastName: "Martin", organizationId: org.id }
  });

  await prisma.student.upsert({
    where: { userId: stu.id },
    update: { studentCode: "STU-ECHO-001", learningLanguage: "English" },
    create: { userId: stu.id, studentCode: "STU-ECHO-001", learningLanguage: "English" }
  });

  // 3. Demo Educator
  const edu = await prisma.user.upsert({
    where: { email: "demo.educator@echo.in" },
    update: { passwordHash, role: "EDUCATOR", status: "ACTIVE", firstName: "Dr. Priya", lastName: "Menon", organizationId: org.id },
    create: { email: "demo.educator@echo.in", passwordHash, role: "EDUCATOR", status: "ACTIVE", firstName: "Dr. Priya", lastName: "Menon", organizationId: org.id }
  });

  await prisma.educator.upsert({
    where: { userId: edu.id },
    update: { designation: "Lead Faculty & Curriculum Director", company: "Echo Academy" },
    create: { userId: edu.id, designation: "Lead Faculty & Curriculum Director", company: "Echo Academy" }
  });

  console.log("SUCCESS: VPS Database synchronized with Echo Academy and demo accounts!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
