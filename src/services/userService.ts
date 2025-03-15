import jwtProvider from "@providers/JwtProvider";
import bcrypt from "bcryptjs";
import userRepository from "@repositories/userRepository";
import { BadRequestError } from "@exceptions/BadRequestError";
import _ from "lodash";
import { env } from "@configs/environments";
import brevoProvider from "@providers/BrevoProvider";
import { VerifyUserDTO } from "@models/user/dtos/VerifyUser";
import { RegisterLoginUserDTO } from "@models/user/dtos/RegisterLoginUser";
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
}

const userService = new UserService();
export default userService;
