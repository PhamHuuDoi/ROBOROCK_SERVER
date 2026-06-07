const prisma = require('./config/prisma');
async function test() {
  const roles = await prisma.role.findMany();

  console.log(roles);
}

test()
  .catch(console.error)
  .finally(() => prisma.$disconnect());