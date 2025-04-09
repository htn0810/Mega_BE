import cartController from "@controllers/cartController";
import { authMiddleware } from "@middlewares/auth";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Get user's cart
 *     description: Retrieve the current user's shopping cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 *   post:
 *     summary: Add product to cart
 *     description: Add a product to the current user's shopping cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to add
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router
  .route("/")
  .get(authMiddleware.isAuthorized, cartController.getCart)
  .post(authMiddleware.isAuthorized, cartController.addToCart);

/**
 * @swagger
 * /carts/increase-quantity:
 *   post:
 *     summary: Increase product quantity
 *     description: Increase the quantity of a product in the cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to increase quantity
 *     responses:
 *       200:
 *         description: Product quantity increased successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Product not found in cart
 *       500:
 *         description: Server error
 */
router
  .route("/increase-quantity")
  .post(authMiddleware.isAuthorized, cartController.increaseProductQuantity);

/**
 * @swagger
 * /carts/decrease-quantity:
 *   post:
 *     summary: Decrease product quantity
 *     description: Decrease the quantity of a product in the cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to decrease quantity
 *     responses:
 *       200:
 *         description: Product quantity decreased successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Product not found in cart
 *       500:
 *         description: Server error
 */
router
  .route("/decrease-quantity")
  .post(authMiddleware.isAuthorized, cartController.decreaseProductQuantity);

/**
 * @swagger
 * /carts/remove-product:
 *   post:
 *     summary: Remove product from cart
 *     description: Remove a product completely from the cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to remove
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Product not found in cart
 *       500:
 *         description: Server error
 */
router
  .route("/remove-product")
  .post(authMiddleware.isAuthorized, cartController.removeProductFromCart);

/**
 * @swagger
 * /carts/{id}:
 *   delete:
 *     summary: Delete cart
 *     description: Delete a cart by ID
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router
  .route("/:id")
  .delete(authMiddleware.isAuthorized, cartController.deleteCart);

export const CART_ROUTER = router;
