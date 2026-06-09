const repo = require("../repository/inventory.repository");

async function getAllInventory({ page = 1, limit = 10, warehouseId, productId } = {}) {
  const skip = (page - 1) * limit;
  const { items, total } = await repo.findAll({
    skip,
    take:   Number(limit),
    warehouseId,
    productId,
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

async function getBranchInventory({ branchId, page = 1, limit = 10, productId } = {}) {
  const skip = (page - 1) * limit;
  const { items, total } = await repo.findByBranch({
    branchId,
    skip,
    take:   Number(limit),
    productId,
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

async function getProductInventory(productId) {
  const items = await repo.findByProduct(productId);

  // Tính tổng available + faulty trên tất cả kho
  const summary = items.reduce(
    (acc, inv) => {
      acc.totalAvailable += inv.availableQuantity;
      acc.totalFaulty    += inv.faultyQuantity;
      return acc;
    },
    { totalAvailable: 0, totalFaulty: 0 }
  );

  return { items, summary };
}

async function getWarehouseInventory(warehouseId) {
  return repo.findByWarehouse(warehouseId);
}

module.exports = {
  getAllInventory,
  getBranchInventory,
  getProductInventory,
  getWarehouseInventory,
};