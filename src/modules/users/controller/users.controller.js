const service = require("../service/users.service");
const MESSAGES = require("../../../shared/constants/messages");
const success = require("../../../shared/responses/success");

// Lấy danh sách nhân viên
async function getAll(req, res, next) {
  try {
    const result = await service.getAllUsers(req.validated);
    success(res, 200, MESSAGES.USER.GET_ALL_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// Lấy chi tiết 1 nhân viên
async function getById(req, res, next) {
  try {
    const result = await service.getUserById(req.params.id);
    success(res, 200, MESSAGES.USER.GET_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// Tạo tài khoản nhân viên mới
async function create(req, res, next) {
  try {
    const result = await service.createUser(req.validated);
    success(res, 201, MESSAGES.USER.CREATE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// Cập nhật thông tin nhân viên
async function update(req, res, next) {
  try {
    const result = await service.updateUser(req.params.id, req.validated);
    success(res, 200, MESSAGES.USER.UPDATE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// Reset password nhân viên
async function resetPassword(req, res, next) {
  try {
    await service.resetPassword(req.params.id, req.validated.newPassword);
    success(res, 200, MESSAGES.USER.RESET_PASSWORD_SUCCESS);
  } catch (err) {
    next(err);
  }
}

// Soft delete nhân viên
async function remove(req, res, next) {
  try {
    const result = await service.deleteUser(req.params.id);
    success(res, 200, MESSAGES.USER.DELETE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// Kích hoạt / vô hiệu hoá tài khoản
async function toggleStatus(req, res, next) {
  try {
    const result = await service.toggleUserStatus(req.params.id, req.validated.status);
    success(res, 200, MESSAGES.USER.CHANGE_STATUS_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, resetPassword, remove, toggleStatus };
