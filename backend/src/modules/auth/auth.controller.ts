import { asyncHandler } from "@/common/middleware/async-handler";
import { Request, Response } from "express";
import { authService } from "./auth.container";
import { sendResponse } from "@/common/utils/send-response";
import { setAuthCookie } from "./auth.helper";

export class AuthController {
  registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const result = await authService.registerUserService({
      name,
      email,
      password,
    });
    setAuthCookie(res, result.refreshToken);
    sendResponse(res, 201, {
      success: true,
      message: "User registered successfully",
      data: result,
    });
  });

  loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.loginUserService({ email, password });
    setAuthCookie(res, result.refreshToken);
    sendResponse(res, 201, {
      success: true,
      message: "User loggedIn successfully",
      data: result,
    });
  });

  getLoggedInUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    const result = await authService.getCurrentUser(userId);

    sendResponse(res, 200, {
      success: true,
      message: "User details fetched successfully",
      data: result,
    });
  });
}

export const authController = new AuthController();
