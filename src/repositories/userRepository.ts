import { Role } from "@/types/role/role.type";
import { RegisterLoginUserDTO, User } from "@/types/user/user.type";
import { GET_DB } from "@configs/database";
import { USER_ROLE_ID } from "@utils/constants";
import { formatRole } from "@utils/formatRole";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
class UserRepository {
  async getUsers(page: number, limit: number, status: string) {
    let condition = {};
    if (status.toLowerCase() === "disabled") {
      condition = { isDeleted: true };
    } else if (status.toLowerCase() === "active") {
      condition = { isDeleted: false };
    }
    const validatedPage = Math.max(1, Math.floor(page));
    const validatedLimit = Math.min(50, Math.max(1, Math.floor(limit)));
    const skip = (validatedPage - 1) * validatedLimit;
    try {
      const [users, total] = await Promise.all([
        GET_DB().users.findMany({
          where: condition,
          include: {
            roles: {
              include: {
                role: true,
              },
            },
            shop: true,
          },
          skip,
          take: validatedLimit,
        }),
        GET_DB().users.count({
          where: condition,
        }),
      ]);
      return {
        users: users.map((user) => _.omit(user, ["password", "verifyToken"])),
        pagination: {
          page: validatedPage,
          limit: validatedLimit,
          total,
          totalPages: Math.ceil(total / validatedLimit),
        },
      };
    } catch (error) {
      throw new Error(error as string);
    }
  }
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
          addresses: true,
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
          shop: true,
        },
      });

      if (!user) return null;

      const shop = user?.shop;

      return {
        ...user,
        roles: formatRole(user?.roles || []),
        shop: shop
          ? {
              id: shop.id,
              name: shop.name,
              description: shop?.description ?? undefined,
              status: shop.status,
              avatarUrl: shop?.avatarUrl ?? undefined,
              coverUrl: shop?.coverUrl ?? undefined,
            }
          : undefined,
      };
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getShopByUserEmail(email: string) {
    try {
      const user = await GET_DB().users.findUnique({
        where: { email },
        include: {
          shop: true,
        },
      });
      return user?.shop;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async createUser(userData: RegisterLoginUserDTO) {
    try {
      const registeredUser = await GET_DB().$transaction(async (tx) => {
        const user = await tx.users.create({
          data: {
            name: userData.email,
            email: userData.email,
            password: userData.password,
            verifyToken: uuidv4(),
          },
        });
        await tx.userRoles.create({
          data: {
            userId: user.id,
            roleId: USER_ROLE_ID,
          },
        });
        return user;
      });
      return registeredUser;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updateUser(
    userId: number,
    userData: Partial<Omit<User, "roles" | "shop">>
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

  async updateUserRoles(userId: number, roles: Role[]) {
    try {
      const updatedUser = await GET_DB().$transaction(async (tx) => {
        // Delete all existing roles
        await GET_DB().userRoles.deleteMany({
          where: { userId },
        });

        // Create new roles
        await GET_DB().userRoles.createMany({
          data: roles.map((role) => ({
            userId,
            roleId: role.id,
          })),
        });

        // Get the updated user
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

        if (!user) {
          throw new Error("User not found after update");
        }
        return user;
      });

      return { ...updatedUser, roles: formatRole(updatedUser.roles || []) };
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async disableUser(userId: number) {
    try {
      const disabledUser = await GET_DB().users.update({
        where: { id: userId },
        data: { isDeleted: true },
      });
      return _.omit(disabledUser, ["password", "verifyToken"]);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async enableUser(userId: number) {
    try {
      const enabledUser = await GET_DB().users.update({
        where: { id: userId },
        data: { isDeleted: false },
      });
      return _.omit(enabledUser, ["password", "verifyToken"]);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
