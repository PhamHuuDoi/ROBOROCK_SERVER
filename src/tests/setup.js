// src/__tests__/setup.js
require('dotenv').config({ path: '.env.test' });

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

global.prisma = prisma;   // Để có thể dùng global.prisma trong test nếu cần

// Chạy trước tất cả test
beforeAll(async () => {
  console.log('🧪 Connecting to test database...');
  await prisma.$connect();
  console.log('✅ Test environment ready');
});

// Chạy sau tất cả test
afterAll(async () => {
  await prisma.$disconnect();
  console.log('👋 Disconnected from database');
});

module.exports = { prisma };