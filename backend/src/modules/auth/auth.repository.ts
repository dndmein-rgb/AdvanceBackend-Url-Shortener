import { User } from "@/generated/prisma/client";
import { IAuthRepository } from "./auth.interface";
import { RegisterUserType } from "./auth.type";
import { prisma } from "@/infrastructure/database";

export class AuthRepository implements IAuthRepository {
  async createUser(data: RegisterUserType): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }
  async findUserById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
