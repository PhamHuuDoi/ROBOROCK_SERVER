const repo = require("../repository/orders.repository");

// Tính khoảng cách giữa 2 tọa độ theo công thức Haversine (km)
function calcDistance(lat1, lon1, lat2, lon2) {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Tìm chi nhánh phù hợp: có đủ hàng, ưu tiên gần nhất nếu có tọa độ
async function findSuitableBranch(items, customerLat, customerLng) {
  const productIds = items.map((i) => i.productId);
  const branches   = await repo.findActiveBranchesWithInventory(productIds);

  const suitable = [];

  for (const branch of branches) {
    // Gộp tất cả kho BRANCH của chi nhánh
    const allInventories = branch.warehouses.flatMap((w) => w.inventories);

    // Kiểm tra từng sản phẩm có đủ tồn kho không
    const hasStock = items.every((item) => {
      const inv = allInventories.find((i) => i.productId === item.productId);
      return inv && inv.availableQuantity >= item.quantity;
    });

    if (!hasStock) continue;

    // Tính khoảng cách nếu có tọa độ
    let distance = null;
    if (customerLat && customerLng && branch.latitude && branch.longitude) {
      distance = calcDistance(
        Number(customerLat),
        Number(customerLng),
        Number(branch.latitude),
        Number(branch.longitude)
      );
    }

    suitable.push({ ...branch, distance });
  }

  if (suitable.length === 0) return null;

  // Sắp xếp theo khoảng cách nếu có, không thì theo id
  suitable.sort((a, b) => {
    if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
    return a.id - b.id;
  });

  return suitable[0];
}

// Lấy danh sách đơn hàng có phân trang
async function getAllOrders({ page = 1, limit = 10, customerId, branchId, status, assignedStaffId } = {}) {
  const skip = (page - 1) * limit;
  const { items, total } = await repo.findAll({
    skip,
    take: Number(limit),
    customerId,
    branchId,
    status,
    assignedStaffId,
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

// Lấy chi tiết 1 đơn hàng, throw 404 nếu không tìm thấy
async function getOrderById(id) {
  const order = await repo.findById(id);
  if (!order) throw { status: 404, message: "Order not found" };
  return order;
}

// Tạo đơn hàng từ danh sách sản phẩm, tự động tìm chi nhánh nếu không chọn
async function createOrder({ items, shippingAddress, paymentMethod, note, branchId, customerLat, customerLng }, customerId) {
  // Validate từng sản phẩm
  const orderItems = [];
  for (const item of items) {
    const product = await repo.findProductById(item.productId);
    if (!product || product.deletedAt) {
      throw { status: 404, message: `Sản phẩm ${item.productId} không tồn tại` };
    }
    if (product.status !== "ACTIVE") {
      throw { status: 400, message: `Sản phẩm ${product.name} hiện không có sẵn` };
    }
    orderItems.push({ ...item, price: Number(product.priceOnline) });
  }

  // Tìm chi nhánh phù hợp
  let selectedBranchId = branchId;
  if (!selectedBranchId) {
    const branch = await findSuitableBranch(orderItems, customerLat, customerLng);
    if (!branch) {
      throw { status: 400, message: "Không có chi nhánh nào đủ hàng để xử lý đơn" };
    }
    selectedBranchId = branch.id;
  }

  // Tạo đơn hàng
  const order = await repo.create({
    customerId,
    branchId:       selectedBranchId,
    shippingAddress,
    paymentMethod,
    note,
    items:          orderItems,
  });

  // Ghi lịch sử trạng thái
  await repo.createStatusHistory({
    orderId:    order.id,
    oldStatus:  null,
    newStatus:  "PENDING",
    changedBy:  customerId,
  });

  // Xóa giỏ hàng sau khi đặt hàng thành công
  await repo.clearCartByCustomer(customerId);

  return order;
}

// Đề xuất chi nhánh có đủ hàng cho customer trước khi đặt
async function suggestBranches(items, customerLat, customerLng) {
  const productIds = items.map((i) => i.productId);
  const branches   = await repo.findActiveBranchesWithInventory(productIds);

  const result = [];

  for (const branch of branches) {
    const allInventories = branch.warehouses.flatMap((w) => w.inventories);

    const hasStock = items.every((item) => {
      const inv = allInventories.find((i) => i.productId === item.productId);
      return inv && inv.availableQuantity >= item.quantity;
    });

    if (!hasStock) continue;

    let distance = null;
    if (customerLat && customerLng && branch.latitude && branch.longitude) {
      distance = calcDistance(
        Number(customerLat),
        Number(customerLng),
        Number(branch.latitude),
        Number(branch.longitude)
      );
    }

    result.push({
      id:       branch.id,
      name:     branch.name,
      address:  branch.address,
      phone:    branch.phone,
      distance: distance ? `${distance.toFixed(1)} km` : null,
    });
  }

  result.sort((a, b) => {
    if (a.distance !== null && b.distance !== null) {
      return parseFloat(a.distance) - parseFloat(b.distance);
    }
    return a.id - b.id;
  });

  return result;
}

// Staff xác nhận đơn → trừ tồn kho
async function confirmOrder(id, staffId) {
  const order = await getOrderById(id);

  if (order.status !== "PENDING") {
    throw { status: 400, message: `Không thể xác nhận đơn có trạng thái ${order.status}` };
  }

  // Kiểm tra staff đang trong ca làm việc của chi nhánh
  const shift = await repo.findOpenShift(order.branchId);
  if (!shift) {
    throw { status: 400, message: "Chi nhánh này hiện không có ca làm việc đang mở" };
  }

  const staffInShift = shift.shiftStaffs.some((s) => s.staffId === staffId);
  if (!staffInShift) {
    throw { status: 403, message: "Bạn không thuộc ca làm việc của chi nhánh này" };
  }

  // Tìm kho BRANCH của chi nhánh
  const warehouse = await repo.findBranchWarehouse(order.branchId);
  if (!warehouse) {
    throw { status: 400, message: "Chi nhánh này chưa có kho" };
  }

  // Kiểm tra tồn kho và trừ từng sản phẩm
  for (const item of order.items) {
    const inventory = await repo.findInventory(warehouse.id, item.productId);
    if (!inventory || inventory.availableQuantity < item.quantity) {
      throw {
        status:  400,
        message: `Không đủ hàng cho sản phẩm ${item.product.name}. Tồn kho: ${inventory?.availableQuantity ?? 0}`,
      };
    }

    // Trừ tồn kho
    await repo.decrementInventory(warehouse.id, item.productId, item.quantity);

    // Ghi lịch sử giao dịch kho
    await repo.createInventoryTransaction({
      warehouseId:  warehouse.id,
      productId:    item.productId,
      type:         "ONLINE_ORDER",
      quantity:     item.quantity,
      onlineOrderId: order.id,
      createdBy:    staffId,
    });
  }

  // Cập nhật trạng thái đơn hàng
  const updated = await repo.updateStatus(id, {
    status:         "CONFIRMED",
    confirmedAt:    new Date(),
    assignedStaffId: staffId,
  });

  // Ghi lịch sử trạng thái
  await repo.createStatusHistory({
    orderId:   order.id,
    oldStatus: "PENDING",
    newStatus: "CONFIRMED",
    changedBy: staffId,
  });

  return updated;
}

// Staff cập nhật trạng thái đơn theo flow
async function updateOrderStatus(id, newStatus, staffId) {
  const order = await getOrderById(id);

  // Định nghĩa flow trạng thái hợp lệ
  const validTransitions = {
    CONFIRMED: "PACKING",
    PACKING:   "SHIPPING",
    SHIPPING:  "DELIVERED",
  };

  if (validTransitions[order.status] !== newStatus) {
    throw {
      status:  400,
      message: `Không thể chuyển từ ${order.status} sang ${newStatus}`,
    };
  }

  const timeFields = {
    PACKING:   { packedAt:    new Date() },
    SHIPPING:  { shippedAt:   new Date() },
    DELIVERED: { deliveredAt: new Date() },
  };

  const updated = await repo.updateStatus(id, {
    status: newStatus,
    ...timeFields[newStatus],
  });

  await repo.createStatusHistory({
    orderId:   order.id,
    oldStatus: order.status,
    newStatus,
    changedBy: staffId,
  });

  return updated;
}

// Customer hoặc staff huỷ đơn, chỉ huỷ được khi PENDING
async function cancelOrder(id, userId, userRole) {
  const order = await getOrderById(id);

  if (userRole === "CUSTOMER" && order.customerId !== userId) {
    throw { status: 403, message: "Bạn không có quyền huỷ đơn này" };
  }

  if (order.status !== "PENDING") {
    throw { status: 400, message: "Chỉ có thể huỷ đơn khi đang ở trạng thái PENDING" };
  }

  const updated = await repo.updateStatus(id, {
    status:      "CANCELLED",
    cancelledAt: new Date(),
  });

  await repo.createStatusHistory({
    orderId:   order.id,
    oldStatus: "PENDING",
    newStatus: "CANCELLED",
    changedBy: userId,
  });

  return updated;
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  suggestBranches,
  confirmOrder,
  updateOrderStatus,
  cancelOrder,
};