import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      jwtUser?: JwtPayload;
    }
  }
}

export {};
