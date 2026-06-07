const { z } = require("zod");

const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
parentId: z.coerce.number()
  .int()
  .optional(),
});
const updateCategorySchema = createCategorySchema.partial();

module.exports = { createCategorySchema, updateCategorySchema };
