const prisma = require("../../../config/prisma");

// Tồn kho toàn bộ (kho tổng)
async function findAll({ skip = 0, take = 10, warehouseId, productId } = {}) {
  const where = {};
  if (warehouseId) where.warehouseId = Number(warehouseId);
  if (productId)   where.productId   = Number(productId);

  const [items, total] = await Promise.all([
    prisma.inventory.findMany({
      where,
      skip,
      take,
      include: {
        product:   { select: { id: true, name: true, sku: true, thumbnail: true } },
        warehouse: { select: { id: true, name: true, type: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.inventory.count({ where }),
  ]);

  return { items, total };
}

// Tồn kho theo chi nhánh (gộp tất cả kho của branch)
async function findByBranch({ branchId, skip = 0, take = 10, productId } = {}) {
  const where = {
    warehouse: { branchId: Number(branchId) },
  };
  if (productId) where.productId = Number(productId);

  const [items, total] = await Promise.all([
    prisma.inventory.findMany({
      where,
      skip,
      take,
      include: {
        product:   { select: { id: true, name: true, sku: true, thumbnail: true } },
        warehouse: { select: { id: true, name: true, type: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.inventory.count({ where }),
  ]);

  return { items, total };
}

// Tồn kho 1 sản phẩm ở tất cả kho
async function findByProduct(productId) {
  return prisma.inventory.findMany({
    where: { productId: Number(productId) },
    include: {
      warehouse: {
        select: { id: true, name: true, type: true, branchId: true },
      },
    },
  });
}

// Tồn kho 1 kho cụ thể
async function findByWarehouse(warehouseId) {
  return prisma.inventory.findMany({
    where: { warehouseId: Number(warehouseId) },
    include: {
      product: { select: { id: true, name: true, sku: true, thumbnail: true } },
    },
    orderBy: { availableQuantity: "desc" },
  });
}

module.exports = {
  findAll,
  findByBranch,
  findByProduct,
  findByWarehouse,
};