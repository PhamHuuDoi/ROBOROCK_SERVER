const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

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

  const roles = await prisma.role.findMany();

  const roleMap = {};

  roles.forEach((role) => {
    roleMap[role.name] = role.id;
  });

  const password = await bcrypt.hash(
    "123456",
    10
  );

  const users = [
    {
      fullName: "System Admin",
      email: "admin@roborock.com",
      roleId: roleMap.SYSTEM_ADMIN,
    },
    {
      fullName: "Warehouse Manager",
      email: "warehouse@roborock.com",
      roleId: roleMap.WAREHOUSE_MANAGER,
    },
    {
      fullName: "Store Manager",
      email: "store@roborock.com",
      roleId: roleMap.STORE_MANAGER,
    },
    {
      fullName: "Staff POS",
      email: "staff@roborock.com",
      roleId: roleMap.STAFF,
    },
    {
      fullName: "Customer Test",
      email: "customer@roborock.com",
      roleId: roleMap.CUSTOMER,
    },
  ];

  for (const user of users) {

    const existed =
      await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

    if (!existed) {

      await prisma.user.create({
        data: {
          fullName: user.fullName,
          email: user.email,
          password,
          roleId: user.roleId,
        },
      });

    }

  }

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());