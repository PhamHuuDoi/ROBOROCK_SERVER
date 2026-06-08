const express = require("express");
const controller = require("../controller/product.controller");
const { validate } = require("../../../middlewares/validation.middleware");
const validation = require("../validation/product.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole } = require("../../../middlewares/role.middleware");
const { upload } = require("../../../middlewares/upload.middleware");
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
  requireRole("SYSTEM_ADMIN", "STORE_MANAGER"),
  uploadFields,
  validate(validation.createProductSchema),
  controller.create,
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "STORE_MANAGER"),
  uploadFields,
  validate(validation.updateProductSchema),
  controller.update,
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("SYSTEM_ADMIN"),
  controller.remove,
);

// Xóa 1 ảnh phụ
router.delete(
  "/:id/images/:imageId",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "STORE_MANAGER"),
  controller.removeImage,
);

module.exports = router;
