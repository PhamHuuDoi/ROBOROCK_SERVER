const express    = require("express");
const router     = express.Router();
const controller = require("../controller/branch.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/branch.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");
const {
  ROLES,
  ADMIN_PORTAL_ROLE_VALUES,
  STORE_MANAGEMENT_ROLE_VALUES,
} = require("../../../shared/constants/roles");

router.get("/",
  authMiddleware,
  requireRole(...ADMIN_PORTAL_ROLE_VALUES),
  validate(validation.queryBranchSchema),
  controller.getAll
);

router.get("/:id",
  authMiddleware,
  requireRole(...ADMIN_PORTAL_ROLE_VALUES),
  controller.getById
);

router.post("/",
  authMiddleware,
  requireRole(ROLES.SYSTEM_ADMIN),
  validate(validation.createBranchSchema),
  controller.create
);

router.put("/:id",
  authMiddleware,
  requireRole(ROLES.SYSTEM_ADMIN),
  validate(validation.updateBranchSchema),
  controller.update
);

router.delete("/:id",
  authMiddleware,
  requireRole(ROLES.SYSTEM_ADMIN),
  controller.remove
);

// Quản lý staff trong chi nhánh
router.post("/:id/staffs",
  authMiddleware,
  requireRole(...STORE_MANAGEMENT_ROLE_VALUES),
  validate(validation.addStaffSchema),
  controller.addStaff
);

router.delete("/:id/staffs/:staffId",
  authMiddleware,
  requireRole(...STORE_MANAGEMENT_ROLE_VALUES),
  controller.removeStaff
);

module.exports = router;