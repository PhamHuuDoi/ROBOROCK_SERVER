const { z } = require('zod');

const createProductSchema = z.object({
  categoryId: z.number().int(),
  name: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  description: z.string().optional(),
  priceOnline: z.string().optional(),
  pricePos: z.string().optional(),
  weight: z.string().optional(),
  warrantyMonths: z.number().int().optional(),
  thumbnail: z.string().optional(),
  status: z.string().optional(),
});

const updateProductSchema = createProductSchema.partial();

module.exports = { createProductSchema, updateProductSchema };
