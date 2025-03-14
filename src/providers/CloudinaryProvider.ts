import { env } from "@configs/environments";
import { InternalServerError } from "@exceptions/InternalServerError";
import cloudinary from "cloudinary";

class CloudinaryProvider {
  cloudinary;

  constructor() {
    this.cloudinary = cloudinary.v2;
    this.cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(buffer: Buffer, folderName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Upload the buffer directly to Cloudinary
      this.cloudinary.uploader
        .upload_stream(
          {
            folder: folderName, // Specify folder name on Cloudinary
          },
          (error, result) => {
            if (error) {
              reject(
                new InternalServerError("Failed to upload image to Cloudinary")
              );
            } else {
              resolve(result?.secure_url || "");
            }
          }
        )
        .end(buffer); // Directly pass the buffer to the upload_stream
    });
  }

  async deleteImage(imageUrl: string) {
    try {
      const publicId = imageUrl.split("/").pop()?.split(".")[0];
      if (!publicId) {
        throw new InternalServerError("Failed to delete image from Cloudinary");
      }
      await this.cloudinary.uploader.destroy(publicId);
    } catch (_error) {
      throw new InternalServerError("Failed to delete image from Cloudinary");
    }
  }
}

export default new CloudinaryProvider();
