const prisma = require("../../../config/prisma");

async function findAll({ skip = 0, take = 10, warehouseId, supplierId } = {}) {
  const where = {};
  if (warehouseId) where.warehouseId = Number(warehouseId);
  if (supplierId)  where.supplierId  = Number(supplierId);

  const [items, total] = await Promise.all([
    prisma.importReceipt.findMany({
      where,
      skip,
      take,
      include: {
        warehouse: { select: { id: true, name: true } },
        supplier:  { select: { id: true, name: true } },
        creator:   { select: { id: true, fullName: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.importReceipt.count({ where }),
  ]);

  return { items, total };
}

async function findById(id) {
  return prisma.importReceipt.findUnique({
    where: { id: Number(id) },
    include: {
      warehouse: { select: { id: true, name: true } },
      supplier:  { select: { id: true, name: true } },
      creator:   { select: { id: true, fullName: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true, thumbnail: true } },
        },
      },
    },
  });
}

async function create({ warehouseId, supplierId, createdBy, note, items }) {
  return prisma.importReceipt.create({
    data: {
      warehouseId,
      supplierId,
      createdBy,
      note,
      items: {
        create: items.map((i) => ({
          productId:   i.productId,
          quantity:    i.quantity,
          importPrice: i.importPrice,
        })),
      },
    },
    include: {
      warehouse: { select: { id: true, name: true } },
      supplier:  { select: { id: true, name: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true } },
        },
      },
    },
  });
}

// Upsert inventory sau khi nhập
async function upsertInventory(warehouseId, productId, quantity) {
  return prisma.inventory.upsert({
    where: {
      uq_inventories_wh_prod: { warehouseId, productId },
    },
    update: { availableQuantity: { increment: quantity } },
    create: { warehouseId, productId, availableQuantity: quantity },
  });
}

// Tạo inventory transaction
async function createTransaction(data) {
  return prisma.inventoryTransaction.create({ data });
}

module.exports = {
  findAll,
  findById,
  create,
  upsertInventory,
  createTransaction,
};