/**
 * @swagger
 * tags:
 *   - name: Import
 *     description: Quản lý phiếu nhập kho (Import Receipts)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     ImportItemRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - importPrice
 *       properties:
 *         productId:
 *           type: integer
 *           example: 15
 *         quantity:
 *           type: integer
 *           example: 50
 *         importPrice:
 *           type: number
 *           format: decimal
 *           example: 4500000
 *
 *     ImportCreateRequest:
 *       type: object
 *       required:
 *         - warehouseId
 *         - supplierId
 *         - items
 *       properties:
 *         warehouseId:
 *           type: integer
 *           example: 1
 *         supplierId:
 *           type: integer
 *           example: 3
 *         note:
 *           type: string
 *           example: "Nhập lô hàng tháng 6"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ImportItemRequest'
 *
 *     ImportResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         warehouseId:
 *           type: integer
 *         supplierId:
 *           type: integer
 *         createdBy:
 *           type: integer
 *         note:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         warehouse:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         supplier:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             fullName:
 *               type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               importPrice:
 *                 type: number
 *               product:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   sku:
 *                     type: string
 */

/* ====================== ROUTES ====================== */

/**
 * @swagger
 * /imports:
 *   get:
 *     summary: Lấy danh sách phiếu nhập kho (có phân trang)
 *     tags: [Import]
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
 *         name: supplierId
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
 *                     $ref: '#/components/schemas/ImportResponse'
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
 *
 *   post:
 *     summary: Tạo phiếu nhập kho mới
 *     tags: [Import]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImportCreateRequest'
 *     responses:
 *       201:
 *         description: Tạo phiếu nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImportResponse'
 *       400:
 *         description: Chỉ được nhập vào kho MAIN
 *       404:
 *         description: Kho hoặc nhà cung cấp không tồn tại
 */

/**
 * @swagger
 * /imports/{id}:
 *   get:
 *     summary: Lấy chi tiết một phiếu nhập kho
 *     tags: [Import]
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
 *               $ref: '#/components/schemas/ImportResponse'
 *       404:
 *         description: Không tìm thấy phiếu nhập
 */