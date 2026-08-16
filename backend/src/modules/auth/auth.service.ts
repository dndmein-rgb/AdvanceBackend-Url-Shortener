import { AppError } from "@/common/errors/app-error";
import { IAuthRepository } from "./auth.interface";
import { LoginUserInputType, RegisterUserInputType } from "./auth.schema";
import {
  comparePassword,
  hashPassword,
  signAccessToken,
  signRefreshToken,
} from "./auth.helper";
import { toUserResponse } from "./auth.response";

export class AuthService {
  constructor(private readonly authRepo: IAuthRepository) {}

  async registerUserService(data: RegisterUserInputType) {
    const existingUser = await this.authRepo.findUserByEmail(data.email);
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }
    const hashedPassword = await hashPassword(data.password);
    const user = await this.authRepo.createUser({
      email: data.email,
      name: data.name,
      passwordHash: hashedPassword,
    });

    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  async loginUserService(data: LoginUserInputType) {
    const user = await this.authRepo.findUserByEmail(data.email);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isPasswordValid = await comparePassword(
      data.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }
    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }
  async getCurrentUser(userId: string) {
    const user = await this.authRepo.findUserById(userId)
    if (!user) {
      throw new AppError("User not found",404)
    }
    return toUserResponse(user)
  }
}
