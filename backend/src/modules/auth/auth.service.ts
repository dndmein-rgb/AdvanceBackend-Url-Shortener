import { AppError } from "@/common/errors/app-error";
import { IAuthRepository } from "./auth.interface";
import { RegisterUserInputType } from "./auth.schema";
import { hashPassword, signAccessToken, signRefreshToken } from "./auth.helper";
import { toUserResponse } from "./auth.response";

export class AuthService {
  constructor(private readonly authRepo: IAuthRepository) { }

  async registerUserService(data:RegisterUserInputType) {
    const existingUser = await this.authRepo.findUserByEmail(data.email)
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }
    const hashedPassword = await hashPassword(data.password)
    const user = await this.authRepo.createUser({
      email: data.email,
      name: data.name,
      passwordHash:hashedPassword
    })
    

    const accessToken = signAccessToken({ userId: user.id })
    const refreshToken = signRefreshToken({ userId: user.id })

    return {
         user: toUserResponse(user),
         accessToken,
         refreshToken,
       };
  }
}
