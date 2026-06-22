const repo = require("../repository/pos.repository");

// Lấy danh sách đơn POS có phân trang
async function getAllPosOrders({ page = 1, limit = 10, branchId, shiftId, staffId } = {}) {
  const skip = (page - 1) * limit;
  const { items, total } = await repo.findAll({
    skip,
    take: Number(limit),
    branchId,
    shiftId,
    staffId,
  });

  return {
    items,
    pagination: {
      total,
      page:       Number(page),
      limit:      Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Lấy chi tiết 1 đơn POS, throw 404 nếu không tìm thấy
async function getPosOrderById(id) {
  const order = await repo.findById(id);
  if (!order) throw { status: 404, message: "POS order not found" };
  return order;
}

// Tạo đơn POS, thanh toán ngay, trừ tồn kho ngay
async function createPosOrder({ shiftId, paymentMethod, note, items }, staffId) {
  // Kiểm tra ca làm việc tồn tại và đang mở
  const shift = await repo.findShiftById(shiftId);
  if (!shift) throw { status: 404, message: "Shift not found" };
  if (shift.status !== "OPEN") throw { status: 400, message: "Ca làm việc này đã đóng" };

  // Kiểm tra staff đang trong ca
  const staffInShift = shift.shiftStaffs.some((s) => s.staffId === staffId);
  if (!staffInShift) {
    throw { status: 403, message: "Bạn không thuộc ca làm việc này" };
  }

  // Lấy kho BRANCH của chi nhánh
  const warehouse = await repo.findBranchWarehouse(shift.branchId);
  if (!warehouse) throw { status: 400, message: "Chi nhánh chưa có kho" };

  // Validate từng sản phẩm + kiểm tra tồn kho
  const orderItems = [];
  for (const item of items) {
    const product = await repo.findProductById(item.productId);
    if (!product || product.deletedAt) {
      throw { status: 404, message: `Sản phẩm ${item.productId} không tồn tại` };
    }
    if (product.status !== "ACTIVE") {
      throw { status: 400, message: `Sản phẩm ${product.name} hiện không có sẵn` };
    }

    const inventory = await repo.findInventory(warehouse.id, item.productId);
    if (!inventory || inventory.availableQuantity < item.quantity) {
      throw {
        status:  400,
        message: `Không đủ hàng cho sản phẩm ${product.name}. Tồn kho: ${inventory?.availableQuantity ?? 0}`,
      };
    }

    orderItems.push({
      productId: item.productId,
      quantity:  item.quantity,
      price:     Number(product.pricePos),
    });
  }

  // Tính tổng tiền
  const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Tạo đơn + payment + trừ kho trong 1 transaction
  return repo.createPosOrderTransaction({
    branchId:      shift.branchId,
    staffId,
    shiftId,
    paymentMethod,
    note,
    items:         orderItems,
    totalAmount,
    warehouseId:   warehouse.id,
  });
}

module.exports = {
  getAllPosOrders,
  getPosOrderById,
  createPosOrder,
};