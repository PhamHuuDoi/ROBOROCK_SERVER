const { z } = require("zod");

const createBranchSchema = z.object({
  name:      z.string().min(1).max(100),
  address:   z.string().min(1).max(255),
  phone:     z.string().max(20).optional(),
  email:     z.string().email().optional(),
  managerId: z.number().int().optional(),
  status:    z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

const updateBranchSchema = createBranchSchema.partial();

const queryBranchSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

const addStaffSchema = z.object({
  staffId: z.number().int(),
});

module.exports = {
  createBranchSchema,
  updateBranchSchema,
  queryBranchSchema,
  addStaffSchema,
};