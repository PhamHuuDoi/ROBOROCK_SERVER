const prisma = require("../../../config/prisma");

// Lấy danh sách đơn POS có phân trang và filter
async function findAll({ skip = 0, take = 10, branchId, shiftId, staffId } = {}) {
  const where = {};
  if (branchId) where.branchId = Number(branchId);
  if (shiftId)  where.shiftId  = Number(shiftId);
  if (staffId)  where.staffId  = Number(staffId);

  const [items, total] = await Promise.all([
    prisma.posOrder.findMany({
      where,
      skip,
      take,
      include: {
        branch: { select: { id: true, name: true } },
        staff:  { select: { id: true, fullName: true } },
        shift:  { select: { id: true, name: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true } },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.posOrder.count({ where }),
  ]);

  return { items, total };
}

// Lấy chi tiết 1 đơn POS theo id
async function findById(id) {
  return prisma.posOrder.findUnique({
    where: { id: Number(id) },
    include: {
      branch: { select: { id: true, name: true, address: true, phone: true } },
      staff:  { select: { id: true, fullName: true } },
      shift:  { select: { id: true, name: true, status: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true, thumbnail: true } },
        },
      },
      payments: true,
    },
  });
}

// Lấy thông tin ca làm việc theo id, kèm danh sách staff đang trong ca
async function findShiftById(shiftId) {
  return prisma.shift.findUnique({
    where: { id: Number(shiftId) },
    include: {
      shiftStaffs: {
        where: { leftAt: null },
        select: { staffId: true },
      },
    },
  });
}

// Lấy kho BRANCH của 1 chi nhánh
async function findBranchWarehouse(branchId) {
  return prisma.warehouse.findFirst({
    where: { branchId: Number(branchId), type: "BRANCH" },
  });
}

// Lấy tồn kho 1 sản phẩm tại 1 kho
async function findInventory(warehouseId, productId) {
  return prisma.inventory.findUnique({
    where: {
      uq_inventories_wh_prod: { warehouseId, productId },
    },
  });
}

// Trừ tồn kho khi bán hàng
async function decrementInventory(warehouseId, productId, quantity) {
  return prisma.inventory.update({
    where: {
      uq_inventories_wh_prod: { warehouseId, productId },
    },
    data: { availableQuantity: { decrement: quantity } },
  });
}

// Lấy thông tin sản phẩm theo id
async function findProductById(productId) {
  return prisma.product.findUnique({
    where: { id: Number(productId) },
    select: { id: true, name: true, pricePos: true, status: true, deletedAt: true },
  });
}

// Tạo đơn POS, payment, trừ tồn kho trong 1 transaction
async function createPosOrderTransaction({ branchId, staffId, shiftId, paymentMethod, note, items, totalAmount, warehouseId }) {
  return prisma.$transaction(async (tx) => {
    // Tạo đơn POS
    const posOrder = await tx.posOrder.create({
      data: {
        branchId,
        staffId,
        shiftId,
        totalAmount,
        paymentMethod,
        status: "COMPLETED",
        note,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity:  i.quantity,
            price:     i.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true } },
          },
        },
      },
    });

    // Tạo payment, thanh toán ngay
    await tx.payment.create({
      data: {
        posOrderId: posOrder.id,
        method:     paymentMethod,
        amount:     totalAmount,
        status:     "PAID",
        paidAt:     new Date(),
      },
    });

    // Trừ tồn kho + ghi transaction cho từng sản phẩm
    for (const item of items) {
      await tx.inventory.update({
        where: {
          uq_inventories_wh_prod: { warehouseId, productId: item.productId },
        },
        data: { availableQuantity: { decrement: item.quantity } },
      });

      await tx.inventoryTransaction.create({
        data: {
          warehouseId,
          productId:  item.productId,
          type:       "POS_SELL",
          quantity:   item.quantity,
          posOrderId: posOrder.id,
          createdBy:  staffId,
        },
      });
    }

    return posOrder;
  });
}

module.exports = {
  findAll,
  findById,
  findShiftById,
  findBranchWarehouse,
  findInventory,
  decrementInventory,
  findProductById,
  createPosOrderTransaction,
};