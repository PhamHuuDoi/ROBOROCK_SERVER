const repo = require("../repository/transfers.repository");

// Lấy danh sách yêu cầu chuyển kho có phân trang
async function getAllTransfers({ page = 1, limit = 10, status, fromWarehouseId, toWarehouseId } = {}) {
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
      page:       Number(page),
      limit:      Number(limit),
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

async function createTransfer({ fromWarehouseId, toWarehouseId, note, items }, userId, userRole) {
  const fromWarehouse = await repo.findWarehouseById(fromWarehouseId);
  const toWarehouse   = await repo.findWarehouseById(toWarehouseId);

  if (!fromWarehouse) throw { status: 404, message: "Kho nguồn không tồn tại" };
  if (!toWarehouse)   throw { status: 404, message: "Kho đích không tồn tại" };

  // Store Manager chỉ được xin hàng từ kho MAIN về kho BRANCH
  if (userRole === "STORE_MANAGER") {
    if (fromWarehouse.type !== "MAIN") {
      throw { status: 400, message: "Store Manager chỉ được xin hàng từ kho tổng" };
    }
    if (toWarehouse.type !== "BRANCH") {
      throw { status: 400, message: "Store Manager chỉ được xin hàng về kho chi nhánh" };
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
        status:  400,
        message: `Không đủ hàng cho sản phẩm ${item.productId}. Tồn kho: ${inventory?.availableQuantity ?? 0}`,
      };
    }
  }

  return repo.create({ fromWarehouseId, toWarehouseId, requestedBy: userId, note, items });
}

module.exports = {
  getAllTransfers,  
  getTransferById,
  createTransfer,
};