const repo = require("../repository/cart.repository");

// Lấy giỏ hàng của customer kèm tổng tiền
async function getCart(customerId) {
  const cart = await repo.findOrCreateCart(customerId);

  // Tính tổng tiền
  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + Number(item.product.priceOnline) * item.quantity;
  }, 0);

  return { ...cart, totalAmount };
}

// Thêm sản phẩm vào giỏ hàng, nếu đã có thì cộng thêm số lượng
async function addToCart(customerId, { productId, quantity }) {
  // Kiểm tra sản phẩm tồn tại và đang active
  const product = await repo.findProductById(productId);
  if (!product || product.deletedAt) {
    throw { status: 404, message: "Sản phẩm không tồn tại" };
  }
  if (product.status !== "ACTIVE") {
    throw { status: 400, message: "Sản phẩm hiện không có sẵn" };
  }

  const cart     = await repo.findOrCreateCart(customerId);
  const existing = await repo.findCartItem(cart.id, productId);

  if (existing) {
    // Đã có trong giỏ → cộng thêm số lượng
    await repo.updateItemQuantity(cart.id, productId, existing.quantity + quantity);
  } else {
    // Chưa có → thêm mới
    await repo.addItem(cart.id, productId, quantity);
  }

  return getCart(customerId);
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
async function updateCartItem(customerId, { productId, quantity }) {
  const cart = await repo.findOrCreateCart(customerId);

  const existing = await repo.findCartItem(cart.id, productId);
  if (!existing) {
    throw { status: 404, message: "Sản phẩm không có trong giỏ hàng" };
  }

  // Nếu số lượng = 0 thì xóa luôn
  if (quantity <= 0) {
    await repo.removeItem(cart.id, productId);
  } else {
    await repo.updateItemQuantity(cart.id, productId, quantity);
  }

  return getCart(customerId);
}

// Xóa 1 sản phẩm khỏi giỏ hàng
async function removeFromCart(customerId, productId) {
  const cart = await repo.findOrCreateCart(customerId);

  const existing = await repo.findCartItem(cart.id, productId);
  if (!existing) {
    throw { status: 404, message: "Sản phẩm không có trong giỏ hàng" };
  }

  await repo.removeItem(cart.id, productId);
  return getCart(customerId);
}

// Xóa toàn bộ giỏ hàng
async function clearCart(customerId) {
  const cart = await repo.findOrCreateCart(customerId);
  await repo.clearCart(cart.id);
  return getCart(customerId);
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};