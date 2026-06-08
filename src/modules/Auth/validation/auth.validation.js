const { z } = require('zod');

const registerSchema = z.object({
  fullName: z.string().min(1),
  email:    z.string().email(),
  password: z.string().min(6),
});

// Dùng chung cho cả 3 endpoint login/customer, /staff, /admin
const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// Thêm mới — dùng cho POST /logout
const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  changePasswordSchema,
};