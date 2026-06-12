const prisma = require("../../../config/prisma");

// Lấy danh sách nhân viên có phân trang và filter, loại trừ CUSTOMER và đã xóa mềm
async function findAll({ skip = 0, take = 10, roleId, status, search } = {}) {
  const where = {
    deletedAt: null,
    role: {
      name: { in: ["STAFF", "STORE_MANAGER", "WAREHOUSE_MANAGER", "SYSTEM_ADMIN"] },
    },
  };

  if (roleId)  where.roleId = Number(roleId);
  if (status)  where.status = status;
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email:    { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id:        true,
        fullName:  true,
        email:     true,
        status:    true,
        createdAt: true,
        role:      { select: { id: true, name: true } },
        branchStaffs: {
          select: {
            branch: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}

// Lấy chi tiết 1 nhân viên theo id
async function findById(id) {
  return prisma.user.findFirst({
    where: { id: Number(id), deletedAt: null },
    select: {
      id:        true,
      fullName:  true,
      email:     true,
      status:    true,
      createdAt: true,
      updatedAt: true,
      role:      { select: { id: true, name: true } },
      branchStaffs: {
        select: {
          assignedAt: true,
          branch:     { select: { id: true, name: true } },
        },
      },
      managedBranches: { select: { id: true, name: true } },
    },
  });
}

// Tìm user theo email
async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

// Lấy role theo name
async function findRoleByName(name) {
  return prisma.role.findUnique({ where: { name } });
}

// Tạo nhân viên mới
async function create(data) {
  return prisma.user.create({
    data,
    select: {
      id:       true,
      fullName: true,
      email:    true,
      status:   true,
      role:     { select: { id: true, name: true } },
    },
  });
}

// Cập nhật thông tin nhân viên
async function update(id, data) {
  return prisma.user.update({
    where: { id: Number(id) },
    data,
    select: {
      id:       true,
      fullName: true,
      email:    true,
      status:   true,
      role:     { select: { id: true, name: true } },
    },
  });
}

// Soft delete nhân viên
async function softDelete(id) {
  return prisma.user.update({
    where: { id: Number(id) },
    data: {
      deletedAt: new Date(),
      status:    "INACTIVE",
    },
    select: { id: true, fullName: true },
  });
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  findRoleByName,
  create,
  update,
  softDelete,
};