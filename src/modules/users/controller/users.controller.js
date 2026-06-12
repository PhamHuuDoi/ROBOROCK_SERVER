const service = require("../service/users.service");

// Lấy danh sách nhân viên
async function getAll(req, res, next) {
  try {
    const result = await service.getAllUsers(req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Lấy chi tiết 1 nhân viên
async function getById(req, res, next) {
  try {
    const result = await service.getUserById(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Tạo tài khoản nhân viên mới
async function create(req, res, next) {
  try {
    const result = await service.createUser(req.validated);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// Cập nhật thông tin nhân viên
async function update(req, res, next) {
  try {
    const result = await service.updateUser(req.params.id, req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Reset password nhân viên
async function resetPassword(req, res, next) {
  try {
    await service.resetPassword(req.params.id, req.validated.newPassword);
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
}

// Soft delete nhân viên
async function remove(req, res, next) {
  try {
    const result = await service.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully", data: result });
  } catch (err) {
    next(err);
  }
}

// Kích hoạt / vô hiệu hoá tài khoản
async function toggleStatus(req, res, next) {
  try {
    const result = await service.toggleUserStatus(req.params.id, req.validated.status);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, resetPassword, remove, toggleStatus };