/**
 * @swagger
 * tags:
 *   - name: Profile
 *     description: Quản lý địa chỉ / profile khách hàng (Customer Profiles)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     ProfileRequest:
 *       type: object
 *       required:
 *         - phone
 *         - address
 *       properties:
 *         phone:
 *           type: string
 *           example: "0123456789"
 *         address:
 *           type: string
 *           example: "123 Đường Nguyễn Trãi, Quận 1, TP.HCM"
 *         isDefault:
 *           type: boolean
 *           example: true
 *
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         isDefault:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/* ====================== ROUTES ====================== */

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Lấy tất cả profile (địa chỉ) của khách hàng đang đăng nhập
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProfileResponse'
 *
 *   post:
 *     summary: Tạo profile (địa chỉ) mới
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileRequest'
 *     responses:
 *       201:
 *         description: Tạo profile thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 */

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Lấy chi tiết một profile
 *     tags: [Profile]
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
 *               $ref: '#/components/schemas/ProfileResponse'
 *       403:
 *         description: Không có quyền truy cập (không phải profile của bạn)
 *       404:
 *         description: Không tìm thấy profile
 *
 *   put:
 *     summary: Cập nhật profile
 *     tags: [Profile]
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
 *             $ref: '#/components/schemas/ProfileRequest'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *
 *   delete:
 *     summary: Xóa một profile
 *     tags: [Profile]
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
 *       400:
 *         description: Không thể xóa profile duy nhất
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy profile
 */

/**
 * @swagger
 * /profiles/{id}/set-default:
 *   patch:
 *     summary: Đặt profile này làm địa chỉ mặc định
 *     tags: [Profile]
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
 *         description: Đặt làm mặc định thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 */