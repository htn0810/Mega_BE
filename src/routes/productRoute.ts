import productController from "@controllers/productController";
import { multerUploadMiddleware } from "@middlewares/multerUpload";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .post(
    multerUploadMiddleware.upload.array("images"),
    productController.createProduct
  );

router.route("/:id").get(productController.getProductById);
// .delete(productController.deleteProduct);

export const PRODUCT_ROUTER = router;
