const service = require("../service/inventory.service");

// GET /inventory
async function getAll(req, res, next) {
  try {
    console.log("Validated query:", req.validated);
    const result = await service.getAllInventory(req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /inventory/branch/:branchId
async function getByBranch(req, res, next) {
  try {
    const result = await service.getBranchInventory({
      branchId: req.params.branchId,
      ...req.validated,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /inventory/product/:productId
async function getByProduct(req, res, next) {
  try {
    const result = await service.getProductInventory(req.params.productId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /inventory/warehouse/:warehouseId
async function getByWarehouse(req, res, next) {
  try {
    const result = await service.getWarehouseInventory(req.params.warehouseId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getByBranch, getByProduct, getByWarehouse };