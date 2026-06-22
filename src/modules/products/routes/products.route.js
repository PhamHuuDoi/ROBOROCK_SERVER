const express = require("express");
const controller = require("../controller/product.controller");
const { validate } = require("../../../middlewares/validation.middleware");
const validation = require("../validation/product.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole } = require("../../../middlewares/role.middleware");
const { upload } = require("../../../middlewares/upload.middleware");
const {
  ROLES,
  STORE_MANAGEMENT_ROLE_VALUES,
} = require("../../../shared/constants/roles");

const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

const router = express.Router();

router.get("/", controller.list);
router.get("/:id", controller.get);

router.post(
  "/",
  authMiddleware,
  requireRole(...STORE_MANAGEMENT_ROLE_VALUES),
  uploadFields,
  validate(validation.createProductSchema),
  controller.create,
);

router.put(
  "/:id",
  authMiddleware,
  requireRole(...STORE_MANAGEMENT_ROLE_VALUES),
  uploadFields,
  validate(validation.updateProductSchema),
  controller.update,
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(ROLES.SYSTEM_ADMIN),
  controller.remove,
);

// Xóa 1 ảnh phụ
router.delete(
  "/:id/images/:imageId",
  authMiddleware,
  requireRole(...STORE_MANAGEMENT_ROLE_VALUES),
  controller.removeImage,
);

module.exports = router;