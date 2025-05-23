import { ADDRESS_ROUTER } from "@routes/addressRoute";
import { CART_ROUTER } from "@routes/cartRoute";
import { CATEGORY_ROUTER } from "@routes/categoryRoute";
import { CONVERSATION_ROUTER } from "@routes/conversationRoute";
import { DISCOUNT_ROUTER } from "@routes/discountRoute";
import { PRODUCT_ROUTER } from "@routes/productRoute";
import { SHOP_ROUTER } from "@routes/shopRoute";
import { USER_ROUTER } from "@routes/userRoute";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: API health check
 *     description: Check if the API is running
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello World
 */
router.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Hello World" });
});

router.use("/categories", CATEGORY_ROUTER);
router.use("/users", USER_ROUTER);
router.use("/products", PRODUCT_ROUTER);
router.use("/carts", CART_ROUTER);
router.use("/discounts", DISCOUNT_ROUTER);
router.use("/addresses", ADDRESS_ROUTER);
router.use("/shops", SHOP_ROUTER);
router.use("/conversations", CONVERSATION_ROUTER);

export const API_ROUTER = router;
