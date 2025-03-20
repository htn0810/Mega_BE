import productController from "@controllers/productController";
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

router.route("/:id").get(productController.getProductById);
// .delete(productController.deleteProduct);

export const PRODUCT_ROUTER = router;
