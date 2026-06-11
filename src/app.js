const express = require('express');
const routes = require('./routes');
const env = require('./config/env');
const { startCleanupJob } = require("./jobs/cleanupProducts.job");

const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./docs/swagger");   // ← Sửa ở đây

const app = express();

app.use(express.json());

// ====================== SWAGGER ======================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,           // Bật Swagger Explorer
    swaggerOptions: {
      persistAuthorization: true,
    }
  })
);

// Routes
app.use('/api', routes);

// Job
startCleanupJob();

// Error handler (nên để cuối cùng)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ 
    error: err.message || 'Internal server error' 
  });
});

module.exports = app;