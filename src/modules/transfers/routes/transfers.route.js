const express    = require("express");
const router     = express.Router();
const controller = require("../controller/transfers.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/transfers.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");

// Lấy danh sách yêu cầu chuyển kho
router.get("/",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "WAREHOUSE_MANAGER", "STORE_MANAGER"),
  validate(validation.queryTransferSchema, "query"),
  controller.getAll
);
router.get("/:id",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "WAREHOUSE_MANAGER", "STORE_MANAGER"),
  controller.getById
)


module.exports = router;