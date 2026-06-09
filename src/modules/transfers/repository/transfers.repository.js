const prisma = require("../../../config/prisma");

// Lấy danh sách yêu cầu chuyển kho có phân trang và filter
async function findAll({
  skip = 0,
  take = 10,
  status,
  fromWarehouseId,
  toWarehouseId,
} = {}) {
  const where = {};
  if (status) where.status = status;
  if (fromWarehouseId) where.fromWarehouseId = Number(fromWarehouseId);
  if (toWarehouseId) where.toWarehouseId = Number(toWarehouseId);

  const [items, total] = await Promise.all([
    prisma.transferRequest.findMany({
      where,
      skip,
      take,
      include: {
        fromWarehouse: { select: { id: true, name: true } },
        toWarehouse: { select: { id: true, name: true } },
        requester: { select: { id: true, fullName: true } },
        approver: { select: { id: true, fullName: true } },
        receiver: { select: { id: true, fullName: true } },
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
      toWarehouse: { select: { id: true, name: true } },
      requester: { select: { id: true, fullName: true } },
      approver: { select: { id: true, fullName: true } },
      receiver: { select: { id: true, fullName: true } },
      items: {
        include: {
          product: {
            select: { id: true, name: true, sku: true, thumbnail: true },
          },
        },
      },
    },
  });
}
// Lấy thông tin kho theo id
async function findWarehouseById(id) {
  return prisma.warehouse.findUnique({ where: { id: Number(id) } });
}
// Lấy tồn kho của 1 sản phẩm trong 1 kho
async function findInventory(warehouseId, productId) {
  return prisma.inventory.findUnique({
    where: {
      uq_inventories_wh_prod: { warehouseId, productId },
    },
  });
}
// Tạo yêu cầu chuyển kho mới
async function create({
  fromWarehouseId,
  toWarehouseId,
  requestedBy,
  note,
  items,
}) {
  return prisma.transferRequest.create({
    data: {
      fromWarehouseId,
      toWarehouseId,
      requestedBy,
      note,
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      },
    },
    include: {
      fromWarehouse: { select: { id: true, name: true } },
      toWarehouse: { select: { id: true, name: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true } },
        },
      },
    },
  });
}
// Cập nhật trạng thái yêu cầu chuyển kho
async function updateStatus(id, data) {
  return prisma.transferRequest.update({
    where: { id: Number(id) },
    data,
  });
}
// Trừ tồn kho kho nguồn
async function decrementInventory(warehouseId, productId, quantity) {
  return prisma.inventory.update({
    where: {
      uq_inventories_wh_prod: { warehouseId, productId },
    },
    data: { availableQuantity: { decrement: quantity } },
  });
}
// Cộng tồn kho kho đích, tạo mới nếu chưa có
async function incrementInventory(warehouseId, productId, quantity) {
  return prisma.inventory.upsert({
    where: {
      uq_inventories_wh_prod: { warehouseId, productId },
    },
    update: { availableQuantity: { increment: quantity } },
    create: { warehouseId, productId, availableQuantity: quantity },
  });
}

// Tạo bản ghi lịch sử giao dịch kho
async function createTransaction(data) {
  return prisma.inventoryTransaction.create({ data });
}
module.exports = {
  findAll,
  findById,
  findWarehouseById,
  findInventory,
  create,
  updateStatus,
  decrementInventory,
  incrementInventory,
  createTransaction,
};
