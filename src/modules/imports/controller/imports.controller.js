const service = require("../service/imports.service");
const MESSAGES = require("../../../shared/constants/messages");
const success = require("../../../shared/responses/success");

async function getAll(req, res, next) {
  try {
    const result = await service.getAllImports(req.validated);
    success(res, 200, MESSAGES.IMPORT.GET_ALL_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const result = await service.getImportById(req.params.id);
    success(res, 200, MESSAGES.IMPORT.GET_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    // req.user.id được set bởi authMiddleware
    const result = await service.createImport(req.validated, req.user.id);
    success(res, 201, MESSAGES.IMPORT.CREATE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create };
