const express = require('express');
const controller = require('../controller/category.controller');
const { validate } = require('../../../middlewares/validation.middleware');
const validation = require('../validation/category.validation');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { requireRole } = require('../../../middlewares/role.middleware');

const router = express.Router();

router.get('/', controller.list);
router.get('/:id', controller.get);

router.post('/', authMiddleware, requireRole('SYSTEM_ADMIN'), validate(validation.createCategorySchema), controller.create);
router.put('/:id', authMiddleware, requireRole('SYSTEM_ADMIN'), validate(validation.updateCategorySchema), controller.update);
router.delete('/:id', authMiddleware, requireRole('SYSTEM_ADMIN'), controller.remove);

module.exports = router;
