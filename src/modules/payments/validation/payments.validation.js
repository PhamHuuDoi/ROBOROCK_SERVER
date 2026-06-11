const service = require("../service/payments.service");

// Lấy thông tin thanh toán của đơn hàng
async function getByOrder(req, res, next) {
  try {
    const result = await service.getPaymentByOrder(
      req.params.orderId,
      req.user.id,
      req.user.role,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Xác nhận đã thu tiền COD
async function confirmCod(req, res, next) {
  try {
    const result = await service.confirmCodPayment(req.params.orderId, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getByOrder, confirmCod };