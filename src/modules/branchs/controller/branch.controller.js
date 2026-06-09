const service = require("../service/branch.service");

async function getAll(req, res, next) {
  try {
    const result = await service.getAllBranches(req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const result = await service.getBranchById(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const result = await service.createBranch(req.validated);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const result = await service.updateBranch(req.params.id, req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteBranch(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function addStaff(req, res, next) {
  try {
    const result = await service.addStaffToBranch(req.params.id, req.validated.staffId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function removeStaff(req, res, next) {
  try {
    await service.removeStaffFromBranch(req.params.id, req.params.staffId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove, addStaff, removeStaff };