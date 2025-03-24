import { WHITE_LIST_DOMAINS } from "@utils/constants";

export const corsConfig = {
  origin: WHITE_LIST_DOMAINS,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
