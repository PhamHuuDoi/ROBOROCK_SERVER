const express = require('express');
const controller = require('../controller/product.controller');
const { validate } = require('../../../middlewares/validation.middleware');
const validation = require('../validation/product.validation');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { requireRole } = require('../../../middlewares/role.middleware');

const router = express.Router();

router.get('/', controller.list);
router.get('/:id', controller.get);

module.exports = router;
