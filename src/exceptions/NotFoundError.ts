import { StatusCodes } from "http-status-codes";
import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
