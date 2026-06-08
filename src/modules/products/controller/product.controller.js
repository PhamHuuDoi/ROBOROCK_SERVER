const service = require("../service/product.service");

async function list(req, res, next) {
  try {
    const { page, perPage, search, categoryId } = req.query;
    const result = await service.listProducts({
      page,
      perPage,
      search,
      categoryId,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
async function get(req, res, next) {
  try {

    const product =
      await service.getProductById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: product,
    });

  } catch (err) {
    next(err);
  }
}
async function create(req, res, next) {
  try {
    const result = await service.createProduct(req.validated, req.files);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const result = await service.updateProduct(req.params.id, req.validated, req.files);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Xóa 1 ảnh phụ
async function removeImage(req, res, next) {
  try {
    await service.deleteProductImage(Number(req.params.imageId));
    res.status(204).send();
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
  removeImage,
};
