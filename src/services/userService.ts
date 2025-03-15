import jwtProvider from "@providers/JwtProvider";
import bcrypt from "bcryptjs";
import { RegisterUserDTO } from "@models/user/dtos/RegisterUser";
import userRepository from "@repositories/userRepository";
import { BadRequestError } from "@exceptions/BadRequestError";
import _ from "lodash";

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
      return _.omit(registeredUser, ["password", "id"]);
    } catch (error) {
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;
