const service = require("../service/transfers.service");
const MESSAGES = require("../../../shared/constants/messages");
const success = require("../../../shared/responses/success");

// Lấy danh sách yêu cầu chuyển kho
async function getAll(req, res, next) {
  try {
    const result = await service.getAllTransfers(req.validated);
    success(res, 200, MESSAGES.TRANSFER.GET_ALL_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}
// Lấy chi tiết 1 yêu cầu chuyển kho
async function getById(req, res, next) {
  try {
    const result = await service.getTransferById(req.params.id);
    success(res, 200, MESSAGES.TRANSFER.GET_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const result = await service.createTransfer(
      req.validated,
      req.user.id,
      req.user.role,
    );
    success(res, 201, MESSAGES.TRANSFER.CREATE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}
// Duyệt yêu cầu chuyển kho
async function approve(req, res, next) {
  try {
    const result = await service.approveTransfer(req.params.id, req.user.id);
    success(res, 200, MESSAGES.TRANSFER.APPROVE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// Từ chối yêu cầu chuyển kho
async function reject(req, res, next) {
  try {
    const result = await service.rejectTransfer(req.params.id, req.user.id);
    success(res, 200, MESSAGES.TRANSFER.REJECT_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}
// Hoàn thành chuyển kho, cập nhật tồn kho
async function complete(req, res, next) {
  try {
    const result = await service.completeTransfer(req.params.id, req.user.id);
    success(res, 200, MESSAGES.TRANSFER.COMPLETE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

// Huỷ yêu cầu chuyển kho
async function cancel(req, res, next) {
  try {
    const result = await service.cancelTransfer(
      req.params.id,
      req.user.id,
      req.user.role,
    );
    success(res, 200, MESSAGES.TRANSFER.CANCEL_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, approve, reject, complete, cancel};
