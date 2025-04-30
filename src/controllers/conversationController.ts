import conversationService from "@services/conversationService";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

class ConversationController {
  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.jwtUser as JwtPayload;
      const conversations = await conversationService.getConversations(userId);
      res.status(StatusCodes.OK).json({
        message: "Get conversations successfully",
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  }

  async getConversationByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const conversation = await conversationService.getConversationByUserId(
        Number(userId)
      );
      res.status(StatusCodes.OK).json({
        message: "Get conversation by user id successfully",
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  async createConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.jwtUser as JwtPayload;
      const { otherUserId } = req.body;
      const conversation = await conversationService.createConversation(
        userId,
        otherUserId
      );
      console.log(
        "🚀 ~ ConversationController ~ createConversation ~ otherUserId:",
        otherUserId
      );
      res.status(StatusCodes.CREATED).json({
        message: "Conversation created successfully",
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }
}

const conversationController = new ConversationController();

export default conversationController;
