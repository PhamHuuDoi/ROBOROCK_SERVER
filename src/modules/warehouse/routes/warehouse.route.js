const express    = require("express");
const router     = express.Router();
const controller = require("../controller/warehouse.controller");
const { validate } = require("../../../middlewares/validation.middleware");
const validation   = require("../validation/warehouse.validation");
const { authMiddleware }  = require("../../../middlewares/auth.middleware");
const { requireRole }     = require("../../../middlewares/role.middleware");

const {
  ROLES,
  TRANSFER_ACCESS_ROLE_VALUES,
  TRANSFER_APPROVAL_ROLE_VALUES,
} = require("../../../shared/constants/roles");
router.get("/",
  authMiddleware,
  requireRole(...TRANSFER_ACCESS_ROLE_VALUES),
  validate(validation.queryWarehouseSchema),  // validate query params
  controller.getAll
);

router.get("/:id",
  authMiddleware,
  requireRole(...TRANSFER_ACCESS_ROLE_VALUES),
  controller.getById
);

router.post("/",
  authMiddleware,
  requireRole(...TRANSFER_APPROVAL_ROLE_VALUES),
  validate(validation.createWarehouseSchema),
  controller.create
);

router.put("/:id",
  authMiddleware,
  requireRole(...TRANSFER_APPROVAL_ROLE_VALUES),
  validate(validation.updateWarehouseSchema),
  controller.update
);

router.delete("/:id",
  authMiddleware,
  requireRole(ROLES.SYSTEM_ADMIN),
  controller.remove
);

module.exports = router;