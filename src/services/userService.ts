import jwtProvider from "@providers/JwtProvider";
import bcrypt from "bcryptjs";
import userRepository from "@repositories/userRepository";
import { BadRequestError } from "@exceptions/BadRequestError";
import _ from "lodash";
import { env } from "@configs/environments";
import brevoProvider from "@providers/BrevoProvider";
import { VerifyUserDTO } from "@models/user/dtos/VerifyUser";
import { RegisterLoginUserDTO } from "@models/user/dtos/RegisterLoginUser";
import { generateSecurePassword } from "@utils/resetPasswordGenerator";
import { JwtPayload } from "jsonwebtoken";
import {
  UpdateUserDTO,
  UpdateUserRequest,
} from "@models/user/dtos/UpdateUserRequest";
import cloudinaryProvider from "@providers/CloudinaryProvider";
import { CLOUDINARY_FOLDER_NAME } from "@utils/constants";
class UserService {
  async register(userData: RegisterLoginUserDTO) {
    try {
      const existingUser = await userRepository.getUserByEmail(userData.email);
      if (existingUser) {
        throw new BadRequestError("User already exists");
      }

      const registerData = {
        ...userData,
        password: bcrypt.hashSync(userData.password, 10),
      };

      const registeredUser = await userRepository.createUser(registerData);

      const verifyUrl = `${env.FE_DOMAIN}/account/verify?email=${registeredUser.email}&token=${registeredUser.verifyToken}`;

      const subject = "MEGA_SHOP - Verify your email";
      const htmlContent = `
      <h3>Here is your verification link:</h3>
      <h3>${verifyUrl}</h3>
      <h3>Sincerely, <br /> - Admin MEGA_SHOP (HTN) - </h3>
      `;

      await brevoProvider.sendEmail(
        [registeredUser.email],
        subject,
        htmlContent
      );

      return _.omit(registeredUser, ["password", "id", "verifyToken"]);
    } catch (error) {
      throw error;
    }
  }

  async verifyAccount(userData: VerifyUserDTO) {
    try {
      const { email, token } = userData;
      const existingUser = await userRepository.getUserByEmail(email);
      if (!existingUser) {
        throw new BadRequestError(`User with email ${email} not found`);
      }

      if (existingUser.isVerified || existingUser.verifyToken === null) {
        throw new BadRequestError("Account already verified");
      }

      if (existingUser.verifyToken !== token) {
        throw new BadRequestError("Invalid token");
      }

      const updatedUser = await userRepository.updateUser(existingUser.id, {
        isVerified: true,
        verifyToken: null,
      });

      return _.omit(updatedUser, ["password", "id", "verifyToken"]);
    } catch (error) {
      throw error;
    }
  }

  async login(userData: RegisterLoginUserDTO) {
    try {
      const { email, password } = userData;

      const existingUser = await userRepository.getUserByEmail(email);
      if (!existingUser) {
        throw new BadRequestError("Email or password is incorrect!");
      }

      if (!existingUser.isVerified) {
        throw new BadRequestError("Please verify your account first!");
      }

      const isPasswordValid = bcrypt.compareSync(
        password,
        existingUser.password
      );
      if (!isPasswordValid) {
        throw new BadRequestError("Email or password is incorrect!");
      }

      const accessToken = await jwtProvider.generateAccessToken({
        email,
        name: existingUser.name,
      });
      const refreshToken = await jwtProvider.generateRefreshToken({
        email,
        name: existingUser.name,
      });

      return {
        loggedInUser: _.omit(existingUser, ["password", "id", "verifyToken"]),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decodedToken = (await jwtProvider.verifyToken(
        refreshToken,
        env.JWT_REFRESH_SIGNATURE_KEY as string
      )) as JwtPayload;

      const existingUser = await userRepository.getUserByEmail(
        decodedToken.email
      );
      if (!existingUser) {
        throw new BadRequestError("Refresh token is invalid!");
      }

      const accessToken = await jwtProvider.generateAccessToken({
        email: existingUser.email,
        name: existingUser.name,
      });

      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const existingUser = await userRepository.getUserByEmail(email);
      if (!existingUser) {
        throw new BadRequestError("User not found");
      }

      if (existingUser.isDeleted) {
        throw new BadRequestError("User is deleted! Please contact admin.");
      }

      const newPassword = generateSecurePassword();

      await userRepository.updateUser(existingUser.id, {
        password: bcrypt.hashSync(newPassword, 10),
      });

      const subject = "MEGA_SHOP - Reset your password";
      const htmlContent = `
      <h3>Here is your new password:</h3>
      <h3>${newPassword}</h3>
      <h5>Please change your password after logging in.</h5>
      <h3>Sincerely, <br /> - Admin MEGA_SHOP (HTN) - </h3>
      `;

      await brevoProvider.sendEmail([existingUser.email], subject, htmlContent);

      return;
    } catch (error) {
      throw error;
    }
  }

  async update(userId: number, userData: UpdateUserRequest) {
    try {
      const existingUser = await userRepository.getUserById(userId);
      if (!existingUser) {
        throw new BadRequestError("User not found");
      }

      const updateUserData: UpdateUserDTO = {};
      if (userData.name) {
        updateUserData.name = userData.name;
      }

      if (userData.currentPassword && userData.newPassword) {
        const isPasswordValid = bcrypt.compareSync(
          userData.currentPassword,
          existingUser.password
        );
        if (!isPasswordValid) {
          throw new BadRequestError("Current password is incorrect!");
        }

        updateUserData.password = bcrypt.hashSync(userData.newPassword, 10);
      }

      if (userData.avatar) {
        if (existingUser.avatarUrl) {
          await cloudinaryProvider.deleteImage(
            existingUser.avatarUrl,
            CLOUDINARY_FOLDER_NAME.USER
          );
        }
        const imgUrl = await cloudinaryProvider.uploadImage(
          userData.avatar.buffer,
          CLOUDINARY_FOLDER_NAME.USER
        );
        updateUserData.avatarUrl = imgUrl;
      }

      const updatedUser = await userRepository.updateUser(
        userId,
        updateUserData
      );

      return _.omit(updatedUser, ["password", "id", "verifyToken"]);
    } catch (error) {
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;
