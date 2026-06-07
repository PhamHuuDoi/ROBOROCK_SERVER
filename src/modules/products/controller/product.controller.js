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
module.exports = {
  list,
  get,
};
