import categoryController from "@controllers/categoryController";
import { authMiddleware } from "@middlewares/auth";
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

router.route("/all").get(categoryController.getAllCategoriesWithoutPagination);

router
  .route("/:id")
  .put(
    multerUploadMiddleware.upload.single("categoryImg"),
    categoryValidation.updateCategory,
    categoryController.updateCategory
  )
  .delete(authMiddleware.isAuthorized, categoryController.deleteCategory);

export const CATEGORY_ROUTER = router;
