import { BaseError } from "@exceptions/BaseError";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
