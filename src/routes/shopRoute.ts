import shopController from "@controllers/shopController";
import { authMiddleware } from "@middlewares/auth";
import { Router } from "express";

const router = Router();

router.route("/").get(authMiddleware.isAuthorized, shopController.getAllShops);

export const SHOP_ROUTER = router;
