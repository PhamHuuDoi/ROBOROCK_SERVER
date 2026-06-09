const service = require("../service/transfers.service");

// Lấy danh sách yêu cầu chuyển kho
async function getAll(req, res, next) {
  try {
    const result = await service.getAllTransfers(req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
// Lấy chi tiết 1 yêu cầu chuyển kho
async function getById(req, res, next) {
  try {
    const result = await service.getTransferById(req.params.id);
    res.json(result);
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
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
// Duyệt yêu cầu chuyển kho
async function approve(req, res, next) {
  try {
    const result = await service.approveTransfer(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Từ chối yêu cầu chuyển kho
async function reject(req, res, next) {
  try {
    const result = await service.rejectTransfer(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
// Hoàn thành chuyển kho, cập nhật tồn kho
async function complete(req, res, next) {
  try {
    const result = await service.completeTransfer(req.params.id, req.user.id);
    res.json(result);
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
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, approve, reject, complete, cancel};
