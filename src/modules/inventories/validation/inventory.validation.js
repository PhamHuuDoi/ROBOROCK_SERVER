const { z } = require("zod");

const queryInventorySchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  limit:       z.coerce.number().int().min(1).max(100).default(10),
  warehouseId: z.coerce.number().int().optional(),
  productId:   z.coerce.number().int().optional(),
});

const queryBranchInventorySchema = z.object({
  page:      z.coerce.number().int().min(1).default(1),
  limit:     z.coerce.number().int().min(1).max(100).default(10),
  productId: z.coerce.number().int().optional(),
});

module.exports = {
  queryInventorySchema,
  queryBranchInventorySchema,
};