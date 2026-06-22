const prisma = require("../../../config/prisma");

// Lấy danh sách ca làm việc có phân trang và filter
async function findAll({ skip = 0, take = 10, branchId, status } = {}) {
  const where = {};
  if (branchId) where.branchId = Number(branchId);
  if (status)   where.status   = status;

  const [items, total] = await Promise.all([
    prisma.shift.findMany({
      where,
      skip,
      take,
      include: {
        branch: { select: { id: true, name: true } },
        opener: { select: { id: true, fullName: true } },
        closer: { select: { id: true, fullName: true } },
        shiftStaffs: {
          include: {
            staff: { select: { id: true, fullName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.shift.count({ where }),
  ]);

  return { items, total };
}

// Lấy chi tiết 1 ca làm việc theo id
async function findById(id) {
  return prisma.shift.findUnique({
    where: { id: Number(id) },
    include: {
      branch: { select: { id: true, name: true } },
      opener: { select: { id: true, fullName: true } },
      closer: { select: { id: true, fullName: true } },
      shiftStaffs: {
        include: {
          staff: { select: { id: true, fullName: true } },
        },
      },
      posOrders: {
        select: { id: true, totalAmount: true, status: true, createdAt: true },
      },
    },
  });
}

// Tìm ca đang mở của 1 chi nhánh
async function findOpenShiftByBranch(branchId) {
  return prisma.shift.findFirst({
    where: {
      branchId: Number(branchId),
      status:   "OPEN",
    },
  });
}

// Tạo ca làm việc mới
async function create(data) {
  return prisma.shift.create({
    data,
    include: {
      branch: { select: { id: true, name: true } },
      opener: { select: { id: true, fullName: true } },
    },
  });
}

// Cập nhật ca làm việc
async function update(id, data) {
  return prisma.shift.update({
    where: { id: Number(id) },
    data,
    include: {
      branch: { select: { id: true, name: true } },
      opener: { select: { id: true, fullName: true } },
      closer: { select: { id: true, fullName: true } },
    },
  });
}

// Thêm staff vào ca
async function addStaff(shiftId, staffId) {
  return prisma.shiftStaff.create({
    data: {
      shiftId: Number(shiftId),
      staffId: Number(staffId),
    },
  });
}

// Cập nhật giờ rời ca của staff
async function updateStaffLeft(shiftId, staffId) {
  return prisma.shiftStaff.updateMany({
    where: {
      shiftId: Number(shiftId),
      staffId: Number(staffId),
      leftAt:  null,
    },
    data: { leftAt: new Date() },
  });
}

// Tính tổng doanh thu của ca dựa trên các đơn POS đã hoàn thành
async function calcTotalRevenue(shiftId) {
  const result = await prisma.posOrder.aggregate({
    where: {
      shiftId: Number(shiftId),
      status:  "COMPLETED",
    },
    _sum: { totalAmount: true },
  });
  return result._sum.totalAmount ?? 0;
}

module.exports = {
  findAll,
  findById,
  findOpenShiftByBranch,
  create,
  update,
  addStaff,
  updateStaffLeft,
  calcTotalRevenue,
};