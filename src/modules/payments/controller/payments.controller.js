const service = require("../service/payments.service");
const MESSAGES = require("../../../shared/constants/messages");
const success = require("../../../shared/responses/success");

// Lấy thông tin thanh toán của đơn hàng
async function getByOrder(req, res, next) {
  try {
    const result = await service.getPaymentByOrder(
      req.params.orderId,
      req.user.id,
      req.user.role,
    );
    success(res, 200, MESSAGES.PAYMENT.GET_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// Xác nhận đã thu tiền COD
async function confirmCod(req, res, next) {
  try {
    const result = await service.confirmCodPayment(req.params.orderId, req.user.id);
    success(res, 200, MESSAGES.PAYMENT.CONFIRM_COD_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getByOrder, confirmCod };
