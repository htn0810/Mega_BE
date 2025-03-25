import userController from "@controllers/userController";
import { authMiddleware } from "@middlewares/auth";
import { multerUploadMiddleware } from "@middlewares/multerUpload";
import { forgotPasswordLimiter } from "@middlewares/rateLimiter";
import userValidation from "@validations/userValidation";
import { Router } from "express";

const router = Router();

router
  .route("/register")
  .post(userValidation.registerOrLogin, userController.register);

router
  .route("/verify")
  .put(userValidation.verifyAccount, userController.verifyAccount);

router
  .route("/login")
  .post(userValidation.registerOrLogin, userController.login);

router.route("/refresh-token").get(userController.refreshToken);

router
  .route("/logout")
  .post(authMiddleware.isAuthorized, userController.logout);

router
  .route("/forgot-password")
  .put(
    forgotPasswordLimiter,
    userValidation.forgotPassword,
    userController.forgotPassword
  );

router
  .route("/update/:id")
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single("avatar"),
    userValidation.update,
    userController.update
  );

router
  .route("/change-password/:id")
  .put(
    authMiddleware.isAuthorized,
    userValidation.changePassword,
    userController.changePassword
  );

router
  .route("/update/roles/:id")
  .put(authMiddleware.isAuthorized, userController.updateRoles);

export const USER_ROUTER = router;
