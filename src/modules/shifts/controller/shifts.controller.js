const service = require("../service/shifts.service");
const MESSAGES = require("../../../shared/constants/messages");
const success = require("../../../shared/responses/success");
// Lấy danh sách ca làm việc
async function getAll(req, res, next) {
  try {
    const result = await service.getAllShifts(req.validated);
    res.json(success.create(MESSAGES.SHIFT.GET_ALL_SUCCESS, result));
  } catch (err) {
    next(err);
  }
}

// Lấy chi tiết 1 ca làm việc
async function getById(req, res, next) {
  try {
    const result = await service.getShiftById(req.params.id);
    res.json(success.create(MESSAGES.SHIFT.GET_SUCCESS, result));
  } catch (err) {
    next(err);
  }
}

// Mở ca làm việc mới
async function open(req, res, next) {
  try {
    const result = await service.openShift(req.validated, req.user.id);
    res.status(201).json(success.create(MESSAGES.SHIFT.OPEN_SUCCESS, result));
  } catch (err) {
    next(err);
  }
}

// Đóng ca làm việc
async function close(req, res, next) {
  try {
    const result = await service.closeShift(req.params.id, req.user.id);
    res.json(success.create(MESSAGES.SHIFT.CLOSE_SUCCESS, result));
  } catch (err) {
    next(err);
  }
}

// Thêm staff vào ca
async function addStaff(req, res, next) {
  try {
    const result = await service.addStaffToShift(req.params.id, req.validated.staffId);
    res.status(201).json(success.create(MESSAGES.SHIFT.ADD_STAFF_SUCCESS, result));
  } catch (err) {
    next(err);
  }
}

// Staff rời ca
async function removeStaff(req, res, next) {
  try {
    await service.removeStaffFromShift(req.params.id, req.params.staffId);
    res.json(success.create(MESSAGES.SHIFT.REMOVE_STAFF_SUCCESS, null));
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, open, close, addStaff, removeStaff };