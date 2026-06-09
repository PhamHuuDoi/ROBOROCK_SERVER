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



module.exports = { getAll};