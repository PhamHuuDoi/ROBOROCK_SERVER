const service = require("../service/category.service");
const MESSAGES = require("../../../shared/constants/messages");
const success = require("../../../shared/responses/success");

async function list(req, res, next) {
  try {
    const categories = await service.findMany();

    return success(res, 200, MESSAGES.CATEGORY.GET_ALL_SUCCESS, categories);
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const category = await service.findById(
      req.params.id
    );

    return success(res, 200, MESSAGES.CATEGORY.GET_SUCCESS, category);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const category = await service.createCategory(
      req.validated
    );

    return success(res, 201, MESSAGES.CATEGORY.CREATE_SUCCESS, category);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const category = await service.updateCategory(
      req.params.id,
      req.validated
    );

    return success(res, 200, MESSAGES.CATEGORY.UPDATE_SUCCESS, category);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteCategory(
      req.params.id
    );

    return success(res, 200, MESSAGES.CATEGORY.DELETE_SUCCESS);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
