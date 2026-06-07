const prisma = require("../../../config/prisma");


async function findMany(
  page = 1,
  limit = 10
) {
  return prisma.category.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc"
    }
  });
}

async function findById(id) {
  return prisma.category.findUnique({ where: { id: Number(id) } });
}
async function findBySlug(slug) {
  return prisma.category.findUnique({
    where: { slug }
  });
}
async function create(data) {
  return prisma.category.create({ data });
}

async function update(id, data) {
  return prisma.category.update({ where: { id: Number(id) }, data });
}

async function remove(id) {
  return prisma.category.delete({ where: { id: Number(id) } });
}

module.exports = { findMany, findById, findBySlug, create, update, remove };
