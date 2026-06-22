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
 *     summary: Get payment by order
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
 *         description: Payment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order or payment not found
 */

/**
 * @swagger
 * /orders/{orderId}/payment/confirm-cod:
 *   patch:
 *     summary: Confirm COD payment
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
 *         description: COD payment confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Order has not been delivered or is already paid
 *       404:
 *         description: Order or payment not found
 */