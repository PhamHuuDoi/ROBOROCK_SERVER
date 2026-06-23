// src/__tests__/helpers/auth.helper.js
const request = require('supertest');
const app = require('../../app');   // ← Kiểm tra lại đường dẫn nếu cần

// Test accounts từ seed
const TEST_USERS = {
  admin: { email: "admin@roborock.com", password: "123456", type: "admin" },
  warehouse: { email: "warehouse@roborock.com", password: "123456", type: "staff" },
  storeManager: { email: "store.q1@roborock.com", password: "123456", type: "staff" },
  staff: { email: "staff1@roborock.com", password: "123456", type: "staff" },
  customer: { email: "customer1@gmail.com", password: "123456", type: "customer" }
};

async function loginAndGetToken(email, password, loginType) {
  const res = await request(app)
    .post(`/api/auth/login/${loginType}`)
    .send({ email, password });

  if (res.status !== 200) {
    console.error(`❌ Login failed for ${email}:`, res.body);
    throw new Error(`Login failed: ${email}`);
  }

  // Quan trọng: Kiểm tra cấu trúc response của bạn
  const token = res.body.accessToken || res.body.data?.accessToken;
  
  if (!token) {
    console.error('Response body:', res.body);
    throw new Error('Cannot find accessToken in response');
  }

  return token;
}

async function getAdminToken() {
  return loginAndGetToken(TEST_USERS.admin.email, TEST_USERS.admin.password, 'admin');
}

async function getWarehouseToken() {
  return loginAndGetToken(TEST_USERS.warehouse.email, TEST_USERS.warehouse.password, 'staff');
}

async function getStoreManagerToken() {
  return loginAndGetToken(TEST_USERS.storeManager.email, TEST_USERS.storeManager.password, 'staff');
}

async function getStaffToken() {
  return loginAndGetToken(TEST_USERS.staff.email, TEST_USERS.staff.password, 'staff');
}

async function getCustomerToken() {
  return loginAndGetToken(TEST_USERS.customer.email, TEST_USERS.customer.password, 'customer');
}

// Helper tiện dụng
function withAuth(token) {
  return (req) => req.set('Authorization', `Bearer ${token}`);
}

module.exports = {
  getAdminToken,
  getWarehouseToken,
  getStoreManagerToken,
  getStaffToken,
  getCustomerToken,
  withAuth,
  // Export thêm để debug
  loginAndGetToken
};