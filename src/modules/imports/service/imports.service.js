const repo = require("../repository/imports.repository");

async function getAllImports({ page = 1, limit = 10, warehouseId, supplierId } = {}) {
  const skip = (page - 1) * limit;
  const { items, total } = await repo.findAll({
    skip,
    take: Number(limit),
    warehouseId,
    supplierId,
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

async function getImportById(id) {
  const receipt = await repo.findById(id);
  if (!receipt) throw { status: 404, message: "Import receipt not found" };
  return receipt;
}

async function createImport({ warehouseId, supplierId, note, items }, userId) {
  // 1. Tạo phiếu nhập
  const receipt = await repo.create({
    warehouseId,
    supplierId,
    createdBy: userId,
    note,
    items,
  });

  // 2. Cập nhật inventory + tạo transaction cho từng sản phẩm
  await Promise.all(
    items.map(async (item) => {
      // Cộng tồn kho
      await repo.upsertInventory(warehouseId, item.productId, item.quantity);

      // Ghi lịch sử giao dịch
      await repo.createTransaction({
        warehouseId,
        productId:       item.productId,
        type:            "IMPORT",
        quantity:        item.quantity,
        importReceiptId: receipt.id,
        createdBy:       userId,
      });
    })
  );

  return receipt;
}

module.exports = {
  getAllImports,
  getImportById,
  createImport,
};