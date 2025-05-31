import { UnauthorizedError } from "@exceptions/UnauthorizedError";
import userService from "@services/userService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { StringValue } from "ms";
import ms from "ms";

class UserController {
  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { page = 1, limit = 10, status = "all" } = req.query;
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 10;
      }
      if (!status) {
        status = "all";
      }
      const users = await userService.getUsers(
        parseInt(page as string),
        parseInt(limit as string),
        status as string
      );
      res.status(StatusCodes.OK).json({
        message: "Users fetched successfully!",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

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

      this.setCookies(res, accessToken, refreshToken);
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

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = await userService.refreshToken(
        req.cookies.refreshToken
      );
      this.setCookies(res, accessToken, req.cookies.refreshToken);
      res.status(StatusCodes.OK).json({
        message: "Token refreshed successfully!",
        data: {
          accessToken,
        },
      });
    } catch (_error) {
      next(new UnauthorizedError("Please login again!"));
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

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await userService.forgotPassword(email);
      res.status(StatusCodes.OK).json({
        message: "Password reset email sent successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (req.file) {
        req.body.avatar = req.file;
      }
      const updatedUser = await userService.update(parseInt(id), req.body);
      res.status(StatusCodes.OK).json({
        message: "User updated successfully!",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };

  updateRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { roles } = req.body;
      const updatedUser = await userService.updateRoles(parseInt(id), roles);
      res.status(StatusCodes.OK).json({
        message: "User roles updated successfully!",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };
  private setCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string
  ) => {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("15 days" as StringValue),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("15 days" as StringValue),
    });
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      const updatedUser = await userService.changePassword(
        parseInt(id),
        currentPassword,
        newPassword
      );
      res.status(StatusCodes.OK).json({
        message: "Password changed successfully!",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };

  disableUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const disabledUser = await userService.disableUser(parseInt(id));
      res.status(StatusCodes.OK).json({
        message: "User disabled successfully!",
        data: disabledUser,
      });
    } catch (error) {
      next(error);
    }
  };

  enableUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const enabledUser = await userService.enableUser(parseInt(id));
      res.status(StatusCodes.OK).json({
        message: "User enabled successfully!",
        data: enabledUser,
      });
    } catch (error) {
      next(error);
    }
  };
}

const userController = new UserController();
export default userController;
