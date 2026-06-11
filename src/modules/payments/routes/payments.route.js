const express    = require("express");
const router     = express.Router();
const controller = require("../controller/payments.controller");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");

// Lấy thông tin thanh toán của đơn hàng
router.get("/orders/:orderId",
  authMiddleware,
  requireRole("CUSTOMER", "STAFF", "STORE_MANAGER", "SYSTEM_ADMIN"),
  controller.getByOrder
);

// Xác nhận thu tiền COD khi giao hàng thành công
router.patch("/orders/:orderId/confirm-cod",
  authMiddleware,
  requireRole("STAFF", "STORE_MANAGER", "SYSTEM_ADMIN"),
  controller.confirmCod
);

module.exports = router;