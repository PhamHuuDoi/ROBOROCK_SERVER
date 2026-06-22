const express    = require("express");
const router     = express.Router();
const controller = require("../controller/imports.controller");
const { validate }       = require("../../../middlewares/validation.middleware");
const validation         = require("../validation/imports.validation");
const { authMiddleware } = require("../../../middlewares/auth.middleware");
const { requireRole }    = require("../../../middlewares/role.middleware");
const { TRANSFER_APPROVAL_ROLE_VALUES } = require("../../../shared/constants/roles");

router.get("/",
  authMiddleware,
  requireRole(...TRANSFER_APPROVAL_ROLE_VALUES),
  validate(validation.queryImportSchema, "query"),
  controller.getAll
);

router.get("/:id",
  authMiddleware,
  requireRole(...TRANSFER_APPROVAL_ROLE_VALUES),
  controller.getById
);

router.post("/",
  authMiddleware,
  requireRole(...TRANSFER_APPROVAL_ROLE_VALUES),
  validate(validation.createImportSchema),
  controller.create
);

module.exports = router;