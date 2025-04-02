import shopController from "@controllers/shopController";
import { authMiddleware } from "@middlewares/auth";
import { Router } from "express";

const router = Router();

router.route("/").get(authMiddleware.isAuthorized, shopController.getAllShops);

// router.route("/register").post(authMiddleware.isAuthorized, shopController.registerShop);

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
