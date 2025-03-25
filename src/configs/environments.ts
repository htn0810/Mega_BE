import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT,
  MODE: process.env.MODE,
  HOST_NAME:
    process.env.MODE === "development"
      ? process.env.HOST_NAME_DEV
      : process.env.HOST_NAME_PROD,
  FE_DOMAIN:
    process.env.MODE === "development"
      ? process.env.FE_DOMAIN_DEV
      : process.env.FE_DOMAIN_PROD,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  JWT_ACCESS_SIGNATURE_KEY: process.env.JWT_ACCESS_SIGNATURE_KEY,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME:
    process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_SIGNATURE_KEY: process.env.JWT_REFRESH_SIGNATURE_KEY,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME:
    process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  ADMIN_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS,
  ADMIN_EMAIL_NAME: process.env.ADMIN_EMAIL_NAME,
};
