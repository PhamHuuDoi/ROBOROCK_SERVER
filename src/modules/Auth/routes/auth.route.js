const express = require('express');
const controller = require('../controller/auth.controller');
const { validate } = require('../../../middlewares/validation.middleware');
const validation = require('../validation/auth.validation');
const { authMiddleware } = require('../../../middlewares/auth.middleware');

const router = express.Router();

// Register
router.post('/register', validate(validation.registerSchema), controller.register);

// Login theo nhóm
router.post('/login/customer', validate(validation.loginSchema), controller.loginCustomer);
router.post('/login/staff',    validate(validation.loginSchema), controller.loginStaff);
router.post('/login/admin',    validate(validation.loginSchema), controller.loginAdmin);

// Refresh & Logout
router.post('/refresh',     validate(validation.refreshSchema), controller.refresh);
router.post('/logout',      validate(validation.logoutSchema),  controller.logout);
router.post('/logout-all',  authMiddleware,                     controller.logoutAll);

module.exports = router;