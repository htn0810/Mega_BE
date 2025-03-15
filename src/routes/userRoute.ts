import userController from "@controllers/userController";
import { multerUploadMiddleware } from "@middlewares/multerUpload";
import userValidation from "@validations/userValidation";
import { Router } from "express";

const router = Router();

router
  .route("/register")
  .post(userValidation.register, userController.register);

// router
//   .route("/verify")
//   .post(userValidation.verify, userController.verify);

// router
//   .route("/login")
//   .put(
//     userValidation.login,
//     userController.login
//   );

//   router.route("/refresh_token").get(userController.refreshToken);

// router
//   .route("/logout")
//   .post(userController.logout);

// router
//   .route("/forgot-password")
//   .post(userValidation.forgotPassword, userController.forgotPassword);

// router.route("/update").put(multerUploadMiddleware.upload.single("avatar"), userValidation.update, userController.update);

export const USER_ROUTER = router;
