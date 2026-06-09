const express    = require("express");
const router     = express.Router();
const controller = require("../controller/warehouse.controller");
const { validate } = require("../../../middlewares/validation.middleware");
const validation   = require("../validation/warehouse.validation");
const { authMiddleware }  = require("../../../middlewares/auth.middleware");
const { requireRole }     = require("../../../middlewares/role.middleware");

const allowedRoles = ["SYSTEM_ADMIN", "WAREHOUSE_MANAGER", "STORE_MANAGER"];

router.get("/",
  authMiddleware,
  requireRole(...allowedRoles),
  validate(validation.queryWarehouseSchema),  // validate query params
  controller.getAll
);

router.get("/:id",
  authMiddleware,
  requireRole(...allowedRoles),
  controller.getById
);

router.post("/",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "WAREHOUSE_MANAGER"),
  validate(validation.createWarehouseSchema),
  controller.create
);

router.put("/:id",
  authMiddleware,
  requireRole("SYSTEM_ADMIN", "WAREHOUSE_MANAGER"),
  validate(validation.updateWarehouseSchema),
  controller.update
);

router.delete("/:id",
  authMiddleware,
  requireRole("SYSTEM_ADMIN"),
  controller.remove
);

module.exports = router;