const service = require("../service/cart.service");

// Lấy giỏ hàng của customer đang đăng nhập
async function getCart(req, res, next) {
  try {
    const result = await service.getCart(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Thêm sản phẩm vào giỏ hàng
async function addToCart(req, res, next) {
  try {
    const result = await service.addToCart(req.user.id, req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
async function updateCartItem(req, res, next) {
  try {
    const result = await service.updateCartItem(req.user.id, req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Xóa 1 sản phẩm khỏi giỏ hàng
async function removeFromCart(req, res, next) {
  try {
    const result = await service.removeFromCart(req.user.id, req.params.productId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Xóa toàn bộ giỏ hàng
async function clearCart(req, res, next) {
  try {
    const result = await service.clearCart(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };