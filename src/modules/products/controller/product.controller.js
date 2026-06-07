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
module.exports = {
  list,
};
