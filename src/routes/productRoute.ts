import productController from "@controllers/productController";
import { authMiddleware } from "@middlewares/auth";
import { multerUploadMiddleware } from "@middlewares/multerUpload";
import productValidation from "@validations/productValidation";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .get(productController.getProducts)
  .post(
    multerUploadMiddleware.upload.array("images"),
    productValidation.createProduct,
    productController.createProduct
  );

router
  .route("/:id")
  .get(productController.getProductById)
  .put(
    multerUploadMiddleware.upload.array("images"),
    productValidation.updateProduct,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

router
  .route("/shops/:id/categories/:categoryId")
  .get(productController.getProductsByShopIdAndCategoryId);

router
  .route("/disable/:id")
  .put(authMiddleware.isAuthorized, productController.disableProduct);
router
  .route("/enable/:id")
  .put(authMiddleware.isAuthorized, productController.enableProduct);

export const PRODUCT_ROUTER = router;
