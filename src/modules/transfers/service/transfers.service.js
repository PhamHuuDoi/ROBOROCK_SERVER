const repo = require("../repository/transfers.repository");

// Lấy danh sách yêu cầu chuyển kho có phân trang
async function getAllTransfers({
  page = 1,
  limit = 10,
  status,
  fromWarehouseId,
  toWarehouseId,
} = {}) {
  const skip = (page - 1) * limit;
  const { items, total } = await repo.findAll({
    skip,
    take: Number(limit),
    status,
    fromWarehouseId,
    toWarehouseId,
  });

  return {
    items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
}
// Lấy chi tiết 1 yêu cầu chuyển kho, throw 404 nếu không tìm thấy
async function getTransferById(id) {
  const transfer = await repo.findById(id);
  if (!transfer) throw { status: 404, message: "Transfer request not found" };
  return transfer;
}

async function createTransfer(
  { fromWarehouseId, toWarehouseId, note, items },
  userId,
  userRole,
) {
  const fromWarehouse = await repo.findWarehouseById(fromWarehouseId);
  const toWarehouse = await repo.findWarehouseById(toWarehouseId);

  if (!fromWarehouse) throw { status: 404, message: "Kho nguồn không tồn tại" };
  if (!toWarehouse) throw { status: 404, message: "Kho đích không tồn tại" };

  // Store Manager chỉ được xin hàng từ kho MAIN về kho BRANCH
  if (userRole === "STORE_MANAGER") {
    if (fromWarehouse.type !== "MAIN") {
      throw {
        status: 400,
        message: "Store Manager chỉ được xin hàng từ kho tổng",
      };
    }
    if (toWarehouse.type !== "BRANCH") {
      throw {
        status: 400,
        message: "Store Manager chỉ được xin hàng về kho chi nhánh",
      };
    }
  }

  // Warehouse Manager chỉ được chuyển từ kho MAIN
  if (userRole === "WAREHOUSE_MANAGER") {
    if (fromWarehouse.type !== "MAIN") {
      throw { status: 400, message: "Chỉ được chuyển hàng từ kho tổng" };
    }
  }

  // Kiểm tra tồn kho đủ không trước khi tạo
  for (const item of items) {
    const inventory = await repo.findInventory(fromWarehouseId, item.productId);
    if (!inventory || inventory.availableQuantity < item.quantity) {
      throw {
        status: 400,
        message: `Không đủ hàng cho sản phẩm ${item.productId}. Tồn kho: ${inventory?.availableQuantity ?? 0}`,
      };
    }
  }

  return repo.create({
    fromWarehouseId,
    toWarehouseId,
    requestedBy: userId,
    note,
    items,
  });
}
// Duyệt yêu cầu chuyển kho, chỉ duyệt được khi status là PENDING
async function approveTransfer(id, userId) {
  const transfer = await getTransferById(id);

  if (transfer.status !== "PENDING") {
    throw {
      status: 400,
      message: `Không thể duyệt đơn có trạng thái ${transfer.status}`,
    };
  }

  return repo.updateStatus(id, {
    status: "APPROVED",
    approvedBy: userId,
  });
}

// Từ chối yêu cầu chuyển kho, chỉ từ chối được khi status là PENDING
async function rejectTransfer(id, userId) {
  const transfer = await getTransferById(id);

  if (transfer.status !== "PENDING") {
    throw {
      status: 400,
      message: `Không thể từ chối đơn có trạng thái ${transfer.status}`,
    };
  }

  return repo.updateStatus(id, {
    status: "REJECTED",
    approvedBy: userId,
  });
}
// Hoàn thành chuyển kho: trừ kho nguồn, cộng kho đích, ghi transaction
async function completeTransfer(id, userId) {
  const transfer = await getTransferById(id);

  if (transfer.status !== "APPROVED") {
    throw { status: 400, message: `Không thể hoàn thành đơn có trạng thái ${transfer.status}` };
  }

  for (const item of transfer.items) {
    // Kiểm tra lại tồn kho lần 2 tránh race condition
    const inventory = await repo.findInventory(transfer.fromWarehouseId, item.productId);
    if (!inventory || inventory.availableQuantity < item.quantity) {
      throw {
        status:  400,
        message: `Không đủ hàng cho sản phẩm ${item.productId} khi hoàn thành`,
      };
    }

    // Trừ kho nguồn
    await repo.decrementInventory(transfer.fromWarehouseId, item.productId, item.quantity);

    // Cộng kho đích
    await repo.incrementInventory(transfer.toWarehouseId, item.productId, item.quantity);

    // Ghi transaction xuất kho nguồn
    await repo.createTransaction({
      warehouseId:       transfer.fromWarehouseId,
      productId:         item.productId,
      type:              "TRANSFER_OUT",
      quantity:          item.quantity,
      transferRequestId: transfer.id,
      createdBy:         userId,
    });

    // Ghi transaction nhập kho đích
    await repo.createTransaction({
      warehouseId:       transfer.toWarehouseId,
      productId:         item.productId,
      type:              "TRANSFER_IN",
      quantity:          item.quantity,
      transferRequestId: transfer.id,
      createdBy:         userId,
    });
  }

  return repo.updateStatus(id, {
    status:      "COMPLETED",
    receivedBy:  userId,
    receivedAt:  new Date(),
    completedAt: new Date(),
  });
}
module.exports = {
  getAllTransfers,
  getTransferById,
  createTransfer,
  approveTransfer,
  rejectTransfer,
  approveTransfer,
  rejectTransfer,
 completeTransfer,
};
