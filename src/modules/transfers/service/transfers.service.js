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


module.exports = {
  getAllTransfers,
};