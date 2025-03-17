import { BaseError } from "@exceptions/BaseError";
import { StatusCodes } from "http-status-codes";

export class ResourceGoneError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.GONE);
    Object.setPrototypeOf(this, ResourceGoneError.prototype);
  }
}
