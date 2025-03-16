import rateLimit from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

export const forgotPasswordLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 3, // Limit each IP to 3 requests per 5 mins
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: StatusCodes.TOO_MANY_REQUESTS,
    message: "You send too many requests. Please try again in 5 minutes.",
  },
  skipSuccessfulRequests: false,
});
