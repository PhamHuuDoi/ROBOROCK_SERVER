/**
 * @swagger
 * tags:
 *   - name: Branch
 *     description: Quản lý chi nhánh (branchs)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     BranchRequest:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           example: "Chi nhánh Hà Nội"
 *         address:
 *           type: string
 *           example: "123 Đường Láng, Quận Đống Đa, Hà Nội"
 *         phone:
 *           type: string
 *           example: "0123456789"
 *         email:
 *           type: string
 *           example: "hanoi@roborock.com"
 *         managerId:
 *           type: integer
 *           example: 5
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           example: ACTIVE
 *
 *     BranchResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         managerId:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         manager:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *
 *   branchstaffRequest:
 *       type: object
 *       required:
 *         - staffId
 *       properties:
 *         staffId:
 *           type: integer
 *           example: 10
 */

/* ====================== ROUTES ====================== */

/**
 * @swagger
 * /branchs:
 *   get:
 *     summary: Get all branches
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Branches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BranchResponse'
 *
 *   post:
 *     summary: Create branch
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchRequest'
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /branchs/{id}:
 *   get:
 *     summary: Get branch by ID
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Branch retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *       404:
 *         description: Branch not found
 *
 *   put:
 *     summary: Update branch
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchRequest'
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *
 *   delete:
 *     summary: Delete branch
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Branch deleted successfully
 *       400:
 *         description: Cannot delete branch with existing orders
 *       404:
 *         description: Branch not found
 */

/**
 * @swagger
 * /branchs/{id}/staffs:
 *   post:
 *     summary: Add staff to branch
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchStaffRequest'
 *     responses:
 *       201:
 *         description: Staff added to branch successfully
 *       409:
 *         description: Staff already assigned to this branch
 *
 *   delete:
 *     summary: Remove staff from branch
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Staff removed from branch successfully
 *       404:
 *         description: Staff not found in this branch
 */