import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import CustomError from "../utils/CustomError.js";
import type { NextFunction, Request, Response } from "express";
import { MongooseError } from "mongoose";
import env from "../libs/env.js";
import type { DecodedJwtPayload } from "../types/JwtPayload.js";

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedJwtPayload;

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
          res.status(401);
          throw new CustomError("User not found", 401);
        }

        req.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        };
        if (user.refreshToken) req.user.refreshToken = user.refreshToken;
        next();
      } catch (error) {
        if (
          error instanceof MongooseError &&
          error.message.includes("disconnected")
        ) {
          throw new CustomError(
            "The database is temporarily unreachable. Please try again later.",
            503,
          );
        }

        if (error instanceof jwt.TokenExpiredError) {
          throw new CustomError("Access token expired", 401);
        }

        if (error instanceof jwt.JsonWebTokenError) {
          throw new CustomError("Invalid token", 401);
        }

        throw new CustomError("Not Authorized", 401);
      }
    } else {
      throw new CustomError("Not authorized, no token", 401);
    }
  },
);

export { protect };
