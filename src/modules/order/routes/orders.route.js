const express    = require("express");
const router     = express.Router();
const controller = require("../controller/orders.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/orders.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");

// Đề xuất chi nhánh có đủ hàng (customer dùng trước khi đặt)
router.post("/suggest-branches",
  authMiddleware,
  requireRole("CUSTOMER"),
  validate(validation.suggestBranchSchema),
  controller.suggestBranches
);

// Lấy danh sách đơn hàng
router.get("/",
  authMiddleware,
  requireRole("CUSTOMER", "STAFF", "STORE_MANAGER", "SYSTEM_ADMIN"),
  validate(validation.queryOrderSchema, "query"),
  controller.getAll
);

// Lấy chi tiết 1 đơn hàng
router.get("/:id",
  authMiddleware,
  requireRole("CUSTOMER", "STAFF", "STORE_MANAGER", "SYSTEM_ADMIN"),
  controller.getById
);

// Tạo đơn hàng mới
router.post("/",
  authMiddleware,
  requireRole("CUSTOMER"),
  validate(validation.createOrderSchema),
  controller.create
);

// Staff xác nhận đơn → trừ tồn kho
router.patch("/:id/confirm",
  authMiddleware,
  requireRole("STAFF", "STORE_MANAGER", "SYSTEM_ADMIN"),
  controller.confirm
);

// Staff cập nhật trạng thái đơn
router.patch("/:id/status",
  authMiddleware,
  requireRole("STAFF", "STORE_MANAGER", "SYSTEM_ADMIN"),
  validate(validation.updateStatusSchema),
  controller.updateStatus
);

// Huỷ đơn hàng
router.patch("/:id/cancel",
  authMiddleware,
  requireRole("CUSTOMER", "STAFF", "STORE_MANAGER", "SYSTEM_ADMIN"),
  controller.cancel
);

module.exports = router;