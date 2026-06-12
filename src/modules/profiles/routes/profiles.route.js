const express    = require("express");
const router     = express.Router();
const controller = require("../controller/profiles.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/profiles.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");

// Lấy tất cả profile của user
router.get("/",
  authMiddleware,
  requireRole("CUSTOMER"),
  controller.getAll
);

// Lấy chi tiết 1 profile
router.get("/:id",
  authMiddleware,
  requireRole("CUSTOMER"),
  controller.getById
);

// Tạo profile mới
router.post("/",
  authMiddleware,
  requireRole("CUSTOMER"),
  validate(validation.createProfileSchema),
  controller.create
);

// Cập nhật profile
router.put("/:id",
  authMiddleware,
  requireRole("CUSTOMER"),
  validate(validation.updateProfileSchema),
  controller.update
);

// Xóa profile
router.delete("/:id",
  authMiddleware,
  requireRole("CUSTOMER"),
  controller.remove
);

// Set profile làm default
router.patch("/:id/set-default",
  authMiddleware,
  requireRole("CUSTOMER"),
  controller.setDefault
);

module.exports = router;