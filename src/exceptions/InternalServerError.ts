import { BaseError } from "@exceptions/BaseError";
import { StatusCodes } from "http-status-codes";

export class InternalServerError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
