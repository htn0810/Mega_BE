import cartController from "@controllers/cartController";
import { authMiddleware } from "@middlewares/auth";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .get(authMiddleware.isAuthorized, cartController.getCart)
  .post(authMiddleware.isAuthorized, cartController.addToCart);

router
  .route("/increase-quantity")
  .post(authMiddleware.isAuthorized, cartController.increaseProductQuantity);

router
  .route("/decrease-quantity")
  .post(authMiddleware.isAuthorized, cartController.decreaseProductQuantity);

router
  .route("/remove-product")
  .post(authMiddleware.isAuthorized, cartController.removeProductFromCart);

router
  .route("/:id")
  .delete(authMiddleware.isAuthorized, cartController.deleteCart);

// router
//   .route("/:id")
//   .put(
//     multerUploadMiddleware.upload.single("categoryImg"),
//     categoryValidation.updateCategory,
//     categoryController.updateCategory
//   );

export const CART_ROUTER = router;
