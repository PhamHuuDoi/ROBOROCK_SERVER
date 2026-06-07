const express = require('express');
const controller = require('../controller/auth.controller');
const { validate } = require('../../../middlewares/validation.middleware');
const validation = require('../validation/auth.validation');
const { authMiddleware } = require('../../../middlewares/auth.middleware');


const router = express.Router();
router.post('/register', validate(validation.registerSchema), controller.register);

module.exports = router;