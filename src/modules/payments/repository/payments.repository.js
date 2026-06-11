const prisma = require("../../../config/prisma");

// Lấy thông tin thanh toán theo orderId
async function findByOrderId(orderId) {
  return prisma.payment.findFirst({
    where: { orderId: Number(orderId) },
  });
}

// Tạo bản ghi thanh toán mới
async function create(data) {
  return prisma.payment.create({ data });
}

// Cập nhật trạng thái thanh toán
async function updateStatus(id, data) {
  return prisma.payment.update({
    where: { id: Number(id) },
    data,
  });
}

// Lấy thông tin đơn hàng theo id
async function findOrderById(id) {
  return prisma.order.findUnique({
    where: { id: Number(id) },
    select: {
      id:            true,
      status:        true,
      totalAmount:   true,
      paymentMethod: true,
      customerId:    true,
    },
  });
}

module.exports = {
  findByOrderId,
  create,
  updateStatus,
  findOrderById,
};