const repo = require("../repository/payments.repository");

// Tạo payment COD khi đặt hàng, trạng thái PENDING cho đến khi giao hàng
async function createCodPayment(orderId) {
  const order = await repo.findOrderById(orderId);
  if (!order) throw { status: 404, message: "Order not found" };

  // Kiểm tra đã có payment chưa
  const existing = await repo.findByOrderId(orderId);
  if (existing) throw { status: 409, message: "Payment already exists for this order" };

  return repo.create({
    orderId,
    method: "COD",
    amount: order.totalAmount,
    status: "PENDING",
  });
}

// Xác nhận đã thu tiền COD khi giao hàng thành công
async function confirmCodPayment(orderId, staffId) {
  const order = await repo.findOrderById(orderId);
  if (!order) throw { status: 404, message: "Order not found" };

  if (order.status !== "DELIVERED") {
    throw { status: 400, message: "Chỉ xác nhận thanh toán khi đơn đã giao thành công" };
  }

  const payment = await repo.findByOrderId(orderId);
  if (!payment) throw { status: 404, message: "Payment not found" };

  if (payment.status === "PAID") {
    throw { status: 400, message: "Đơn hàng này đã được thanh toán" };
  }

  return repo.updateStatus(payment.id, {
    status: "PAID",
    paidAt: new Date(),
  });
}

// Hoàn tiền khi đơn bị huỷ sau khi đã thanh toán
async function refundPayment(orderId) {
  const payment = await repo.findByOrderId(orderId);
  if (!payment) return;

  if (payment.status !== "PAID") return;

  return repo.updateStatus(payment.id, {
    status: "REFUNDED",
  });
}

// Lấy thông tin thanh toán của đơn hàng
async function getPaymentByOrder(orderId, userId, userRole) {
  const order = await repo.findOrderById(orderId);
  if (!order) throw { status: 404, message: "Order not found" };

  // Customer chỉ xem payment của đơn mình
  if (userRole === "CUSTOMER" && order.customerId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }

  const payment = await repo.findByOrderId(orderId);
  if (!payment) throw { status: 404, message: "Payment not found" };

  return payment;
}

module.exports = {
  createCodPayment,
  confirmCodPayment,
  refundPayment,
  getPaymentByOrder,
};