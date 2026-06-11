/**
 * @swagger
 * tags:
 *   - name: Payment
 *     description: Quản lý thanh toán đơn hàng (Payments)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         orderId:
 *           type: integer
 *         method:
 *           type: string
 *           enum: [COD, CARD, TRANSFER, MOMO, VNPAY]
 *         amount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [PENDING, PAID, FAILED, REFUNDED]
 *         transactionCode:
 *           type: string
 *         paidAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/* ====================== ROUTES ====================== */

/**
 * @swagger
 * /orders/{orderId}/payment:
 *   get:
 *     summary: Lấy thông tin thanh toán của một đơn hàng
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       403:
 *         description: Không có quyền xem thanh toán này (Customer chỉ xem đơn của mình)
 *       404:
 *         description: Không tìm thấy đơn hàng hoặc thanh toán
 */

/**
 * @swagger
 * /orders/{orderId}/payment/confirm-cod:
 *   patch:
 *     summary: Xác nhận đã thu tiền COD (dành cho Staff)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xác nhận thanh toán COD thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Đơn hàng chưa giao thành công hoặc đã thanh toán
 *       404:
 *         description: Không tìm thấy đơn hàng hoặc thanh toán
 */