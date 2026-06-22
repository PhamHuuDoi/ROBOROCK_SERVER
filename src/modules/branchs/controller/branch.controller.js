const service = require("../service/branch.service");
const MESSAGES = require("../../../shared/constants/messages");
const success = require("../../../shared/responses/success");

async function getAll(req, res, next) {
  try {
    const result = await service.getAllBranches(req.validated);
    success(res, 200, MESSAGES.BRANCH.GET_ALL_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const result = await service.getBranchById(req.params.id);
    success(res, 200, MESSAGES.BRANCH.GET_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const result = await service.createBranch(req.validated);
    success(res, 201, MESSAGES.BRANCH.CREATE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const result = await service.updateBranch(req.params.id, req.validated);
    success(res, 200, MESSAGES.BRANCH.UPDATE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteBranch(req.params.id);
    success(res, 204, MESSAGES.BRANCH.DELETE_SUCCESS);
  } catch (err) {
    next(err);
  }
}

async function addStaff(req, res, next) {
  try {
    const result = await service.addStaffToBranch(
      req.params.id,
      req.validated.staffId,
    );
    success(res, 201, MESSAGES.BRANCH.ADD_STAFF_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function removeStaff(req, res, next) {
  try {
    await service.removeStaffFromBranch(req.params.id, req.params.staffId);
    success(res, 204, MESSAGES.BRANCH.REMOVE_STAFF_SUCCESS);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  addStaff,
  removeStaff,
};
