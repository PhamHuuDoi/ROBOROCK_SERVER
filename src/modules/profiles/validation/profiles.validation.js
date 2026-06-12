const { z } = require("zod");

// Schema validate tạo profile mới
const createProfileSchema = z.object({
  phone:     z.string().max(20).optional(),
  address:   z.string().max(255).optional(),
  isDefault: z.boolean().optional(),
});

// Schema validate cập nhật profile
const updateProfileSchema = z.object({
  phone:     z.string().max(20).optional(),
  address:   z.string().max(255).optional(),
  isDefault: z.boolean().optional(),
});

module.exports = { createProfileSchema, updateProfileSchema };