import { UserInfoJwt } from "@/types/user/user.type";
import { env } from "@configs/environments";
import { ResourceGoneError } from "@exceptions/ResourceGoneError";
import { UnauthorizedError } from "@exceptions/UnauthorizedError";
import jwtProvider from "@providers/JwtProvider";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      next(new UnauthorizedError("Unauthorized"));
      return;
    }

    const decoded = (await jwtProvider.verifyToken(
      accessToken,
      env.JWT_ACCESS_SIGNATURE_KEY as string
    )) as JwtPayload;

    req.jwtUser = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };
    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("jwt expired")) {
      next(new ResourceGoneError("Need to refresh token!"));
      return;
    }
    next(new UnauthorizedError("Unauthorized"));
    return;
  }
};

export const authMiddleware = {
  isAuthorized,
};
