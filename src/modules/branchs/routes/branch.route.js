const express    = require("express");
const router     = express.Router();
const controller = require("../controller/branch.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/branch.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");

router.get("/",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "STORE_MANAGER", "WAREHOUSE_MANAGER"),
  validate(validation.queryBranchSchema),
  controller.getAll
);

router.get("/:id",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "STORE_MANAGER", "WAREHOUSE_MANAGER"),
  controller.getById
);

router.post("/",
  authMiddleware,
  requireRole("SYSTEM_ADMIN"),
  validate(validation.createBranchSchema),
  controller.create
);

router.put("/:id",
  authMiddleware,
  requireRole("SYSTEM_ADMIN"),
  validate(validation.updateBranchSchema),
  controller.update
);

router.delete("/:id",
  authMiddleware,
  requireRole("SYSTEM_ADMIN"),
  controller.remove
);

// Quản lý staff trong chi nhánh
router.post("/:id/staffs",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "STORE_MANAGER"),
  validate(validation.addStaffSchema),
  controller.addStaff
);

router.delete("/:id/staffs/:staffId",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "STORE_MANAGER"),
  controller.removeStaff
);

module.exports = router;