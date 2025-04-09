import discountController from "@controllers/discountController";
import { authMiddleware } from "@middlewares/auth";
import discountValidation from "@validations/discountValidation";
import { Router } from "express";

const router = Router();

// For User
/**
 * @swagger
 * /discounts/shop/{shopId}/product/{productId}:
 *   get:
 *     summary: Get all discounts for a product
 *     description: Retrieve all available discounts for a specific product in a shop
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Discounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 discounts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Discount'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Shop or product not found
 *       500:
 *         description: Server error
 */
router
  .route("/shop/:shopId/product/:productId")
  .get(
    authMiddleware.isAuthorized,
    discountController.getAllDiscountsOfProduct
  );

// Get total price of order after discount
/**
 * @swagger
 * /discounts/amount:
 *   post:
 *     summary: Calculate discount amount
 *     description: Calculate the total discount amount for products with a discount code
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               code:
 *                 type: string
 *                 description: Discount code (optional)
 *               products:
 *                 type: array
 *                 description: List of products in cart
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                     - price
 *                   properties:
 *                     productId:
 *                       type: string
 *                     shopId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *     responses:
 *       200:
 *         description: Discount amount calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 amount:
 *                   type: number
 *                   description: Total discount amount
 *                 totalPrice:
 *                   type: number
 *                   description: Total price after discount
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Discount code not found or not applicable
 *       500:
 *         description: Server error
 */
router
  .route("/amount")
  .post(authMiddleware.isAuthorized, discountController.getDiscountAmount);

// For Shop owner
/**
 * @swagger
 * /discounts:
 *   get:
 *     summary: Get all discounts
 *     description: Retrieve all discounts for the authenticated shop owner
 *     tags: [Discounts]
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
 *         description: Discounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 discounts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Discount'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new discount
 *     description: Create a new discount for products
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiscountInput'
 *     responses:
 *       201:
 *         description: Discount created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router
  .route("/")
  .get(authMiddleware.isAuthorized, discountController.getAllDiscounts)
  .post(
    authMiddleware.isAuthorized,
    discountValidation.createDiscount,
    discountController.createDiscount
  );

export const DISCOUNT_ROUTER = router;
