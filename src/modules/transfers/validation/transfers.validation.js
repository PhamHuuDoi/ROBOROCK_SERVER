const { z } = require("zod");

// Schema validate từng sản phẩm trong yêu cầu chuyển kho
const transferItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity:  z.number().int().positive(),
});

// Schema validate tạo yêu cầu chuyển kho
const createTransferSchema = z.object({
  fromWarehouseId: z.number().int().positive(),
  toWarehouseId:   z.number().int().positive(),
  note:            z.string().optional(),
  items:           z.array(transferItemSchema).min(1, "Cần ít nhất 1 sản phẩm"),
}).refine(
  (data) => data.fromWarehouseId !== data.toWarehouseId,
  { message: "Kho nguồn và kho đích không được trùng nhau" }
);

// Schema validate query params khi lấy danh sách
const queryTransferSchema = z.object({
  page:            z.coerce.number().int().min(1).default(1),
  limit:           z.coerce.number().int().min(1).max(100).default(10),
  status:          z.enum(["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"]).optional(),
  fromWarehouseId: z.coerce.number().int().optional(),
  toWarehouseId:   z.coerce.number().int().optional(),
});

module.exports = { createTransferSchema, queryTransferSchema };