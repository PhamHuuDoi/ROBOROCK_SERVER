/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: Quản lý sản phẩm (Products)
 */

/* ====================== SCHEMAS ====================== */
/**
 * @swagger
 * components:
 *   schemas:
 *     ProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - sku
 *         - categoryId
 *         - priceOnline
 *         - pricePos
 *       properties:
 *         name:
 *           type: string
 *           example: "Robot Hút Bụi Roborock S8"
 *         slug:
 *           type: string
 *           example: "robot-hut-bui-roborock-s8"
 *         sku:
 *           type: string
 *           example: "RB-S8-001"
 *         categoryId:
 *           type: integer
 *           example: 2
 *         description:
 *           type: string
 *           example: "Robot hút bụi cao cấp với công nghệ lau sàn"
 *         priceOnline:
 *           type: number
 *           format: decimal
 *           example: 12990000
 *         pricePos:
 *           type: number
 *           format: decimal
 *           example: 11990000
 *         weight:
 *           type: number
 *           format: decimal
 *           example: 4.5
 *         warrantyMonths:
 *           type: integer
 *           example: 24
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, OUT_OF_STOCK]
 *           example: ACTIVE
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         sku:
 *           type: string
 *         description:
 *           type: string
 *         priceOnline:
 *           type: number
 *         pricePos:
 *           type: number
 *         weight:
 *           type: number
 *         warrantyMonths:
 *           type: integer
 *         thumbnail:
 *           type: string
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 */

/* ====================== ROUTES ====================== */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lấy danh sách sản phẩm (có phân trang, tìm kiếm)
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm theo tên, slug, sku
 *       - in: query
 *         name: categoryId
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
 *                     $ref: '#/components/schemas/ProductResponse'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 perPage:
 *                   type: integer
 *
 *   post:
 *     summary: Tạo sản phẩm mới (hỗ trợ upload ảnh)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               sku:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               description:
 *                 type: string
 *               priceOnline:
 *                 type: number
 *               pricePos:
 *                 type: number
 *               weight:
 *                 type: number
 *               warrantyMonths:
 *                 type: integer
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       403:
 *         description: Không có quyền
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Lấy chi tiết một sản phẩm
 *     tags: [Product]
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
 *                   $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *
 *   put:
 *     summary: Cập nhật sản phẩm (hỗ trợ upload ảnh mới)
 *     tags: [Product]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               sku:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               description:
 *                 type: string
 *               priceOnline:
 *                 type: number
 *               pricePos:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *
 *   delete:
 *     summary: Xóa mềm sản phẩm (Soft Delete)
 *     tags: [Product]
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
 *         description: Xóa mềm thành công
 */

/**
 * @swagger
 * /products/{id}/images/{imageId}:
 *   delete:
 *     summary: Xóa một ảnh phụ của sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Xóa ảnh thành công
 *       404:
 *         description: Không tìm thấy ảnh
 */