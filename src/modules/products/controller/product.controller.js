const service = require("../service/product.service");
const MESSAGES = require("../../../shared/constants/messages");
const success = require("../../../shared/responses/success");

async function list(req, res, next) {
  try {
    const { page, perPage, search, categoryId } = req.query;
    const result = await service.listProducts({
      page,
      perPage,
      search,
      categoryId,
    });
    success(res, 200, MESSAGES.PRODUCT.GET_ALL_SUCCESS, result);
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

    return success(res, 200, MESSAGES.PRODUCT.GET_SUCCESS, product);

  } catch (err) {
    next(err);
  }
}
async function create(req, res, next) {
  try {
    const result = await service.createProduct(req.validated, req.files);
    success(res, 201, MESSAGES.PRODUCT.CREATE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const result = await service.updateProduct(req.params.id, req.validated, req.files);
    success(res, 200, MESSAGES.PRODUCT.UPDATE_SUCCESS, result);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteProduct(req.params.id);
    success(res, 204, MESSAGES.PRODUCT.DELETE_SUCCESS);
  } catch (err) {
    next(err);
  }
}

// Xóa 1 ảnh phụ
async function removeImage(req, res, next) {
  try {
    await service.deleteProductImage(Number(req.params.imageId));
    success(res, 204, MESSAGES.PRODUCT.DELETE_IMAGE_SUCCESS);
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
