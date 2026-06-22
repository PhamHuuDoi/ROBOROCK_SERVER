/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Quản lý đơn hàng online (Orders)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItemRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           example: 10
 *         quantity:
 *           type: integer
 *           example: 2
 *
 *     OrderCreateRequest:
 *       type: object
 *       required:
 *         - items
 *         - shippingAddress
 *         - paymentMethod
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemRequest'
 *         shippingAddress:
 *           type: string
 *           example: "123 Đường ABC, Quận 1, TP.HCM"
 *         paymentMethod:
 *           type: string
 *           enum: [COD, CARD, TRANSFER, MOMO, VNPAY]
 *           example: COD
 *         note:
 *           type: string
 *           example: "Giao hàng sau 5h chiều"
 *         branchId:
 *           type: integer
 *           description: "Nếu không truyền sẽ tự động gợi ý chi nhánh gần nhất"
 *         customerLat:
 *           type: number
 *         customerLng:
 *           type: number
 *
 *     OrderResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         customerId:
 *           type: integer
 *         branchId:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PACKING, SHIPPING, DELIVERED, CANCELLED]
 *         totalAmount:
 *           type: number
 *         shippingAddress:
 *           type: string
 *         paymentMethod:
 *           type: string
 *         note:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         confirmedAt:
 *           type: string
 *           format: date-time
 *         customer:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *         branch:
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
 * /orders/suggest-branches:
 *   post:
 *     summary: Suggest branches for order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItemRequest'
 *               customerLat:
 *                 type: number
 *               customerLng:
 *                 type: number
 *     responses:
 *       200:
 *         description: Suggested branches retrieved successfully
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Order]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PACKING, SHIPPING, DELIVERED, CANCELLED]
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderResponse'
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
 *     summary: Create order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCreateRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Order]
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
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 *
 *   patch:
 *     summary: Update order status
 *     tags: [Order]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PACKING, SHIPPING, DELIVERED]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */

/**
 * @swagger
 * /orders/{id}/confirm:
 *   patch:
 *     summary: Confirm order
 *     tags: [Order]
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
 *         description: Order confirmed successfully
 */

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Cancel order
 *     tags: [Order]
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
 *         description: Order canceled successfully
 */