/**
 * @swagger
 * tags:
 *   - name: Shift
 *     description: Quản lý ca làm việc (Shift Management)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     ShiftOpenRequest:
 *       type: object
 *       required:
 *         - branchId
 *         - name
 *       properties:
 *         branchId:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Ca sáng 07/06/2026"
 *
 *     ShiftAddStaffRequest:
 *       type: object
 *       required:
 *         - staffId
 *       properties:
 *         staffId:
 *           type: integer
 *           example: 5
 *
 *     ShiftResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         branchId:
 *           type: integer
 *         name:
 *           type: string
 *         status:
 *           type: string
 *           enum: [OPEN, CLOSED]
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         totalRevenue:
 *           type: number
 *         openedBy:
 *           type: integer
 *         closedBy:
 *           type: integer
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
 *         opener:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             fullName:
 *               type: string
 *         closer:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             fullName:
 *               type: string
 *         shiftStaffs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               staff:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fullName:
 *                     type: string
 */

/* ====================== ROUTES ====================== */

/**
 * @swagger
 * /shifts:
 *   get:
 *     summary: Lấy danh sách ca làm việc (có phân trang)
 *     tags: [Shift]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, CLOSED]
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
 *                     $ref: '#/components/schemas/ShiftResponse'
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
 *     summary: Mở ca làm việc mới
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShiftOpenRequest'
 *     responses:
 *       201:
 *         description: Mở ca thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftResponse'
 *       400:
 *         description: Chi nhánh đã có ca đang mở
 */

/**
 * @swagger
 * /shifts/{id}:
 *   get:
 *     summary: Lấy chi tiết một ca làm việc
 *     tags: [Shift]
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
 *               $ref: '#/components/schemas/ShiftResponse'
 *       404:
 *         description: Không tìm thấy ca
 */

/**
 * @swagger
 * /shifts/{id}/close:
 *   patch:
 *     summary: Đóng ca làm việc
 *     tags: [Shift]
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
 *         description: Đóng ca thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftResponse'
 *       400:
 *         description: Ca đã đóng hoặc không tồn tại
 */

/**
 * @swagger
 * /shifts/{id}/staffs:
 *   post:
 *     summary: Thêm nhân viên vào ca
 *     tags: [Shift]
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
 *             $ref: '#/components/schemas/ShiftAddStaffRequest'
 *     responses:
 *       201:
 *         description: Thêm nhân viên thành công
 *       400:
 *         description: Ca đã đóng
 *       409:
 *         description: Nhân viên đã có trong ca
 *
 *   delete:
 *     summary: Nhân viên rời ca
 *     tags: [Shift]
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
 *       200:
 *         description: Nhân viên đã rời ca thành công
 *       400:
 *         description: Ca đã đóng
 */