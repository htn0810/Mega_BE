import { GET_DB } from "@configs/database";
import { RegisterLoginUserDTO } from "@models/user/dtos/RegisterLoginUser";
import { User } from "@models/user/userModel";
import { formatRole } from "@utils/formatRole";
import { v4 as uuidv4 } from "uuid";
class UserRepository {
  async getUserById(userId: number): Promise<User | null> {
    try {
      const user = await GET_DB().users.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
      if (!user) return null;
      return { ...user, roles: formatRole(user?.roles || []) };
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await GET_DB().users.findUnique({
        where: { email },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) return null;

      return { ...user, roles: formatRole(user?.roles || []) };
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

  async updateUser(
    userId: number,
    userData: Partial<Omit<User, "roles">>
  ): Promise<User | null> {
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
