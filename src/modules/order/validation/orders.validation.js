const { z } = require("zod");

// Schema validate từng sản phẩm trong đơn hàng
const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity:  z.number().int().positive(),
});

// Schema validate tạo đơn hàng
const createOrderSchema = z.object({
  items:           z.array(orderItemSchema).min(1, "Cần ít nhất 1 sản phẩm"),
  shippingAddress: z.string().min(1).max(500),
  paymentMethod:   z.enum(["COD", "CARD", "TRANSFER", "MOMO", "VNPAY"]),
  note:            z.string().optional(),
  branchId:        z.number().int().positive().optional(),
  customerLat:     z.number().optional(),
  customerLng:     z.number().optional(),
});

// Schema validate đề xuất chi nhánh
const suggestBranchSchema = z.object({
  items:       z.array(orderItemSchema).min(1),
  customerLat: z.number().optional(),
  customerLng: z.number().optional(),
});

// Schema validate cập nhật trạng thái đơn hàng
const updateStatusSchema = z.object({
  status: z.enum(["PACKING", "SHIPPING", "DELIVERED"]),
});

// Schema validate query params lấy danh sách đơn hàng
const queryOrderSchema = z.object({
  page:            z.coerce.number().int().min(1).default(1),
  limit:           z.coerce.number().int().min(1).max(100).default(10),
  status:          z.enum(["PENDING", "CONFIRMED", "PACKING", "SHIPPING", "DELIVERED", "CANCELLED"]).optional(),
  branchId:        z.coerce.number().int().optional(),
  assignedStaffId: z.coerce.number().int().optional(),
});

module.exports = {
  createOrderSchema,
  suggestBranchSchema,
  updateStatusSchema,
  queryOrderSchema,
};