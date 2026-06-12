const { z } = require("zod");

// Schema validate tạo nhân viên mới
const createUserSchema = z.object({
  fullName: z.string().min(1).max(100),
  email:    z.string().email(),
  password: z.string().min(6).max(100),
  roleName: z.enum(["STAFF", "STORE_MANAGER", "WAREHOUSE_MANAGER"]),
});

// Schema validate cập nhật nhân viên
const updateUserSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  status:   z.enum(["ACTIVE", "INACTIVE", "BANNED"]).optional(),
  roleName: z.enum(["STAFF", "STORE_MANAGER", "WAREHOUSE_MANAGER"]).optional(),
});

// Schema validate reset password
const resetPasswordSchema = z.object({
  newPassword: z.string().min(6).max(100),
});

// Schema validate toggle status
const toggleStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "BANNED"]),
});

// Schema validate query params
const queryUserSchema = z.object({
  page:   z.coerce.number().int().min(1).default(1),
  limit:  z.coerce.number().int().min(1).max(100).default(10),
  roleId: z.coerce.number().int().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "BANNED"]).optional(),
  search: z.string().optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  resetPasswordSchema,
  toggleStatusSchema,
  queryUserSchema,
};