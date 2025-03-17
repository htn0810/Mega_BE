import { BadRequestError } from "@exceptions/BadRequestError";
import { ForgotPasswordRequest } from "@models/user/dtos/ForgotPasswordRequest";
import { RegisterLoginUserRequest } from "@models/user/dtos/RegisterLoginUser";
import { UpdateUserRequest } from "@models/user/dtos/UpdateUserRequest";
import { VerifyUserRequest } from "@models/user/dtos/VerifyUser";
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
}

const userValidation = new UserValidation();

export default userValidation;
