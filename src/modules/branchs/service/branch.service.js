const repo = require("../repository/branch.repository");

async function getAllBranches({ status } = {}) {
  return repo.findAll({ status });
}

async function getBranchById(id) {
  const branch = await repo.findById(id);
  if (!branch) throw { status: 404, message: "Branch not found" };
  return branch;
}

async function createBranch(data) {
  return repo.create(data);
}

async function updateBranch(id, data) {
  await getBranchById(id);
  return repo.update(id, data);
}

async function deleteBranch(id) {
  await getBranchById(id);

  const hasOrders = await repo.hasOrders(id);
  if (hasOrders) {
    throw { status: 400, message: "Cannot delete branch with existing orders" };
  }

  return repo.remove(id);
}

async function addStaffToBranch(branchId, staffId) {
  await getBranchById(branchId);
  return repo.addStaff(branchId, staffId).catch(() => {
    throw { status: 409, message: "Staff already assigned to this branch" };
  });
}

async function removeStaffFromBranch(branchId, staffId) {
  await getBranchById(branchId);
  return repo.removeStaff(branchId, staffId).catch(() => {
    throw { status: 404, message: "Staff not found in this branch" };
  });
}

module.exports = {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  addStaffToBranch,
  removeStaffFromBranch,
};