import jwtProvider from "@providers/JwtProvider";
import bcrypt from "bcryptjs";
import { RegisterUserDTO } from "@models/user/dtos/RegisterUser";
import userRepository from "@repositories/userRepository";
import { BadRequestError } from "@exceptions/BadRequestError";
import _ from "lodash";
import { env } from "@configs/environments";
import brevoProvider from "@providers/BrevoProvider";

class UserService {
  async register(userData: RegisterUserDTO) {
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

      return _.omit(registeredUser, ["password", "id"]);
    } catch (error) {
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;
