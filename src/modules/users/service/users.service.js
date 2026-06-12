const bcrypt = require("bcryptjs");
const env    = require("../../../config/env");
const repo   = require("../repository/users.repository");

// Các role được phép tạo
const ALLOWED_ROLES = ["STAFF", "STORE_MANAGER", "WAREHOUSE_MANAGER"];

// Lấy danh sách nhân viên có phân trang
async function getAllUsers({ page = 1, limit = 10, roleId, status, search } = {}) {
  const skip = (page - 1) * limit;
  const { items, total } = await repo.findAll({
    skip,
    take: Number(limit),
    roleId,
    status,
    search,
  });

  return {
    items,
    pagination: {
      total,
      page:       Number(page),
      limit:      Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Lấy chi tiết 1 nhân viên, throw 404 nếu không tìm thấy
async function getUserById(id) {
  const user = await repo.findById(id);
  if (!user) throw { status: 404, message: "User not found" };
  return user;
}

// Tạo tài khoản nhân viên mới
async function createUser({ fullName, email, password, roleName }) {
  // Kiểm tra role hợp lệ
  if (!ALLOWED_ROLES.includes(roleName)) {
    throw { status: 400, message: `Role phải là một trong: ${ALLOWED_ROLES.join(", ")}` };
  }

  // Kiểm tra email đã tồn tại chưa
  const existing = await repo.findByEmail(email);
  if (existing) throw { status: 409, message: "Email đã được sử dụng" };

  // Lấy role
  const role = await repo.findRoleByName(roleName);
  if (!role) throw { status: 404, message: "Role không tồn tại" };

  // Hash password
  const hashed = await bcrypt.hash(password, Number(env.BCRYPT_SALT_ROUNDS));

  return repo.create({
    fullName,
    email,
    password: hashed,
    roleId:   role.id,
    status:   "ACTIVE",
  });
}

// Cập nhật thông tin nhân viên
async function updateUser(id, { fullName, status, roleName }) {
  await getUserById(id);

  const data = {};
  if (fullName) data.fullName = fullName;
  if (status)   data.status   = status;

  // Đổi role nếu có
  if (roleName) {
    if (!ALLOWED_ROLES.includes(roleName)) {
      throw { status: 400, message: `Role phải là một trong: ${ALLOWED_ROLES.join(", ")}` };
    }
    const role = await repo.findRoleByName(roleName);
    if (!role) throw { status: 404, message: "Role không tồn tại" };
    data.roleId = role.id;
  }

  return repo.update(id, data);
}

// Reset password nhân viên
async function resetPassword(id, newPassword) {
  await getUserById(id);
  const hashed = await bcrypt.hash(newPassword, Number(env.BCRYPT_SALT_ROUNDS));
  return repo.update(id, { password: hashed });
}

// Soft delete nhân viên
async function deleteUser(id) {
  await getUserById(id);
  return repo.softDelete(id);
}

// Kích hoạt / vô hiệu hoá tài khoản
async function toggleUserStatus(id, status) {
  await getUserById(id);
  return repo.update(id, { status });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  resetPassword,
  deleteUser,
  toggleUserStatus,
};