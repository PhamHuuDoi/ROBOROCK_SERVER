const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Roborock API",
      version: "1.0.0",
      description: "Roborock Inventory & POS Management API",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // ==================== QUẢN LÝ TAGS (RẤT QUAN TRỌNG) ====================
    tags: [
      { name: "Auth", description: "Xác thực - Đăng nhập, đăng ký" },
      { name: "Branch", description: "Quản lý chi nhánh" },
      { name: "Product", description: "Quản lý sản phẩm" },
      { name: "Category", description: "Quản lý danh mục" },
      { name: "Import", description: "Quản lý phiếu nhập kho" },
      { name: "Inventory", description: "Quản lý tồn kho" },
      { name: "Transfer", description: "Quản lý yêu cầu chuyển kho" },
      { name: "Warehouse", description: "Quản lý kho hàng" },
      { name: "Cart", description: "Quản lý giỏ hàng của khách hàng" },
    ],
  },

  // Quét tất cả file swagger trong thư mục docs
  apis: [
    "./src/docs/*.js", // Quét tất cả file .js trong thư mục docs
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
