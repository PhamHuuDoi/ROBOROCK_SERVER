const express = require('express');
const routes = require('./routes');
const env = require('./config/env');
const {startCleanupJob} = require("./jobs/cleanupProducts.job");
const app = express();
app.use(express.json());

app.use('/api', routes);
startCleanupJob();

// basic error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
