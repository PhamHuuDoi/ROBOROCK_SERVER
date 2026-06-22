/**
 * @swagger
 * tags:
 *   - name: Warehouse
 *     description: Quản lý kho hàng (Warehouses)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     WarehouseRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Kho Chính Hà Nội"
 *         branchId:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         type:
 *           type: string
 *           enum: [MAIN, BRANCH]
 *           example: MAIN
 *
 *     WarehouseResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         branchId:
 *           type: integer
 *           nullable: true
 *         type:
 *           type: string
 *           enum: [MAIN, BRANCH]
 *         branch:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             address:
 *               type: string
 */

/* ====================== ROUTES ====================== */

/**
 * @swagger
 * /warehouses:
 *   get:
 *     summary: Get all warehouses
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: integer
 *         description: Lọc theo chi nhánh
 *     responses:
 *       200:
 *         description: Warehouses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WarehouseResponse'
 *
 *   post:
 *     summary: Create warehouse
 *     tags: [Warehouse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WarehouseRequest'
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarehouseResponse'
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /warehouses/{id}:
 *   get:
 *     summary: Get warehouse by ID
 *     tags: [Warehouse]
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
 *         description: Warehouse retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarehouseResponse'
 *       404:
 *         description: Warehouse not found
 *
 *   put:
 *     summary: Update warehouse
 *     tags: [Warehouse]
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
 *             $ref: '#/components/schemas/WarehouseRequest'
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarehouseResponse'
 *       404:
 *         description: Warehouse not found
 *
 *   delete:
 *     summary: Delete warehouse
 *     tags: [Warehouse]
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
 *         description: Warehouse deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Cannot delete warehouse with existing inventory
 *       404:
 *         description: Warehouse not found
 */