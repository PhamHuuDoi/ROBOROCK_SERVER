const prisma = require("../../../config/prisma");

async function findMany({ skip = 0, take = 10, search, categoryId }) {
   const where = {
    AND: [
      { deletedAt: null }, // ← thêm: loại sản phẩm đã soft delete
    ],
  };
  if (search) {
    where.AND.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ],
    });
  }
  if (categoryId) {
    where.AND.push({ categoryId: Number(categoryId) });
  }
  const filter = where.AND.length ? { where } : {};
  const [items, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take,
      ...filter,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count(filter),
  ]);
  return { items, total };
}
async function findById(id) {
  return prisma.product.findFirst({
    where: {
      id:        Number(id),
      deletedAt: null,
    },
    include: { category: true, images: true },
  });
}
async function create(data) {
  return prisma.product.create({ data });
}

async function update(id, data) {
  return prisma.product.update({ where: { id: Number(id) }, data });
}

async function softDelete(id) {
  return prisma.product.update({
    where: { id: Number(id) },
    data: {
      status: "INACTIVE",
      deletedAt: new Date(),
    },
  });
}

// Hard delete thật sự
async function hardDelete(id) {
  return prisma.product.delete({ where: { id: Number(id) } });
}

// Lấy các sản phẩm đã soft delete quá X ngày
async function findExpiredSoftDeleted(beforeDate) {
  return prisma.product.findMany({
    where: {
      deletedAt: { not: null, lte: beforeDate },
    },
  });
}
async function findById(id) {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}

// ── ProductImage ──────────────────────────────────────
async function addImages(productId, imageUrls) {
  // imageUrls = ["url1", "url2", ...]
  const data = imageUrls.map((url, index) => ({
    productId,
    imageUrl: url,
    sortOrder: index,
  }));
  return prisma.productImage.createMany({ data });
}

async function findImageById(id) {
  return prisma.productImage.findUnique({ where: { id: Number(id) } });
}

async function removeImage(id) {
  return prisma.productImage.delete({ where: { id: Number(id) } });
}
module.exports = {
  findMany,
  findById,
  create,
  update,
  addImages,
  findImageById,
  removeImage,
  softDelete,
  hardDelete,
  findExpiredSoftDeleted,
};
