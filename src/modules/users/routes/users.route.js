const express    = require("express");
const router     = express.Router();
const controller = require("../controller/users.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/users.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");
const {
  ROLES,
  STORE_MANAGEMENT_ROLE_VALUES,
} = require("../../../shared/constants/roles");

// Lấy danh sách nhân viên
router.get("/",
  authMiddleware,
  requireRole(...STORE_MANAGEMENT_ROLE_VALUES),
  validate(validation.queryUserSchema, "query"),
  controller.getAll
);

// Lấy chi tiết 1 nhân viên
router.get("/:id",
  authMiddleware,
  requireRole(...STORE_MANAGEMENT_ROLE_VALUES),
  controller.getById
);

// Tạo tài khoản nhân viên mới
router.post("/",
  authMiddleware,
  requireRole(ROLES.SYSTEM_ADMIN),
  validate(validation.createUserSchema),
  controller.create
);

// Cập nhật thông tin nhân viên
router.put("/:id",
  authMiddleware,
  requireRole(ROLES.SYSTEM_ADMIN),
  validate(validation.updateUserSchema),
  controller.update
);

// Reset password nhân viên
router.patch("/:id/reset-password",
  authMiddleware,
  requireRole(ROLES.SYSTEM_ADMIN),
  validate(validation.resetPasswordSchema),
  controller.resetPassword
);

// Kích hoạt / vô hiệu hoá tài khoản
router.patch("/:id/status",
  authMiddleware,
  requireRole(...STORE_MANAGEMENT_ROLE_VALUES),
  validate(validation.toggleStatusSchema),
  controller.toggleStatus
);

// Soft delete nhân viên
router.delete("/:id",
  authMiddleware,
  requireRole(ROLES.SYSTEM_ADMIN),
  controller.remove
);

module.exports = router;