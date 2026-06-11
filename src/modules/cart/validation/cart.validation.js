const { z } = require("zod");

// Schema validate thêm sản phẩm vào giỏ hàng
const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity:  z.number().int().min(1),
});

// Schema validate cập nhật số lượng trong giỏ hàng
const updateCartItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity:  z.number().int().min(0),
});

module.exports = { addToCartSchema, updateCartItemSchema };