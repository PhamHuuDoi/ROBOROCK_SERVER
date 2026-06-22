const service = require("../service/cart.service");
const MESSAGES = require("../../../shared/constants/messages");
const success = require("../../../shared/responses/success");

// Lấy giỏ hàng của customer đang đăng nhập
async function getCart(req, res, next) {
  try {
    const result = await service.getCart(req.user.id);
    success(res, 200, MESSAGES.CART.GET_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// Thêm sản phẩm vào giỏ hàng
async function addToCart(req, res, next) {
  try {
    const result = await service.addToCart(req.user.id, req.validated);
    success(res, 200, MESSAGES.CART.ADD_ITEM_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
async function updateCartItem(req, res, next) {
  try {
    const result = await service.updateCartItem(req.user.id, req.validated);
    success(res, 200, MESSAGES.CART.UPDATE_ITEM_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// Xóa 1 sản phẩm khỏi giỏ hàng
async function removeFromCart(req, res, next) {
  try {
    const result = await service.removeFromCart(req.user.id, req.params.productId);
    success(res, 200, MESSAGES.CART.REMOVE_ITEM_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// Xóa toàn bộ giỏ hàng
async function clearCart(req, res, next) {
  try {
    const result = await service.clearCart(req.user.id);
    success(res, 200, MESSAGES.CART.CLEAR_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
