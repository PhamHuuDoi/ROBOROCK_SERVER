const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    skipDuplicates: true,
    data: [
      { name: "SYSTEM_ADMIN" },
      { name: "WAREHOUSE_MANAGER" },
      { name: "STORE_MANAGER" },
      { name: "STAFF" },
      { name: "CUSTOMER" },
    ],
  });
}

main()
  .finally(() => prisma.$disconnect());