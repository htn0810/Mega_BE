import categoryController from "@controllers/categoryController";
import { multerUploadMiddleware } from "@middlewares/multerUpload";
import categoryValidation from "@validations/categoryValidation";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(
    multerUploadMiddleware.upload.single("categoryImg"),
    categoryValidation.createCategory,
    categoryController.createCategory
  );

router
  .route("/:id")
  .put(
    multerUploadMiddleware.upload.single("categoryImg"),
    categoryValidation.updateCategory,
    categoryController.updateCategory
  );

export const CATEGORY_ROUTER = router;
