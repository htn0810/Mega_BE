import { BadRequestError } from "@exceptions/BadRequestError";
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  RegisterLoginUserRequest,
  UpdateUserRequest,
  VerifyUserRequest,
} from "@/types/user/user.type";
import { errorParser } from "@utils/errorParser";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

class UserValidation {
  registerOrLogin = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = RegisterLoginUserRequest;
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessage = errorParser(error);
        throw new BadRequestError(errorMessage);
      }
      next(error);
    }
  };

  verifyAccount = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = VerifyUserRequest;
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessage = errorParser(error);
        throw new BadRequestError(errorMessage);
      }
      next(error);
    }
  };

  forgotPassword = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = ForgotPasswordRequest;
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessage = errorParser(error);
        throw new BadRequestError(errorMessage);
      }
      next(error);
    }
  };

  update = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file) {
        req.body.avatar = req.file;
      }
      const schema = UpdateUserRequest;
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessage = errorParser(error);
        throw new BadRequestError(errorMessage);
      }
      next(error);
    }
  };

  changePassword = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = ChangePasswordRequest;
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessage = errorParser(error);
        throw new BadRequestError(errorMessage);
      }
      next(error);
    }
  };
}

const userValidation = new UserValidation();

export default userValidation;
