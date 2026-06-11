const service = require("../service/orders.service");

// Lấy danh sách đơn hàng
async function getAll(req, res, next) {
  try {
    // Customer chỉ xem đơn của mình
    const filter = req.user.role === "CUSTOMER"
      ? { ...req.validated, customerId: req.user.id }
      : req.validated;

    const result = await service.getAllOrders(filter);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Lấy chi tiết 1 đơn hàng
async function getById(req, res, next) {
  try {
    const order = await service.getOrderById(req.params.id);

    // Customer chỉ xem đơn của mình
    if (req.user.role === "CUSTOMER" && order.customerId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
}

// Tạo đơn hàng mới
async function create(req, res, next) {
  try {
    const result = await service.createOrder(req.validated, req.user.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// Đề xuất chi nhánh có đủ hàng
async function suggestBranches(req, res, next) {
  try {
    const { items, customerLat, customerLng } = req.validated;
    const result = await service.suggestBranches(items, customerLat, customerLng);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Staff xác nhận đơn và trừ tồn kho
async function confirm(req, res, next) {
  try {
    const result = await service.confirmOrder(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Staff cập nhật trạng thái đơn hàng
async function updateStatus(req, res, next) {
  try {
    const result = await service.updateOrderStatus(
      req.params.id,
      req.validated.status,
      req.user.id,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Huỷ đơn hàng
async function cancel(req, res, next) {
  try {
    const result = await service.cancelOrder(
      req.params.id,
      req.user.id,
      req.user.role,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, suggestBranches, confirm, updateStatus, cancel };