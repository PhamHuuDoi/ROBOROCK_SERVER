const service = require("../service/inventory.service");
const MESSAGES = require("../../../shared/constants/messages");
const success = require("../../../shared/responses/success");

// GET /inventory
async function getAll(req, res, next) {
  try {
    console.log("Validated query:", req.validated);
    const result = await service.getAllInventory(req.validated);
    success(res, 200, MESSAGES.INVENTORY.GET_ALL_SUCCESS, result);
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
    success(res, 200, MESSAGES.INVENTORY.GET_BY_BRANCH_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// GET /inventory/product/:productId
async function getByProduct(req, res, next) {
  try {
    const result = await service.getProductInventory(req.params.productId);
    success(res, 200, MESSAGES.INVENTORY.GET_BY_PRODUCT_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// GET /inventory/warehouse/:warehouseId
async function getByWarehouse(req, res, next) {
  try {
    const result = await service.getWarehouseInventory(req.params.warehouseId);
    success(res, 200, MESSAGES.INVENTORY.GET_BY_WAREHOUSE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getByBranch, getByProduct, getByWarehouse };
