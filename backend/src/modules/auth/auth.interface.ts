import { User } from "@/generated/prisma/client";
import { RegisterUserType } from "./auth.types";

export interface IAuthRepository{
  createUser(data: RegisterUserType): Promise<User>

  findUserByEmail(email: string): Promise<User | null>;

  findUserById(userId:string):Promise<User|null>
}