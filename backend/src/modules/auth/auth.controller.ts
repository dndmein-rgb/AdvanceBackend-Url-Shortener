import { asyncHandler } from "@/common/middleware/async-handler";
import { Request, Response } from "express";
import { authService } from "./auth.container";
import { sendResponse } from "@/common/utils/send-response";

export class AuthController{
  registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name,email,password} = req.body;
    const result = await authService.registerUserService({ name, email, password })
    sendResponse(res, 201, {
      success: true,
      message: "User registered successfully",
      data:result
    })
  })
}

export const authController=new AuthController()