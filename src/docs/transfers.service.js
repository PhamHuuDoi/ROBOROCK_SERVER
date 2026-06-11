/**
 * @swagger
 * tags:
 *   - name: Transfer
 *     description: Quản lý yêu cầu chuyển kho (Transfer Requests)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     TransferItemRequest:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           example: 25
 *         quantity:
 *           type: integer
 *           example: 30
 *
 *     TransferCreateRequest:
 *       type: object
 *       required:
 *         - fromWarehouseId
 *         - toWarehouseId
 *         - items
 *       properties:
 *         fromWarehouseId:
 *           type: integer
 *           example: 1
 *         toWarehouseId:
 *           type: integer
 *           example: 5
 *         note:
 *           type: string
 *           example: "Chuyển hàng cho chi nhánh Hà Nội"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TransferItemRequest'
 *
 *     TransferResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         fromWarehouseId:
 *           type: integer
 *         toWarehouseId:
 *           type: integer
 *         requestedBy:
 *           type: integer
 *         approvedBy:
 *           type: integer
 *         receivedBy:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED]
 *         note:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         receivedAt:
 *           type: string
 *           format: date-time
 *         completedAt:
 *           type: string
 *           format: date-time
 *         fromWarehouse:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         toWarehouse:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         requester:
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
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
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
 * /transfers:
 *   get:
 *     summary: Lấy danh sách yêu cầu chuyển kho (có phân trang)
 *     tags: [Transfer]
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
 *           enum: [PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED]
 *       - in: query
 *         name: fromWarehouseId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: toWarehouseId
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
 *                     $ref: '#/components/schemas/TransferResponse'
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
 *     summary: Tạo yêu cầu chuyển kho mới
 *     tags: [Transfer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferCreateRequest'
 *     responses:
 *       201:
 *         description: Tạo yêu cầu chuyển kho thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransferResponse'
 *       400:
 *         description: Không đủ tồn kho hoặc vi phạm quy tắc chuyển kho
 */

/**
 * @swagger
 * /transfers/{id}:
 *   get:
 *     summary: Lấy chi tiết một yêu cầu chuyển kho
 *     tags: [Transfer]
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
 *               $ref: '#/components/schemas/TransferResponse'
 *       404:
 *         description: Không tìm thấy yêu cầu
 */

/**
 * @swagger
 * /transfers/{id}/approve:
 *   patch:
 *     summary: Duyệt yêu cầu chuyển kho
 *     tags: [Transfer]
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
 *         description: Duyệt thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransferResponse'
 */

/**
 * @swagger
 * /transfers/{id}/reject:
 *   patch:
 *     summary: Từ chối yêu cầu chuyển kho
 *     tags: [Transfer]
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
 *         description: Từ chối thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransferResponse'
 */

/**
 * @swagger
 * /transfers/{id}/complete:
 *   patch:
 *     summary: Hoàn thành chuyển kho (cập nhật tồn kho)
 *     tags: [Transfer]
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
 *         description: Hoàn thành chuyển kho thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransferResponse'
 */

/**
 * @swagger
 * /transfers/{id}/cancel:
 *   patch:
 *     summary: Hủy yêu cầu chuyển kho
 *     tags: [Transfer]
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
 *         description: Hủy thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransferResponse'
 */