const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const repo = require("../repository/auth.repository");
const jwtConfig = require("../../../config/jwt");
const env = require("../../../config/env");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../config/jwt");

const ROLE_GROUPS = {
  customer: ["CUSTOMER"],
  staff:    ["STAFF"],
  admin:    ["SYSTEM_ADMIN", "STORE_MANAGER", "WAREHOUSE_MANAGER"],
};

function generateTokens(user) {
  const accessToken = jwtConfig.generateAccessToken({
    sub: user.id,
    role: user.role.name,
  });
  const refreshToken = jwtConfig.generateRefreshToken({
    sub: user.id,
  });
  return { accessToken, refreshToken };
}

// "7d" → milliseconds
function parseDuration(str) {
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error("Invalid duration format: " + str);
  return parseInt(match[1]) * units[match[2]];
}

// ── register ──────────────────────────────────────────
async function register({ fullName, email, password }) {
  const existingUser = await repo.findUserByEmail(email);
  if (existingUser) {
    throw { status: 409, message: "Email already registered" };
  }

  const customerRole = await repo.findRoleByName("CUSTOMER");
  if (!customerRole) {
    throw { status: 500, message: "Default role CUSTOMER not found" };
  }

  const hashed = await bcrypt.hash(password, Number(env.BCRYPT_SALT_ROUNDS));
  const user = await repo.createUser({
    fullName,
    email,
    password: hashed,
    roleId: customerRole.id,
  });

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: customerRole.name,
  };
}

// ── loginAs ───────────────────────────────────────────
async function loginAs(group, { email, password }) {
  const allowedRoles = ROLE_GROUPS[group];

  const user = await repo.findUserByEmail(email);

  // Trả về cùng 1 lỗi để tránh lộ thông tin
  if (!user || !allowedRoles.includes(user.role.name)) {
    throw { status: 401, message: "Invalid credentials" };
  }

  if (user.status !== "ACTIVE") {
    throw { status: 403, message: "Account is not active" };
  }

  // User Google OAuth sẽ không có password
  if (!user.password) {
    throw { status: 400, message: "This account uses social login" };
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const { accessToken, refreshToken } = generateTokens(user);

  // Lưu refresh token vào DB
  const expiresAt = new Date(Date.now() + parseDuration(env.JWT_REFRESH_EXPIRES));
  await repo.createRefreshToken({
    userId: user.id,
    token: refreshToken,
    deviceInfo: group,   // "customer" | "staff" | "admin"
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
    },
  };
}

//  refreshAccessToken 
async function refreshAccessToken(refreshToken) {
  //  Verify chữ ký JWT
  try {
    jwtConfig.verifyToken(refreshToken);
  } catch {
    throw { status: 401, message: "Invalid refresh token" };
  }

  // 2. Kiểm tra còn trong DB không (chưa logout)
  const stored = await repo.findRefreshToken(refreshToken);
  if (!stored) {
    throw { status: 401, message: "Refresh token revoked" };
  }

  // 3. Kiểm tra hết hạn
  if (stored.expiresAt < new Date()) {
    await repo.deleteRefreshToken(refreshToken);
    throw { status: 401, message: "Refresh token expired" };
  }

  const accessToken = jwtConfig.generateAccessToken({
    sub: stored.user.id,
    role: stored.user.role.name,
  });

  return { accessToken };
}

// logout 1 session 
async function logout(refreshToken) {
  if (!refreshToken) return;
  await repo.deleteRefreshToken(refreshToken).catch(() => {});
}

// logout tất cả session 
async function logoutAll(userId) {
  await repo.deleteRefreshTokensByUser(userId);
}
module.exports = {
  register,
  loginAs,
  refreshAccessToken,
  logout,
  logoutAll,
};
