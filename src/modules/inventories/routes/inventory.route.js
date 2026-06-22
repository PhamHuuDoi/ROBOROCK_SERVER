const express    = require("express");
const router     = express.Router();
const controller = require("../controller/inventory.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/inventory.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");

const { INVENTORY_ACCESS_ROLE_VALUES } = require("../../../shared/constants/roles");

// Tồn kho toàn bộ
router.get("/",
  authMiddleware,
  requireRole(...INVENTORY_ACCESS_ROLE_VALUES),
  validate(validation.queryInventorySchema, "query"), // ← phải có "query"
  controller.getAll
);

// Tồn kho theo chi nhánh
router.get("/branch/:branchId",
  authMiddleware,
  requireRole(...INVENTORY_ACCESS_ROLE_VALUES),
  validate(validation.queryBranchInventorySchema),
  controller.getByBranch
);

// Tồn kho 1 sản phẩm ở tất cả kho
router.get("/product/:productId",
  authMiddleware,
  requireRole(...INVENTORY_ACCESS_ROLE_VALUES),
  validate(validation.queryInventorySchema),
  controller.getByProduct
);

// Tồn kho 1 kho cụ thể
router.get("/warehouse/:warehouseId",
  authMiddleware,
  requireRole(...INVENTORY_ACCESS_ROLE_VALUES),
  controller.getByWarehouse
);

module.exports = router;