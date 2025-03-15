import { BadRequestError } from "@exceptions/BadRequestError";
import { RegisterUserRequest } from "@models/user/dtos/RegisterUser";
import { VerifyUserRequest } from "@models/user/dtos/VerifyUser";
import { errorParser } from "@utils/errorParser";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

class UserValidation {
  register = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = RegisterUserRequest;
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
