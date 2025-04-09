import shopController from "@controllers/shopController";
import { authMiddleware } from "@middlewares/auth";
import { multerUploadMiddleware } from "@middlewares/multerUpload";
import shopValidation from "@validations/shopValidation";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /shops:
 *   get:
 *     summary: Get all shops
 *     description: Retrieve all shops with pagination
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Shops retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 shops:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Shop'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new shop
 *     description: Create a new shop for the authenticated user
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShopInput'
 *     responses:
 *       201:
 *         description: Shop created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router
  .route("/")
  .get(authMiddleware.isAuthorized, shopController.getAllShops)
  .post(
    authMiddleware.isAuthorized,
    shopValidation.createShop,
    shopController.createShop
  );

// router.route("/register").post(authMiddleware.isAuthorized, shopController.registerShop);

/**
 * @swagger
 * /shops/{id}/products:
 *   get:
 *     summary: Get products by shop
 *     description: Retrieve all products for a specific shop
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Server error
 */
router.route("/:id/products").get(shopController.getProductsByShopId);

/**
 * @swagger
 * /shops/{id}:
 *   get:
 *     summary: Get shop by ID
 *     description: Retrieve detailed information about a specific shop
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 shop:
 *                   $ref: '#/components/schemas/Shop'
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Server error
 */
router.route("/:id").get(shopController.getShopById);

/**
 * @swagger
 * /shops/{id}/cover-image:
 *   put:
 *     summary: Update shop cover image
 *     description: Update the cover image of a shop
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - coverImage
 *             properties:
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Shop cover image
 *     responses:
 *       200:
 *         description: Cover image updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Server error
 */
router
  .route("/:id/cover-image")
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single("coverImage"),
    shopController.updateCoverImage
  );

/**
 * @swagger
 * /shops/{id}/profile-image:
 *   put:
 *     summary: Update shop profile image
 *     description: Update the profile image of a shop
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profileImage
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Shop profile image
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Server error
 */
router
  .route("/:id/profile-image")
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single("profileImage"),
    shopController.updateProfileImage
  );

/**
 * @swagger
 * /shops/{id}/update:
 *   put:
 *     summary: Update shop information
 *     description: Update basic information of a shop
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShopUpdateInput'
 *     responses:
 *       200:
 *         description: Shop updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Server error
 */
router
  .route("/:id/update")
  .put(
    authMiddleware.isAuthorized,
    shopValidation.updateShop,
    shopController.updateShop
  );

/**
 * @swagger
 * /shops/admin/{id}/products:
 *   get:
 *     summary: Get products by shop for admin
 *     description: Retrieve all products for a specific shop (admin view)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Server error
 */
router
  .route("/admin/:id/products")
  .get(authMiddleware.isAuthorized, shopController.getProductsByShopIdForAdmin);

/**
 * @swagger
 * /shops/disable/{id}:
 *   put:
 *     summary: Disable a shop
 *     description: Disable a shop by ID (Admin only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop disabled successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Server error
 */
router
  .route("/disable/:id")
  .put(authMiddleware.isAuthorized, shopController.disableShop);

/**
 * @swagger
 * /shops/enable/{id}:
 *   put:
 *     summary: Enable a shop
 *     description: Enable a previously disabled shop by ID (Admin only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop enabled successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Server error
 */
router
  .route("/enable/:id")
  .put(authMiddleware.isAuthorized, shopController.enableShop);

/**
 * @swagger
 * /shops/approve/{id}:
 *   put:
 *     summary: Approve a shop
 *     description: Approve a pending shop by ID (Admin only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop approved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Server error
 */
router
  .route("/approve/:id")
  .put(authMiddleware.isAuthorized, shopController.approveShop);

/**
 * @swagger
 * /shops/reject/{id}:
 *   put:
 *     summary: Reject a shop
 *     description: Reject a pending shop by ID (Admin only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop rejected successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Shop not found
 *       500:
 *         description: Server error
 */
router
  .route("/reject/:id")
  .put(authMiddleware.isAuthorized, shopController.rejectShop);

export const SHOP_ROUTER = router;
