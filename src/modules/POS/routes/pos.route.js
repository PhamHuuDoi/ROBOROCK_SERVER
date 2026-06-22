const express    = require("express");
const router     = express.Router();
const controller = require("../controller/pos.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/pos.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");
const { BACKOFFICE_ROLE_VALUES } = require('../../../shared/constants/roles');

// Lấy danh sách đơn POS
router.get("/",
  authMiddleware,
  requireRole(...BACKOFFICE_ROLE_VALUES),
  validate(validation.queryPosOrderSchema, "query"),
  controller.getAll
);

// Lấy chi tiết 1 đơn POS
router.get("/:id",
  authMiddleware,
  requireRole(...BACKOFFICE_ROLE_VALUES),
  controller.getById
);

// Tạo đơn POS mới
router.post("/",
  authMiddleware,
  requireRole(...BACKOFFICE_ROLE_VALUES),
  validate(validation.createPosOrderSchema),
  controller.create
);

module.exports = router;