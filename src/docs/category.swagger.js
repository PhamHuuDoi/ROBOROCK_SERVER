/**
 * @swagger
 * tags:
 *   - name: Category
 *     description: Quản lý danh mục sản phẩm (Categories)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryRequest:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         name:
 *           type: string
 *           example: "Robot Hút Bụi"
 *         slug:
 *           type: string
 *           example: "robot-hut-bui"
 *         parentId:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         description: 
 *           type: string
 *           example: "Danh mục robot hút bụi chính hãng"
 *
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         parentId:
 *           type: integer
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         parent:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             slug:
 *               type: string
 */

/* ====================== ROUTES ====================== */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoryResponse'
 *
 *   post:
 *     summary: Tạo danh mục mới
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryRequest'
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CategoryResponse'
 *       409:
 *         description: Slug đã tồn tại
 *       403:
 *         description: Không có quyền truy cập (chỉ SYSTEM_ADMIN)
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một danh mục
 *     tags: [Category]
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CategoryResponse'
 *       404:
 *         description: Không tìm thấy danh mục
 *
 *   put:
 *     summary: Cập nhật danh mục
 *     tags: [Category]
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
 *             $ref: '#/components/schemas/CategoryRequest'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CategoryResponse'
 *       404:
 *         description: Không tìm thấy danh mục
 *       409:
 *         description: Slug đã tồn tại
 *
 *   delete:
 *     summary: Xóa danh mục
 *     tags: [Category]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Không tìm thấy danh mục
 */