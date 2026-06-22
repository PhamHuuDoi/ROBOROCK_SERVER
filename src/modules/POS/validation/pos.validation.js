const { z } = require("zod");
const { PAYMENT_METHOD_VALUES } = require("../../../shared/constants/enums");

// Schema validate từng sản phẩm trong đơn POS
const posItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity:  z.number().int().positive(),
});

// Schema validate tạo đơn POS
const createPosOrderSchema = z.object({
  shiftId:       z.number().int().positive(),
  paymentMethod: z.enum(PAYMENT_METHOD_VALUES),
  note:          z.string().max(500).optional(),
  items:         z.array(posItemSchema).min(1, "Cần ít nhất 1 sản phẩm"),
});

// Schema validate query params lấy danh sách đơn POS
const queryPosOrderSchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  limit:    z.coerce.number().int().min(1).max(100).default(10),
  branchId: z.coerce.number().int().optional(),
  shiftId:  z.coerce.number().int().optional(),
  staffId:  z.coerce.number().int().optional(),
});

module.exports = { createPosOrderSchema, queryPosOrderSchema };