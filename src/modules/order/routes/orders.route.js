const express    = require("express");
const router     = express.Router();
const controller = require("../controller/orders.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/orders.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");
const {
  ROLES,
  ORDER_ACCESS_ROLE_VALUES,
  BACKOFFICE_ROLE_VALUES,
} = require("../../../shared/constants/roles");

// Đề xuất chi nhánh có đủ hàng (customer dùng trước khi đặt)
router.post("/suggest-branches",
  authMiddleware,
  requireRole(ROLES.CUSTOMER),
  validate(validation.suggestBranchSchema),
  controller.suggestBranches
);

// Lấy danh sách đơn hàng
router.get("/",
  authMiddleware,
  requireRole(...ORDER_ACCESS_ROLE_VALUES),
  validate(validation.queryOrderSchema, "query"),
  controller.getAll
);

// Lấy chi tiết 1 đơn hàng
router.get("/:id",
  authMiddleware,
  requireRole(...ORDER_ACCESS_ROLE_VALUES),
  controller.getById
);

// Tạo đơn hàng mới
router.post("/",
  authMiddleware,
  requireRole(ROLES.CUSTOMER),
  validate(validation.createOrderSchema),
  controller.create
);

// Staff xác nhận đơn → trừ tồn kho
router.patch("/:id/confirm",
  authMiddleware,
  requireRole(...BACKOFFICE_ROLE_VALUES),
  controller.confirm
);

// Staff cập nhật trạng thái đơn
router.patch("/:id/status",
  authMiddleware,
  requireRole(...BACKOFFICE_ROLE_VALUES),
  validate(validation.updateStatusSchema),
  controller.updateStatus
);

// Huỷ đơn hàng
router.patch("/:id/cancel",
  authMiddleware,
  requireRole(...ORDER_ACCESS_ROLE_VALUES),
  controller.cancel
);

module.exports = router;