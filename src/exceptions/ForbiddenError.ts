import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
