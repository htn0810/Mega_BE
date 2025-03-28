import discountController from "@controllers/discountController";
import { authMiddleware } from "@middlewares/auth";
import discountValidation from "@validations/discountValidation";
import { Router } from "express";

const router = Router();

// For User
router
  .route("/shop/:shopId/product/:productId")
  .get(
    authMiddleware.isAuthorized,
    discountController.getAllDiscountsOfProduct
  );

// Get total price of order after discount
router
  .route("/amount")
  .post(authMiddleware.isAuthorized, discountController.getDiscountAmount);

// For Shop owner
router
  .route("/")
  .get(authMiddleware.isAuthorized, discountController.getAllDiscounts)
  .post(
    authMiddleware.isAuthorized,
    discountValidation.createDiscount,
    discountController.createDiscount
  );

export const DISCOUNT_ROUTER = router;
