import { GET_DB } from "@configs/database";
import { RegisterUserDTO } from "@models/user/dtos/RegisterUser";

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

  async createUser(userData: RegisterUserDTO) {
    try {
      const registeredUser = await GET_DB().users.create({
        data: {
          name: userData.email,
          email: userData.email,
          password: userData.password,
        },
      });
      return registeredUser;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
