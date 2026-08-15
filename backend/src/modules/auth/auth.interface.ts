import { User } from "@/generated/prisma/client";
import { RegisterUserType } from "./auth.type";

export interface IAuthRepository{
  createUser(data: RegisterUserType): Promise<User>

  findUserByEmail(email: string): Promise<User | null>;
}