const express = require("express");
const router  = express.Router();
const controller = require("../controller/shifts.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/shifts");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");
const {
  ROLES,
  BACKOFFICE_ROLE_VALUES,
  STORE_MANAGEMENT_ROLE_VALUES,
} = require('../../../shared/constants/roles');

// Lấy danh sách ca làm việc — SYSTEM_ADMIN, STORE_MANAGER, STAFF
router.get("/",
  authMiddleware,
  requireRole(...BACKOFFICE_ROLE_VALUES),
  validate(validation.queryShiftSchema, "query"),
  controller.getAll
);

// Lấy chi tiết 1 ca làm việc
router.get("/:id",
  authMiddleware,
  requireRole(...BACKOFFICE_ROLE_VALUES),
  controller.getById
);

// Mở ca làm việc mới — Staff/Store Manager/Admin đều mở được
router.post("/",
  authMiddleware,
  requireRole(...BACKOFFICE_ROLE_VALUES),
  validate(validation.openShiftSchema),
  controller.open
);

// Đóng ca làm việc — chỉ Admin và Store Manager
router.patch("/:id/close",
  authMiddleware,
  requireRole(...STORE_MANAGEMENT_ROLE_VALUES),
  controller.close
);

// Thêm staff vào ca — chỉ Admin và Store Manager
router.post("/:id/staffs",
  authMiddleware,
  requireRole(...STORE_MANAGEMENT_ROLE_VALUES),
  validate(validation.addStaffSchema),
  controller.addStaff
);

// Staff rời ca — chỉ Admin và Store Manager
router.delete("/:id/staffs/:staffId",
  authMiddleware,
  requireRole(...STORE_MANAGEMENT_ROLE_VALUES),
  controller.removeStaff
);

module.exports = router;