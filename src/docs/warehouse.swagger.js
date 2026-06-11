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
 *     summary: Lấy danh sách tất cả kho hàng
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
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WarehouseResponse'
 *
 *   post:
 *     summary: Tạo kho hàng mới
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
 *         description: Tạo kho thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarehouseResponse'
 *       403:
 *         description: Không có quyền truy cập
 */

/**
 * @swagger
 * /warehouses/{id}:
 *   get:
 *     summary: Lấy chi tiết một kho hàng
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
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarehouseResponse'
 *       404:
 *         description: Không tìm thấy kho
 *
 *   put:
 *     summary: Cập nhật thông tin kho hàng
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
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarehouseResponse'
 *       404:
 *         description: Không tìm thấy kho
 *
 *   delete:
 *     summary: Xóa kho hàng
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
 *         description: Xóa thành công
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
 *         description: Không thể xóa kho đang có tồn kho
 *       404:
 *         description: Không tìm thấy kho
 */