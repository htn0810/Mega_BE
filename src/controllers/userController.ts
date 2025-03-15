import userService from "@services/userService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { StringValue } from "ms";
import ms from "ms";

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

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { loggedInUser, accessToken, refreshToken } =
        await userService.login(req.body);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms("2h" as StringValue),
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms("15 days" as StringValue),
      });
      res.status(StatusCodes.OK).json({
        message: "Logged in successfully!",
        data: {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(StatusCodes.OK).json({
        message: "Logged out successfully!",
      });
    } catch (error) {
      next(error);
    }
  };
}

const userController = new UserController();
export default userController;
