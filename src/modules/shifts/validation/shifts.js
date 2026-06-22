const { z } = require("zod");

// Schema validate mở ca mới
const openShiftSchema = z.object({
  branchId: z.number().int().positive(),
  name:     z.string().min(1).max(100),
});

// Schema validate thêm staff vào ca
const addStaffSchema = z.object({
  staffId: z.number().int().positive(),
});

// Schema validate query params lấy danh sách ca
const queryShiftSchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  limit:    z.coerce.number().int().min(1).max(100).default(10),
  branchId: z.coerce.number().int().optional(),
  status:   z.enum(["OPEN", "CLOSED"]).optional(),
});

module.exports = { openShiftSchema, addStaffSchema, queryShiftSchema };