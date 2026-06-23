// src/tests/auth.test.js
const request = require('supertest');
const app = require('../app');
const authHelper = require('./helpers/auth.helper');

describe('🔐 Auth API Tests', () => {
  let adminToken;
  let customerToken;
  let refreshToken;

  // ====================== REGISTER ======================
  describe('POST /api/auth/register', () => {
    it('should register a new customer successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test User Register',
          email: `newuser.${Date.now()}@gmail.com`,   // email unique
          password: '123456'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('message');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('email');
    });

    it('should return 409 if email already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Duplicate User',
          email: 'customer1@gmail.com',
          password: '123456'
        });

      expect(res.status).toBe(409);
    });
  });

  // ====================== LOGIN ======================
  describe('Login APIs', () => {
    it('should login customer successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login/customer')
        .send({
          email: 'customer1@gmail.com',
          password: '123456'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.role).toBe('CUSTOMER');

      customerToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('should login admin successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login/admin')
        .send({
          email: 'admin@roborock.com',
          password: '123456'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.role).toBe('SYSTEM_ADMIN');

      adminToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('should login staff successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login/staff')
        .send({
          email: 'staff1@roborock.com',
          password: '123456'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });
  });

  // ====================== REFRESH TOKEN ======================
  describe('POST /api/auth/refresh', () => {
    it('should refresh access token successfully', async () => {
      if (!refreshToken) {
        console.warn('⚠️ No refreshToken, skipping');
        return;
      }

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });
  });

  // ====================== LOGOUT ======================
  describe('Logout APIs', () => {
    it('should logout current session successfully', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .set('Authorization', `Bearer ${customerToken || adminToken}`);

      expect(res.status).toBe(200);
    });

    it('should logout all sessions (protected route)', async () => {
      const res = await request(app)
        .post('/api/auth/logout-all')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });

  // ====================== ERROR CASES ======================
  describe('Error Cases', () => {
    it('should return error when login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login/customer')
        .send({
          email: 'customer1@gmail.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);   // hoặc 400 tùy project
    });
  });
});