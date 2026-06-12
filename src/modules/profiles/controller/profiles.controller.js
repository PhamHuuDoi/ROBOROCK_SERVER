const service = require("../service/profiles.service");

// Lấy tất cả profile của user đang đăng nhập
async function getAll(req, res, next) {
  try {
    const result = await service.getProfiles(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Lấy chi tiết 1 profile
async function getById(req, res, next) {
  try {
    const result = await service.getProfileById(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Tạo profile mới
async function create(req, res, next) {
  try {
    const result = await service.createProfile(req.user.id, req.validated);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// Cập nhật profile
async function update(req, res, next) {
  try {
    const result = await service.updateProfile(req.params.id, req.user.id, req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Xóa profile
async function remove(req, res, next) {
  try {
    const result = await service.deleteProfile(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Set profile làm default
async function setDefault(req, res, next) {
  try {
    const result = await service.setDefaultProfile(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove, setDefault };