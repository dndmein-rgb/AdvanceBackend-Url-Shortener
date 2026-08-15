import { User } from "@/generated/prisma/client";
import { IAuthRepository } from "./auth.interface";
import { RegisterUserType } from "./auth.type";
import { prisma } from "@/common/infrastructure/database";

export class AuthRepository implements IAuthRepository {
  async createUser(data: RegisterUserType): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
}
