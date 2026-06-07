const service = require("../service/category.service");

async function list(req, res, next) {
  try {
    const categories = await service.findMany();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const category = await service.findById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const category = await service.createCategory(
      req.validated
    );

    return res.status(201).json({
      success: true,
      data: category,
    });
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

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteCategory(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
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