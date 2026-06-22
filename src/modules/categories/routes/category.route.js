const express = require('express');
const controller = require('../controller/category.controller');
const { validate } = require('../../../middlewares/validation.middleware');
const validation = require('../validation/category.validation');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { requireRole } = require('../../../middlewares/role.middleware');
const { ROLES } = require('../../../shared/constants/roles');

const router = express.Router();

router.get('/', controller.list);
router.get('/:id', controller.get);

router.post('/', authMiddleware, requireRole(ROLES.SYSTEM_ADMIN), validate(validation.createCategorySchema), controller.create);
router.put('/:id', authMiddleware, requireRole(ROLES.SYSTEM_ADMIN), validate(validation.updateCategorySchema), controller.update);
router.delete('/:id', authMiddleware, requireRole(ROLES.SYSTEM_ADMIN), controller.remove);

module.exports = router;