import { BadRequestError } from "@exceptions/BadRequestError";
import { IMAGE_MAX_SIZE, IMAGE_MIME_TYPES } from "@utils/constants";
import { Request } from "express";
import multer from "multer";

const customFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
    const errorMessage = `Unsupported file type: ${file.mimetype}`;
    return cb(new BadRequestError(errorMessage));
  }
  return cb(null, true);
};

const upload = multer({
  limits: { fileSize: IMAGE_MAX_SIZE },
  fileFilter: customFileFilter,
});

export const multerUploadMiddleware = {
  upload,
};
