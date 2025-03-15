import { GET_DB } from "@configs/database";
import { RegisterLoginUserDTO } from "@models/user/dtos/RegisterLoginUser";
import { User } from "@models/user/userModel";
import { v4 as uuidv4 } from "uuid";
class UserRepository {
  async getUserByEmail(email: string) {
    try {
      const user = await GET_DB().users.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async createUser(userData: RegisterLoginUserDTO) {
    try {
      const registeredUser = await GET_DB().users.create({
        data: {
          name: userData.email,
          email: userData.email,
          password: userData.password,
          verifyToken: uuidv4(),
        },
      });
      return registeredUser;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updateUser(userId: number, userData: Partial<User>) {
    try {
      const updatedUser = await GET_DB().users.update({
        where: { id: userId },
        data: userData,
      });
      return updatedUser;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
