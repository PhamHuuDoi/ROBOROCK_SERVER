const service = require("../service/warehouse.service");

async function getAll(req, res, next) {
  try {
    console.log(req.query);
    console.log(req.validated);
    const { branchId } = req.query;
    const result = await service.getAllWarehouses({ branchId });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const result = await service.getWarehouseById(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const result = await service.createWarehouse(req.validated);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const result = await service.updateWarehouse(req.params.id, req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteWarehouse(req.params.id);
    res.json({ message: "Branch deleted successfully", data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };