import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient = new PrismaClient();

export const GET_DB = () => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
};

export const CLOSE_DB = async () => {
  await prismaInstance.$disconnect();
};
