const prisma = require("../../../config/prisma");

async function findAll({ status } = {}) {
  const where = {};
  if (status) where.status = status;

  return prisma.branch.findMany({
    where,
    include: {
      manager: {
        select: { id: true, fullName: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function findById(id) {
  return prisma.branch.findUnique({
    where: { id: Number(id) },
    include: {
      manager: {
        select: { id: true, fullName: true, email: true },
      },
      warehouses:   true,
      branchStaffs: {
        include: {
          staff: { select: { id: true, fullName: true, email: true } },
        },
      },
    },
  });
}

async function create(data) {
  return prisma.branch.create({
    data,
    include: {
      manager: {
        select: { id: true, fullName: true, email: true },
      },
    },
  });
}

async function update(id, data) {
  return prisma.branch.update({
    where: { id: Number(id) },
    data,
    include: {
      manager: {
        select: { id: true, fullName: true, email: true },
      },
    },
  });
}

async function remove(id) {
  return prisma.branch.delete({ where: { id: Number(id) } });
}

// Thêm staff vào chi nhánh
async function addStaff(branchId, staffId) {
  return prisma.branchStaff.create({
    data: { branchId: Number(branchId), staffId: Number(staffId) },
  });
}

// Xóa staff khỏi chi nhánh
async function removeStaff(branchId, staffId) {
  return prisma.branchStaff.delete({
    where: {
      uq_branch_staff: {
        branchId: Number(branchId),
        staffId:  Number(staffId),
      },
    },
  });
}

async function hasOrders(id) {
  const row = await prisma.order.findFirst({ where: { branchId: Number(id) } });
  return !!row;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  addStaff,
  removeStaff,
  hasOrders,
};