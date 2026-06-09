const express    = require("express");
const router     = express.Router();
const controller = require("../controller/imports.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/imports.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");

const allowedRoles = ["SYSTEM_ADMIN", "WAREHOUSE_MANAGER"];

router.get("/",
  authMiddleware,
  requireRole(...allowedRoles),
  validate(validation.queryImportSchema, "query"),
  controller.getAll
);

router.get("/:id",
  authMiddleware,
  requireRole(...allowedRoles),
  controller.getById
);

router.post("/",
  authMiddleware,
  requireRole(...allowedRoles),
  validate(validation.createImportSchema),
  controller.create
);

module.exports = router;