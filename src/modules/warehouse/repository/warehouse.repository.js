const prisma=require('../../../config/prisma');
async function findAll({branchId}={})
{
    const where = {};
    if (branchId) where.branchId = Number(branchId);
    return prisma.warehouse.findMany({ 
        where,
        include:{ branch:true},
        orderBy:{id:'asc'},
     });
}
async function findById(id) {
  return prisma.warehouse.findUnique({
    where: { id: Number(id) },
    include: { branch: true },
  });
}

async function create(data) {
  return prisma.warehouse.create({
    data,
    include: { branch: true },
  });
}

async function update(id, data) {
  return prisma.warehouse.update({
    where: { id: Number(id) },
    data,
    include: { branch: true },
  });
}
async function hasInventory(id) {
  const row = await prisma.inventory.findFirst({
    where: {
      warehouse: { branchId: Number(id) },
      availableQuantity: { gt: 0 },
    },
  });
  return !!row;
}
async function remove(id) {
  return prisma.warehouse.delete({ where: { id: Number(id) }, select: { id: true,name: true } });
}

module.exports = { findAll, findById, create, update, remove, hasInventory };