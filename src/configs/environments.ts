import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT,
  HOST_NAME: process.env.HOST_NAME,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
