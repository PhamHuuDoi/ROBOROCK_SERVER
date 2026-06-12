const repo = require("../repository/profiles.repository");

// Lấy tất cả profile của user đang đăng nhập
async function getProfiles(userId) {
  return repo.findAllByUser(userId);
}

// Lấy chi tiết 1 profile, kiểm tra thuộc về user đang đăng nhập
async function getProfileById(id, userId) {
  const profile = await repo.findById(id);
  if (!profile) throw { status: 404, message: "Profile not found" };
  if (profile.userId !== userId) throw { status: 403, message: "Forbidden" };
  return profile;
}

// Tạo profile mới, tự động set default nếu là profile đầu tiên
async function createProfile(userId, data) {
  const count = await repo.countByUser(userId);

  // Profile đầu tiên luôn là default
  const isDefault = count === 0 ? true : (data.isDefault ?? false);

  // Nếu set default thì bỏ default các profile cũ
  if (isDefault) {
    await repo.clearDefault(userId);
  }

  return repo.create({ ...data, userId, isDefault });
}

// Cập nhật profile
async function updateProfile(id, userId, data) {
  await getProfileById(id, userId);

  // Nếu set default thì bỏ default các profile cũ
  if (data.isDefault) {
    await repo.clearDefault(userId);
  }

  return repo.update(id, data);
}

// Xóa profile, không cho xóa nếu là profile duy nhất
async function deleteProfile(id, userId) {
  await getProfileById(id, userId);

  const count = await repo.countByUser(userId);
  if (count <= 1) {
    throw { status: 400, message: "Không thể xóa profile duy nhất" };
  }

  // Nếu xóa profile default thì set profile đầu tiên còn lại làm default
  const profile = await repo.findById(id);
  await repo.remove(id);

  if (profile.isDefault) {
    const remaining = await repo.findAllByUser(userId);
    if (remaining.length > 0) {
      await repo.update(remaining[0].id, { isDefault: true });
    }
  }

  return { message: "Profile deleted successfully" };
}

// Set 1 profile làm default
async function setDefaultProfile(id, userId) {
  await getProfileById(id, userId);
  await repo.clearDefault(userId);
  return repo.update(id, { isDefault: true });
}

module.exports = {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  setDefaultProfile,
};