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
async function createRefreshToken({ userId, token, deviceInfo, expiresAt }) {
  return prisma.refreshToken.create({
    data: { userId, token, deviceInfo, expiresAt },
  });
}

async function findRefreshToken(token) {
  return prisma.refreshToken.findUnique({
    where: { token },
    include: { user: { include: { role: true } } },
  });
}

async function deleteRefreshToken(token) {
  return prisma.refreshToken.delete({ where: { token } });
}

async function deleteRefreshTokensByUser(userId) {
  return prisma.refreshToken.deleteMany({ where: { userId } });
}
module.exports = {
  findUserByEmail,
  findUserById,
  findRoleByName,
  createUser,
  updateUser,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteRefreshTokensByUser,
};