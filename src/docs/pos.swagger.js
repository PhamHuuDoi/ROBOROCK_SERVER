/**
 * @swagger
 * tags:
 *   - name: POS
 *     description: Quản lý đơn hàng bán tại quầy (Point of Sale)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     PosOrderItemRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           example: 15
 *         quantity:
 *           type: integer
 *           example: 3
 *
 *     PosOrderCreateRequest:
 *       type: object
 *       required:
 *         - shiftId
 *         - paymentMethod
 *         - items
 *       properties:
 *         shiftId:
 *           type: integer
 *           example: 12
 *         paymentMethod:
 *           type: string
 *           enum: [CASH, CARD, TRANSFER, MOMO, VNPAY]
 *           example: CASH
 *         note:
 *           type: string
 *           example: "Khách mua combo robot + phụ kiện"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PosOrderItemRequest'
 *
 *     PosOrderResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         branchId:
 *           type: integer
 *         staffId:
 *           type: integer
 *         shiftId:
 *           type: integer
 *         totalAmount:
 *           type: number
 *         paymentMethod:
 *           type: string
 *         status:
 *           type: string
 *           enum: [COMPLETED, REFUNDED, CANCELLED]
 *         note:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         branch:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         staff:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             fullName:
 *               type: string
 *         shift:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               price:
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
 * /pos-orders:
 *   get:
 *     summary: Lấy danh sách đơn hàng POS (có phân trang)
 *     tags: [POS]
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
 *         name: branchId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: shiftId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: staffId
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
 *                     $ref: '#/components/schemas/PosOrderResponse'
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
 *     summary: Tạo đơn hàng POS mới (bán tại quầy)
 *     tags: [POS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PosOrderCreateRequest'
 *     responses:
 *       201:
 *         description: Tạo đơn POS thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PosOrderResponse'
 *       400:
 *         description: Ca chưa mở, không đủ tồn kho, hoặc sản phẩm không active
 *       403:
 *         description: Nhân viên không thuộc ca làm việc
 */

/**
 * @swagger
 * /pos-orders/{id}:
 *   get:
 *     summary: Lấy chi tiết một đơn hàng POS
 *     tags: [POS]
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
 *               $ref: '#/components/schemas/PosOrderResponse'
 *       404:
 *         description: Không tìm thấy đơn POS
 */