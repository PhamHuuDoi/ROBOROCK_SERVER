const express    = require("express");
const router     = express.Router();
const controller = require("../controller/payments.controller");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");
const {
  ORDER_ACCESS_ROLE_VALUES,
  BACKOFFICE_ROLE_VALUES,
} = require("../../../shared/constants/roles");

// Lấy thông tin thanh toán của đơn hàng
router.get("/orders/:orderId",
  authMiddleware,
  requireRole(...ORDER_ACCESS_ROLE_VALUES),
  controller.getByOrder
);

// Xác nhận thu tiền COD khi giao hàng thành công
router.patch("/orders/:orderId/confirm-cod",
  authMiddleware,
  requireRole(...BACKOFFICE_ROLE_VALUES),
  controller.confirmCod
);

module.exports = router;