import { BadRequestError } from "@exceptions/BadRequestError";
import { RegisterLoginUserRequest } from "@models/user/dtos/RegisterLoginUser";
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
}

const userValidation = new UserValidation();

export default userValidation;
