import { UserRoles } from "@models/userroles/userRolesModel";

export const formatRole = (roles: UserRoles[]) => {
  const formattedRoles = roles.map((role: UserRoles) => {
    return {
      id: role.roleId,
      name: role.role.name,
    };
  });
  return formattedRoles;
};
