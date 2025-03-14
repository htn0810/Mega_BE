import { NotFoundError } from "@exceptions/NotFoundError";
import { BadRequestError } from "@exceptions/BadRequestError";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// error handler middleware
export const exceptionHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof BadRequestError || err instanceof NotFoundError) {
    res.status(err.status).json({
      message: err.message,
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
    });
  }
};
