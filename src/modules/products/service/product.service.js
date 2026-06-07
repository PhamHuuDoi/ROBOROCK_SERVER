const repo=require('../repository/product.repository');

async function listProducts({ page = 1, perPage = 10, search, categoryId }) {
  const take = Number(perPage) || 10;
  const skip = ((Number(page) || 1) - 1) * take;
  const { items, total } = await repo.findMany({ skip, take, search, categoryId });
  return { items, total, page: Number(page) || 1, perPage: take };
}
async function getProductById(id) {

  if (!id) {
    throw {
      status: 400,
      message: "Product ID is required"
    };
  }

  const product =
    await repo.findById(id);

  if (!product) {
    throw {
      status: 404,
      message: "Product not found"
    };
  }

  return product;
}
module.exports = { listProducts, getProductById };