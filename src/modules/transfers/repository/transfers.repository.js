const prisma = require("../../../config/prisma");

// Lấy danh sách yêu cầu chuyển kho có phân trang và filter
async function findAll({ skip = 0, take = 10, status, fromWarehouseId, toWarehouseId } = {}) {
  const where = {};
  if (status)          where.status          = status;
  if (fromWarehouseId) where.fromWarehouseId = Number(fromWarehouseId);
  if (toWarehouseId)   where.toWarehouseId   = Number(toWarehouseId);

  const [items, total] = await Promise.all([
    prisma.transferRequest.findMany({
      where,
      skip,
      take,
      include: {
        fromWarehouse: { select: { id: true, name: true } },
        toWarehouse:   { select: { id: true, name: true } },
        requester:     { select: { id: true, fullName: true } },
        approver:      { select: { id: true, fullName: true } },
        receiver:      { select: { id: true, fullName: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.transferRequest.count({ where }),
  ]);

  return { items, total };
}
async function findById(id) {
  return prisma.transferRequest.findUnique({
    where: { id: Number(id) },
    include: {
      fromWarehouse: { select: { id: true, name: true } },
      toWarehouse:   { select: { id: true, name: true } },
      requester:     { select: { id: true, fullName: true } },
      approver:      { select: { id: true, fullName: true } },
      receiver:      { select: { id: true, fullName: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true, thumbnail: true } },
        },
      },
    },
  });
}


module.exports = {
  findAll,
  findById,
};