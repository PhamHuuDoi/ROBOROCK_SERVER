const prisma = require("../../../config/prisma");

// Lấy danh sách đơn hàng có phân trang và filter
async function findAll({ skip = 0, take = 10, customerId, branchId, status, assignedStaffId } = {}) {
  const where = {};
  if (customerId)      where.customerId      = Number(customerId);
  if (branchId)        where.branchId        = Number(branchId);
  if (status)          where.status          = status;
  if (assignedStaffId) where.assignedStaffId = Number(assignedStaffId);

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take,
      include: {
        customer:      { select: { id: true, fullName: true, email: true } },
        branch:        { select: { id: true, name: true, address: true } },
        assignedStaff: { select: { id: true, fullName: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true, thumbnail: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return { items, total };
}

// Lấy chi tiết 1 đơn hàng theo id
async function findById(id) {
  return prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      customer:      { select: { id: true, fullName: true, email: true } },
      branch:        { select: { id: true, name: true, address: true, phone: true } },
      assignedStaff: { select: { id: true, fullName: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true, thumbnail: true, priceOnline: true } },
        },
      },
      statusHistories: { orderBy: { changedAt: "desc" } },
      payments:        true,
    },
  });
}

// Tạo đơn hàng mới
async function create({ customerId, branchId, shippingAddress, paymentMethod, note, items }) {
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return prisma.order.create({
    data: {
      customerId,
      branchId,
      shippingAddress,
      paymentMethod,
      note,
      totalAmount,
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          quantity:  i.quantity,
          price:     i.price,
        })),
      },
    },
    include: {
      branch: { select: { id: true, name: true, address: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true } },
        },
      },
    },
  });
}

// Cập nhật trạng thái đơn hàng
async function updateStatus(id, data) {
  return prisma.order.update({
    where: { id: Number(id) },
    data,
  });
}

// Ghi lịch sử thay đổi trạng thái đơn hàng
async function createStatusHistory({ orderId, oldStatus, newStatus, changedBy }) {
  return prisma.orderStatusHistory.create({
    data: { orderId, oldStatus, newStatus, changedBy },
  });
}

// Lấy tất cả chi nhánh ACTIVE kèm kho BRANCH
async function findActiveBranchesWithInventory(productIds) {
  return prisma.branch.findMany({
    where: { status: "ACTIVE" },
    include: {
      warehouses: {
        where: { type: "BRANCH" },
        include: {
          inventories: {
            where: { productId: { in: productIds } },
          },
        },
      },
    },
  });
}

// Lấy tồn kho của sản phẩm tại kho chi nhánh
async function findInventory(warehouseId, productId) {
  return prisma.inventory.findUnique({
    where: {
      uq_inventories_wh_prod: { warehouseId, productId },
    },
  });
}

// Trừ tồn kho khi xác nhận đơn hàng
async function decrementInventory(warehouseId, productId, quantity) {
  return prisma.inventory.update({
    where: {
      uq_inventories_wh_prod: { warehouseId, productId },
    },
    data: { availableQuantity: { decrement: quantity } },
  });
}

// Ghi lịch sử giao dịch kho
async function createInventoryTransaction(data) {
  return prisma.inventoryTransaction.create({ data });
}

// Lấy ca đang mở của chi nhánh
async function findOpenShift(branchId) {
  return prisma.shift.findFirst({
    where: { branchId: Number(branchId), status: "OPEN" },
    include: {
      shiftStaffs: {
        where: { leftAt: null },
        select: { staffId: true },
      },
    },
  });
}

// Lấy thông tin sản phẩm theo id
async function findProductById(productId) {
  return prisma.product.findUnique({
    where: { id: Number(productId) },
    select: { id: true, name: true, priceOnline: true, status: true, deletedAt: true },
  });
}

// Xóa tất cả items trong giỏ hàng sau khi đặt hàng thành công
async function clearCartByCustomer(customerId) {
  const cart = await prisma.cart.findFirst({ where: { customerId: Number(customerId) } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}

module.exports = {
  findAll,
  findById,
  create,
  updateStatus,
  createStatusHistory,
  findActiveBranchesWithInventory,
  findInventory,
  decrementInventory,
  createInventoryTransaction,
  findOpenShift,
  findProductById,
  clearCartByCustomer,
};