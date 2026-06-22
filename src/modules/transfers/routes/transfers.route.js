const express    = require("express");
const router     = express.Router();
const controller = require("../controller/transfers.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/transfers.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");
const {
  TRANSFER_ACCESS_ROLE_VALUES,
  TRANSFER_APPROVAL_ROLE_VALUES,
} = require("../../../shared/constants/roles");

// Lấy danh sách yêu cầu chuyển kho
router.get("/",
  authMiddleware,
  requireRole(...TRANSFER_ACCESS_ROLE_VALUES),
  validate(validation.queryTransferSchema, "query"),
  controller.getAll
);

// Lấy chi tiết 1 yêu cầu chuyển kho
router.get("/:id",
  authMiddleware,
  requireRole(...TRANSFER_ACCESS_ROLE_VALUES),
  controller.getById
);

// Tạo yêu cầu chuyển kho
router.post("/",
  authMiddleware,
  requireRole(...TRANSFER_ACCESS_ROLE_VALUES),
  validate(validation.createTransferSchema),
  controller.create
);

// Duyệt yêu cầu chuyển kho
router.patch("/:id/approve",
  authMiddleware,
  requireRole(...TRANSFER_APPROVAL_ROLE_VALUES),
  controller.approve
);

// Từ chối yêu cầu chuyển kho
router.patch("/:id/reject",
  authMiddleware,
  requireRole(...TRANSFER_APPROVAL_ROLE_VALUES),
  controller.reject
);

// Hoàn thành chuyển kho, cập nhật tồn kho
router.patch("/:id/complete",
  authMiddleware,
  requireRole(...TRANSFER_ACCESS_ROLE_VALUES),
  controller.complete
);

// Huỷ yêu cầu chuyển kho
router.patch("/:id/cancel",
  authMiddleware,
  requireRole(...TRANSFER_ACCESS_ROLE_VALUES),
  controller.cancel
);

module.exports = router;