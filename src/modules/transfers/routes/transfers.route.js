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
// Lấy chi tiết 1 yêu cầu chuyển kho
router.get("/:id",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "WAREHOUSE_MANAGER", "STORE_MANAGER"),
  controller.getById
)
// Tạo yêu cầu chuyển kho
router.post("/",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "WAREHOUSE_MANAGER", "STORE_MANAGER"),
  validate(validation.createTransferSchema),
  controller.create
);
// Duyệt yêu cầu chuyển kho
router.patch("/:id/approve",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "WAREHOUSE_MANAGER"),
  controller.approve
);

// Từ chối yêu cầu chuyển kho
router.patch("/:id/reject",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "WAREHOUSE_MANAGER"),
  controller.reject
);


module.exports = router;