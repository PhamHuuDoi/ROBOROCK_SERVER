const repo=require('../repository/product.repository');
const {uploadImage, deleteImage} = require("../../../config/cloudinary");
const SOFT_DELETE_DAYS = 30; // sau 30 ngày sẽ xóa cứng
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
async function createProduct(data, files) {
  // files = { thumbnail?: [file], images?: [file, file, ...] }

  // Upload thumbnail nếu có
  if (files?.thumbnail?.[0]) {
    data.thumbnail = await uploadImage(files.thumbnail[0].buffer);
  }

  const product = await repo.create(data);

  // Upload ảnh phụ nếu có
  if (files?.images?.length) {
    const urls = await Promise.all(
      files.images.map((f) => uploadImage(f.buffer))
    );
    await repo.addImages(product.id, urls);
  }

  return repo.findById(product.id);
}

async function updateProduct(id, data, files) {
  // Upload thumbnail mới nếu có
  if (files?.thumbnail?.[0]) {
    data.thumbnail = await uploadImage(files.thumbnail[0].buffer);
  }

  await repo.update(id, data);

  // Upload thêm ảnh phụ nếu có
  if (files?.images?.length) {
    const urls = await Promise.all(
      files.images.map((f) => uploadImage(f.buffer))
    );
    await repo.addImages(Number(id), urls);
  }

  return repo.findById(id);
}



async function deleteProduct(id) {
  const product = await repo.findById(id);
  if (!product) throw { status: 404, message: "Product not found" };

  return repo.softDelete(id);
}

// Gọi bởi scheduler — xóa cứng các product đã soft delete quá 30 ngày
async function hardDeleteExpired() {
  const beforeDate = new Date();
  beforeDate.setDate(beforeDate.getDate() - SOFT_DELETE_DAYS);

  const expired = await repo.findExpiredSoftDeleted(beforeDate);
  if (!expired.length) return { deleted: 0 };

  // Xóa ảnh Cloudinary trước
  for (const product of expired) {
    // Xóa thumbnail
    if (product.thumbnail) {
      await deleteImage(product.thumbnail).catch(() => {});
    }
    // Xóa ảnh phụ
    const images = await repo.findImagesByProductId(product.id);
    for (const img of images) {
      await deleteImage(img.imageUrl).catch(() => {});
    }
    // Hard delete
    await repo.hardDelete(product.id);
  }

  console.log(`[Scheduler] Hard deleted ${expired.length} products`);
  return { deleted: expired.length };
}
// Xóa 1 ảnh phụ
async function deleteProductImage(imageId) {
  const image = await repo.findImageById(imageId);
  if (!image) throw { status: 404, message: "Image not found" };

  // Xóa trên Cloudinary
  await deleteImage(image.imageUrl);

  // Xóa trong DB
  await repo.removeImage(imageId);
}

module.exports = { listProducts, getProductById, createProduct, updateProduct, deleteProduct, deleteProductImage, hardDeleteExpired };