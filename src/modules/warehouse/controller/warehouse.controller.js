const service = require("../service/warehouse.service");
const MESSAGES = require("../../../shared/constants/messages");
const success = require("../../../shared/responses/success");

async function getAll(req, res, next) {
  try {
    console.log(req.query);
    console.log(req.validated);
    const { branchId } = req.query;
    const result = await service.getAllWarehouses({ branchId });
    success(res, 200, MESSAGES.WAREHOUSE.GET_ALL_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const result = await service.getWarehouseById(req.params.id);
    success(res, 200, MESSAGES.WAREHOUSE.GET_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const result = await service.createWarehouse(req.validated);
    success(res, 201, MESSAGES.WAREHOUSE.CREATE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const result = await service.updateWarehouse(req.params.id, req.validated);
    success(res, 200, MESSAGES.WAREHOUSE.UPDATE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await service.deleteWarehouse(req.params.id);
    success(res, 200, MESSAGES.WAREHOUSE.DELETE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
