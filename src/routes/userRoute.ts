import userController from "@controllers/userController";
import { authMiddleware } from "@middlewares/auth";
import { multerUploadMiddleware } from "@middlewares/multerUpload";
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

//   router.route("/refresh_token").get(userController.refreshToken);

router
  .route("/logout")
  .post(authMiddleware.isAuthorized, userController.logout);

router
  .route("/forgot-password")
  .put(userValidation.forgotPassword, userController.forgotPassword);

// router.route("/update").put(multerUploadMiddleware.upload.single("avatar"), userValidation.update, userController.update);

export const USER_ROUTER = router;
