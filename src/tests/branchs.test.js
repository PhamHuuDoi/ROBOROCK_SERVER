// src/tests/branches.test.js
const request = require("supertest");
const app = require("../app");
const authHelper = require("./helpers/auth.helper");

describe("🏬 Branch API Tests", () => {
  let adminToken;
  let newBranchId;

  beforeAll(async () => {
    adminToken = await authHelper.getAdminToken();
    console.log("🔑 Admin token ready for Branch tests");
  });

  // ====================== GET ALL BRANCHES ======================
  describe("GET /api/branchs", () => {
    it("should get all branches successfully", async () => {
      const res = await request(app)
        .get("/api/branchs")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should filter branches by status", async () => {
      const res = await request(app)
        .get("/api/branchs?status=ACTIVE")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====================== CREATE BRANCH ======================
  describe("POST /api/branchs", () => {
    it("should create a new branch successfully", async () => {
      const newBranch = {
        name: `Chi Nhánh Test ${Date.now()}`,
        address: "456 Đường ABC, Quận 1, TP.HCM",
        phone: "0987654321",
        email: `testbranch${Date.now()}@roborock.com`,
        managerId: 3, // dùng ID có sẵn từ seed
        status: "ACTIVE",
      };

      const res = await request(app)
        .post("/api/branchs")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newBranch);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.name).toBe(newBranch.name);

      newBranchId = res.body.data.id; // lưu để test sau
    });
  });

  // ====================== GET BY ID ======================
  describe("GET /api/branchs/:id", () => {
    it("should get branch by id", async () => {
      const res = await request(app)
        .get(`/api/branchs/${newBranchId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(newBranchId);
    });

    it("should return 404 if branch not found", async () => {
      const res = await request(app)
        .get("/api/branchs/99999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  // ====================== UPDATE BRANCH ======================
  describe("PUT /api/branchs/:id", () => {
    it("should update branch successfully", async () => {
      const updateData = {
        name: `Chi Nhánh Test Updated ${Date.now()}`,
        address: "789 Đường XYZ, Quận 7, TP.HCM",
        phone: "0912345678",
      };

      const res = await request(app)
        .put(`/api/branchs/${newBranchId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(updateData.name);
    });
  });

  // ====================== ADD STAFF TO BRANCH ======================
  describe("POST /api/branchs/:id/staffs", () => {
    it("should add staff to branch", async () => {
      const res = await request(app)
        .post(`/api/branchs/${newBranchId}/staffs`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ staffId: 5 }); // staff1@roborock.com từ seed

      expect([201, 409]).toContain(res.status); // 409 nếu đã tồn tại
    });
  });

  // ====================== DELETE BRANCH ======================
  describe("DELETE /api/branchs/:id", () => {
    it("should return error when trying to delete branch with dependencies", async () => {
      const res = await request(app)
        .delete(`/api/branchs/${newBranchId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect([400, 500]).toContain(res.status);
      console.log("📌 Delete response:", res.body); // để debug
    });
  });

  // ====================== ERROR CASES ======================
  describe("Error Cases", () => {
    it("should return 401 when no token", async () => {
      const res = await request(app).get("/api/branchs");

      expect(res.status).toBe(401);
    });

    it("should return 403 if non-admin tries to create branch (if applicable)", async () => {
      const customerToken = await authHelper.getCustomerToken();
      const res = await request(app)
        .post("/api/branchs")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          name: "Test Unauthorized",
          address: "Some address",
        });

      expect([401, 403]).toContain(res.status);
    });
  });
});
