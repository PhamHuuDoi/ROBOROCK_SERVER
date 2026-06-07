const repo=require('../repository/product.repository');

async function listProducts({ page = 1, perPage = 10, search, categoryId }) {
  const take = Number(perPage) || 10;
  const skip = ((Number(page) || 1) - 1) * take;
  const { items, total } = await repo.findMany({ skip, take, search, categoryId });
  return { items, total, page: Number(page) || 1, perPage: take };
}

module.exports = { listProducts };