const repo = require("../repository/warehouse.repository");

async function getAllWarehouses({ branchId } = {}) {
  return repo.findAll({ branchId });
}

async function getWarehouseById(id) {
  const warehouse = await repo.findById(id);
  if (!warehouse) throw { status: 404, message: "Warehouse not found" };
  return warehouse;
}

async function createWarehouse(data) {
  return repo.create(data);
}

async function updateWarehouse(id, data) {
  await getWarehouseById(id); // check tồn tại
  return repo.update(id, data);
}

async function deleteWarehouse(id) {
  await getWarehouseById(id); // check tồn tại

  // Kiểm tra kho có đang chứa hàng không
  const inventory = await repo.hasInventory(id);
  if (inventory) {
    throw { status: 400, message: "Cannot delete warehouse with existing inventory" };
  }
  
  return repo.remove(id);
}

module.exports = {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};