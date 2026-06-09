const { z } = require("zod");

const importItemSchema = z.object({
  productId:   z.number().int().positive(),
  quantity:    z.number().int().positive(),
  importPrice: z.number().positive(),
});

const createImportSchema = z.object({
  warehouseId: z.number().int().positive(),
  supplierId:  z.number().int().positive(),
  note:        z.string().optional(),
  items:       z.array(importItemSchema).min(1, "Cần ít nhất 1 sản phẩm"),
});

const queryImportSchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  limit:       z.coerce.number().int().min(1).max(100).default(10),
  warehouseId: z.coerce.number().int().optional(),
  supplierId:  z.coerce.number().int().optional(),
});

module.exports = {
  createImportSchema,
  queryImportSchema,
};