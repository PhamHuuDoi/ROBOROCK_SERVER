/**
 * @swagger
 * tags:
 *   - name: Branch
 *     description: Quản lý chi nhánh (branchs)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     BranchRequest:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           example: "Chi nhánh Hà Nội"
 *         address:
 *           type: string
 *           example: "123 Đường Láng, Quận Đống Đa, Hà Nội"
 *         phone:
 *           type: string
 *           example: "0123456789"
 *         email:
 *           type: string
 *           example: "hanoi@roborock.com"
 *         managerId:
 *           type: integer
 *           example: 5
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           example: ACTIVE
 *
 *     BranchResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         managerId:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         manager:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *
 *   branchstaffRequest:
 *       type: object
 *       required:
 *         - staffId
 *       properties:
 *         staffId:
 *           type: integer
 *           example: 10
 */

/* ====================== ROUTES ====================== */

/**
 * @swagger
 * /branchs:
 *   get:
 *     summary: Lấy danh sách tất cả chi nhánh
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BranchResponse'
 *
 *   post:
 *     summary: Tạo chi nhánh mới
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchRequest'
 *     responses:
 *       201:
 *         description: Tạo chi nhánh thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *       403:
 *         description: Không có quyền truy cập
 */

/**
 * @swagger
 * /branchs/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một chi nhánh
 *     tags: [Branch]
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
 *               $ref: '#/components/schemas/BranchResponse'
 *       404:
 *         description: Không tìm thấy chi nhánh
 *
 *   put:
 *     summary: Cập nhật thông tin chi nhánh
 *     tags: [Branch]
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
 *             $ref: '#/components/schemas/BranchRequest'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchResponse'
 *
 *   delete:
 *     summary: Xóa chi nhánh
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Xóa thành công
 *       400:
 *         description: Không thể xóa vì chi nhánh đang có đơn hàng
 *       404:
 *         description: Không tìm thấy chi nhánh
 */

/**
 * @swagger
 * /branchs/{id}/staffs:
 *   post:
 *     summary: Thêm nhân viên vào chi nhánh
 *     tags: [Branch]
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
 *             $ref: '#/components/schemas/BranchStaffRequest'
 *     responses:
 *       201:
 *         description: Thêm nhân viên thành công
 *       409:
 *         description: Nhân viên đã thuộc chi nhánh này
 *
 *   delete:
 *     summary: Xóa nhân viên khỏi chi nhánh
 *     tags: [Branch]
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
 *       204:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy nhân viên trong chi nhánh
 */