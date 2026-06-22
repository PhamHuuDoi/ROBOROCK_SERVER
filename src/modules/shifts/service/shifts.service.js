const repo = require("../repository/shifts.repository");

// Lấy danh sách ca làm việc có phân trang
async function getAllShifts({ page = 1, limit = 10, branchId, status } = {}) {
  const skip = (page - 1) * limit;
  const { items, total } = await repo.findAll({
    skip,
    take: Number(limit),
    branchId,
    status,
  });

  return {
    items,
    pagination: {
      total,
      page:       Number(page),
      limit:      Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Lấy chi tiết 1 ca, throw 404 nếu không tìm thấy
async function getShiftById(id) {
  const shift = await repo.findById(id);
  if (!shift) throw { status: 404, message: "Shift not found" };
  return shift;
}

// Mở ca mới, kiểm tra chi nhánh chưa có ca đang mở
async function openShift({ branchId, name }, userId) {
  const existingShift = await repo.findOpenShiftByBranch(branchId);
  if (existingShift) {
    throw { status: 400, message: "Chi nhánh này đang có ca làm việc chưa đóng" };
  }

  const shift = await repo.create({
    branchId,
    name,
    openedBy:  userId,
    startTime: new Date(),
    status:    "OPEN",
  });

  // Tự động thêm người mở ca vào danh sách staff của ca
  await repo.addStaff(shift.id, userId);

  return shift;
}

// Đóng ca, tính tổng doanh thu trước khi đóng
async function closeShift(id, userId) {
  const shift = await getShiftById(id);

  if (shift.status !== "OPEN") {
    throw { status: 400, message: "Ca làm việc này đã đóng" };
  }

  const totalRevenue = await repo.calcTotalRevenue(id);

  return repo.update(id, {
    status:       "CLOSED",
    closedBy:     userId,
    closedAt:     new Date(),
    endTime:      new Date(),
    totalRevenue,
  });
}

// Thêm staff vào ca đang mở
async function addStaffToShift(shiftId, staffId) {
  const shift = await getShiftById(shiftId);

  if (shift.status !== "OPEN") {
    throw { status: 400, message: "Không thể thêm staff vào ca đã đóng" };
  }

  return repo.addStaff(shiftId, staffId).catch(() => {
    throw { status: 409, message: "Staff đã có trong ca này" };
  });
}

// Staff rời ca
async function removeStaffFromShift(shiftId, staffId) {
  const shift = await getShiftById(shiftId);

  if (shift.status !== "OPEN") {
    throw { status: 400, message: "Ca làm việc này đã đóng" };
  }

  return repo.updateStaffLeft(shiftId, staffId);
}

module.exports = {
  getAllShifts,
  getShiftById,
  openShift,
  closeShift,
  addStaffToShift,
  removeStaffFromShift,
};