const { z } = require("zod");

const createWarehouseSchema = z.object({
  name:     z.string().min(1).max(100),
  branchId: z.number().int().optional(),
  type:     z.enum(["MAIN", "BRANCH"]).default("BRANCH"),
});

const updateWarehouseSchema = createWarehouseSchema.partial();

const queryWarehouseSchema = z.object({
  branchId: z.coerce.number().int().optional(),
});

module.exports = {
  createWarehouseSchema,
  updateWarehouseSchema,
  queryWarehouseSchema,
};