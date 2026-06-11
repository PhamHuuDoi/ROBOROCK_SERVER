/**
 * @swagger
 * tags:
 *   - name: Inventory
 *     description: Quản lý tồn kho (Inventory Management)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         warehouseId:
 *           type: integer
 *         productId:
 *           type: integer
 *         availableQuantity:
 *           type: integer
 *         faultyQuantity:
 *           type: integer
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         product:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             sku:
 *               type: string
 *             thumbnail:
 *               type: string
 *         warehouse:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             type:
 *               type: string
 *               enum: [MAIN, BRANCH]
 *
 *     InventorySummary:
 *       type: object
 *       properties:
 *         totalAvailable:
 *           type: integer
 *         totalFaulty:
 *           type: integer
 */

/* ====================== ROUTES ====================== */

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Lấy danh sách tồn kho toàn bộ (có phân trang)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventoryResponse'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */

/**
 * @swagger
 * /inventory/branch/{branchId}:
 *   get:
 *     summary: Lấy tồn kho theo chi nhánh (tất cả kho thuộc chi nhánh)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventoryResponse'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */

/**
 * @swagger
 * /inventory/product/{productId}:
 *   get:
 *     summary: Lấy tồn kho của một sản phẩm tại tất cả các kho
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventoryResponse'
 *                 summary:
 *                   $ref: '#/components/schemas/InventorySummary'
 */

/**
 * @swagger
 * /inventory/warehouse/{warehouseId}:
 *   get:
 *     summary: Lấy tồn kho chi tiết của một kho cụ thể
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryResponse'
 */
