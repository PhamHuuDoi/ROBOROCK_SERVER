const { z } = require("zod");

const createProductSchema = z.object({
  categoryId:     z.coerce.number().int(),   // coerce vì form-data gửi string
  name:           z.string().min(1),
  slug:           z.string().min(1),
  sku:            z.string().min(1),
  description:    z.string().optional(),
  priceOnline:    z.coerce.number().min(0).optional(),
  pricePos:       z.coerce.number().min(0).optional(),
  weight:         z.coerce.number().min(0).optional(),
  warrantyMonths: z.coerce.number().int().optional(),
  status:         z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).optional(),
});

const updateProductSchema = createProductSchema.partial();

module.exports = { createProductSchema, updateProductSchema };