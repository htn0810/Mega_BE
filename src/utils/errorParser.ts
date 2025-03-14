import { ZodError } from "zod";

export const errorParser = (error: ZodError) => {
  let errorMessage: string = "";
  error.errors.forEach((error, index) => {
    if (index === 0) {
      errorMessage += error.message;
    } else {
      errorMessage += ` & ${error.message}`;
    }
  });
  return errorMessage;
};
