import shopController from "@controllers/shopController";
import { authMiddleware } from "@middlewares/auth";
import { multerUploadMiddleware } from "@middlewares/multerUpload";
import shopValidation from "@validations/shopValidation";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .get(authMiddleware.isAuthorized, shopController.getAllShops)
  .post(
    authMiddleware.isAuthorized,
    shopValidation.createShop,
    shopController.createShop
  );

// router.route("/register").post(authMiddleware.isAuthorized, shopController.registerShop);

// For User
router.route("/:id/products").get(shopController.getProductsByShopId);

router.route("/:id").get(shopController.getShopById);

// For Admin
router
  .route("/:id/cover-image")
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single("coverImage"),
    shopController.updateCoverImage
  );

router
  .route("/:id/profile-image")
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single("profileImage"),
    shopController.updateProfileImage
  );

router
  .route("/:id/update")
  .put(
    authMiddleware.isAuthorized,
    shopValidation.updateShop,
    shopController.updateShop
  );

router
  .route("/admin/:id/products")
  .get(authMiddleware.isAuthorized, shopController.getProductsByShopIdForAdmin);

router
  .route("/disable/:id")
  .put(authMiddleware.isAuthorized, shopController.disableShop);

router
  .route("/enable/:id")
  .put(authMiddleware.isAuthorized, shopController.enableShop);

router
  .route("/approve/:id")
  .put(authMiddleware.isAuthorized, shopController.approveShop);

router
  .route("/reject/:id")
  .put(authMiddleware.isAuthorized, shopController.rejectShop);

export const SHOP_ROUTER = router;
