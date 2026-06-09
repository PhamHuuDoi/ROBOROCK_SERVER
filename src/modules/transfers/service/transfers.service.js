const repo = require("../repository/transfers.repository");

// Lấy danh sách yêu cầu chuyển kho có phân trang
async function getAllTransfers({ page = 1, limit = 10, status, fromWarehouseId, toWarehouseId } = {}) {
  const skip = (page - 1) * limit;
  const { items, total } = await repo.findAll({
    skip,
    take: Number(limit),
    status,
    fromWarehouseId,
    toWarehouseId,
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
// Lấy chi tiết 1 yêu cầu chuyển kho, throw 404 nếu không tìm thấy
async function getTransferById(id) {
  const transfer = await repo.findById(id);
  if (!transfer) throw { status: 404, message: "Transfer request not found" };
  return transfer;
}


module.exports = {
  getAllTransfers,  
  getTransferById,
  
};