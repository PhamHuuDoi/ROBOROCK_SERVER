/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Quản lý tài khoản nhân viên (Staff Management)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     UserCreateRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - roleName
 *       properties:
 *         fullName:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         email:
 *           type: string
 *           example: "staff@roborock.com"
 *         password:
 *           type: string
 *           example: "123456"
 *         roleName:
 *           type: string
 *           enum: [STAFF, STORE_MANAGER, WAREHOUSE_MANAGER]
 *           example: STAFF
 *
 *     UserUpdateRequest:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         roleName:
 *           type: string
 *           enum: [STAFF, STORE_MANAGER, WAREHOUSE_MANAGER]
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         role:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         branchStaffs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               branch:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */

/* ====================== ROUTES ====================== */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách nhân viên (có phân trang và filter)
 *     tags: [User]
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
 *         name: roleId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *                     $ref: '#/components/schemas/UserResponse'
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
 *     summary: Tạo tài khoản nhân viên mới (chỉ System Admin)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *     responses:
 *       201:
 *         description: Tạo nhân viên thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       409:
 *         description: Email đã tồn tại
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy chi tiết thông tin một nhân viên
 *     tags: [User]
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
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Không tìm thấy nhân viên
 *
 *   put:
 *     summary: Cập nhật thông tin nhân viên
 *     tags: [User]
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
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *
 *   delete:
 *     summary: Xóa mềm nhân viên (Soft Delete)
 *     tags: [User]
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
 *         description: Xóa mềm thành công
 */

/**
 * @swagger
 * /users/{id}/reset-password:
 *   patch:
 *     summary: Reset password cho nhân viên
 *     tags: [User]
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
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Reset password thành công
 */

/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     summary: Kích hoạt / Vô hiệu hóa tài khoản nhân viên
 *     tags: [User]
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
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 */