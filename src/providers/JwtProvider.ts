import { UserInfoJwt } from "@/types/user/user.type";
import { env } from "@configs/environments";
import { InternalServerError } from "@exceptions/InternalServerError";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";

class JwtProvider {
  async generateAccessToken(payload: UserInfoJwt) {
    try {
      if (
        !env.JWT_ACCESS_SIGNATURE_KEY ||
        !env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
      ) {
        throw new InternalServerError("Something went wrong with JWT!");
      }
      const accessToken = jwt.sign(payload, env.JWT_ACCESS_SIGNATURE_KEY, {
        expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME as StringValue,
        algorithm: "HS256",
      });
      return accessToken;
    } catch (_error) {
      throw new Error("Failed to generate access token");
    }
  }
  async generateRefreshToken(payload: UserInfoJwt) {
    try {
      if (
        !env.JWT_REFRESH_SIGNATURE_KEY ||
        !env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
      ) {
        throw new InternalServerError("Something went wrong with JWT!");
      }
      const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SIGNATURE_KEY, {
        expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME as StringValue,
        algorithm: "HS256",
      });
      return refreshToken;
    } catch (_error) {
      throw new Error("Failed to generate refresh token");
    }
  }
  async verifyToken(token: string, secretKey: string) {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to verify token");
    }
  }
}

const jwtProvider = new JwtProvider();
export default jwtProvider;
