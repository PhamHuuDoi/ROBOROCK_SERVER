const prisma = require("../../../config/prisma");

// Lấy tất cả profile của 1 user
async function findAllByUser(userId) {
  return prisma.profile.findMany({
    where: { userId: Number(userId) },
    orderBy: [{ isDefault: "desc" }, { id: "asc" }],
  });
}

// Lấy chi tiết 1 profile theo id
async function findById(id) {
  return prisma.profile.findUnique({
    where: { id: Number(id) },
  });
}

// Tìm profile mặc định của user
async function findDefaultByUser(userId) {
  return prisma.profile.findFirst({
    where: { userId: Number(userId), isDefault: true },
  });
}

// Tạo profile mới
async function create(data) {
  return prisma.profile.create({ data });
}

// Cập nhật profile
async function update(id, data) {
  return prisma.profile.update({
    where: { id: Number(id) },
    data,
  });
}

// Xóa profile
async function remove(id) {
  return prisma.profile.delete({ where: { id: Number(id) } });
}

// Bỏ default tất cả profile của user trước khi set default mới
async function clearDefault(userId) {
  return prisma.profile.updateMany({
    where: { userId: Number(userId) },
    data:  { isDefault: false },
  });
}

// Đếm số profile của user
async function countByUser(userId) {
  return prisma.profile.count({ where: { userId: Number(userId) } });
}

module.exports = {
  findAllByUser,
  findById,
  findDefaultByUser,
  create,
  update,
  remove,
  clearDefault,
  countByUser,
};