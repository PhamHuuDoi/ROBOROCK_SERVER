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
module.exports = { getAll, getById, create };