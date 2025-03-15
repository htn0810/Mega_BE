import userService from "@services/userService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class UserController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registeredUser = await userService.register(req.body);
      res.status(StatusCodes.CREATED).json({
        message: "User registered successfully!",
        data: registeredUser,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const verifiedUser = await userService.verifyAccount(req.body);
      res.status(StatusCodes.OK).json({
        message: "Account verified successfully!",
        data: verifiedUser,
      });
    } catch (error) {
      next(error);
    }
  };
}

const userController = new UserController();
export default userController;
