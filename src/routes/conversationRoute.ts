import conversationController from "@controllers/conversationController";
import { authMiddleware } from "@middlewares/auth";
import { multerUploadMiddleware } from "@middlewares/multerUpload";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .get(authMiddleware.isAuthorized, conversationController.getConversations)
  .post(authMiddleware.isAuthorized, conversationController.createConversation);

router
  .route("/:id")
  .get(authMiddleware.isAuthorized, conversationController.getConversationById);

router
  .route("/user/:userId")
  .get(
    authMiddleware.isAuthorized,
    conversationController.getConversationByUserId
  );

// router
//   .route("/upload-image")
//   .post(
//     authMiddleware.isAuthorized,
//     multerUploadMiddleware.upload.single("image"),
//     conversationController.uploadFile
//   );

export const CONVERSATION_ROUTER = router;
