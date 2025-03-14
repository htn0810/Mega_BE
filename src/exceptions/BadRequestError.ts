import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
