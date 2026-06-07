const prisma= require("../../../config/prisma");
async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email }, include: { role: true } });
}
async function findUserById(id) {
  return prisma.user.findUnique({ where: { id }, include: { role: true } });
}

async function findRoleByName(name) {
  return prisma.role.findUnique({ where: { name } });
}

async function createUser(data) {
  return prisma.user.create({ data });
}

async function updateUser(id, data) {
  return prisma.user.update({ where: { id }, data });
}

module.exports = {
  findUserByEmail,
  findUserById,
  findRoleByName,
  createUser,
  updateUser,
};