const express    = require("express");
const router     = express.Router();
const controller = require("../controller/cart.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/cart.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");
const { ROLES }          = require("../../../shared/constants/roles");

// Lấy giỏ hàng
router.get("/",
  authMiddleware,
  requireRole(ROLES.CUSTOMER),
  controller.getCart
);

// Thêm sản phẩm vào giỏ hàng
router.post("/items",
  authMiddleware,
  requireRole(ROLES.CUSTOMER),
  validate(validation.addToCartSchema),
  controller.addToCart
);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.patch("/items",
  authMiddleware,
  requireRole(ROLES.CUSTOMER),
  validate(validation.updateCartItemSchema),
  controller.updateCartItem
);

// Xóa 1 sản phẩm khỏi giỏ hàng
router.delete("/items/:productId",
  authMiddleware,
  requireRole(ROLES.CUSTOMER),
  controller.removeFromCart
);

// Xóa toàn bộ giỏ hàng
router.delete("/",
  authMiddleware,
  requireRole(ROLES.CUSTOMER),
  controller.clearCart
);

module.exports = router;