const repo=require("../repository/category.repository");
async function findMany() {
  return repo.findMany();
}
async function findById(id) {
  const category = await repo.findById(id);
  if (!category) {
    throw {
      status: 404,
      message: "Category not found",
    };
  }
  return category;
}   
async function createCategory(data) {

  const existed =
    await repo.findBySlug(data.slug);

  if (existed) {
    throw {
      status: 409,
      message: "Category slug already exists"
    };
  }

  return repo.create(data);
}
async function updateCategory(id, data) {

  const category =
    await repo.findById(id);

  if (!category) {
    throw {
      status: 404,
      message: "Category not found"
    };
  }

  return repo.update(id, data);
}
async function deleteCategory(id) {

  const category =
    await repo.findById(id);

  if (!category) {
    throw {
      status: 404,
      message: "Category not found"
    };
  }

  return repo.remove(id);
}
module.exports = { findMany, findById, createCategory, updateCategory, deleteCategory };