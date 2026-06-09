const service = require("../service/imports.service");

async function getAll(req, res, next) {
  try {
    const result = await service.getAllImports(req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const result = await service.getImportById(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    // req.user.id được set bởi authMiddleware
    const result = await service.createImport(req.validated, req.user.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create };