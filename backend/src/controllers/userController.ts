import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Category from "../models/CatagoriesModel.js";
import Account from "../models/AccountModel.js";
import Profile from "../models/ProfileModel.js";
import {
  CATEGORY_INITIAL_OPTIONS,
  ACCOUNT_INITIAL_OPTIONS,
} from "../libs/constants.js";
import CustomError from "../utils/CustomError.js";
import { validatePassword } from "../utils/passwordValidation.js";
import type { Types } from "mongoose";
import env from "../libs/env.js";
import type { DecodedJwtPayload } from "../types/JwtPayload.js";

const createCategoryOptions = async (userId: Types.ObjectId) => {
  const newCategory = CATEGORY_INITIAL_OPTIONS.map((obj) => ({
    ...obj,
    user: userId,
  }));
  const options = { ordered: true };
  await Category.insertMany(newCategory, options);
};

const createAccountOptions = async (userId: Types.ObjectId) => {
  const newAccount = ACCOUNT_INITIAL_OPTIONS.map((obj) => ({
    ...obj,
    user: userId,
  }));
  const options = { ordered: true };
  await Account.insertMany(newAccount, options);
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill all fields");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error("Please enter a valid email address");
    }

    if (name.trim().length < 2) {
      res.status(400);
      throw new Error("Name must be at least 2 characters long");
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      res.status(400);
      throw new Error(passwordValidation.errors.join(". "));
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const newUser = await user.save();
    const profile = await Profile.create({ user: user._id });

    await profile.save();

    createCategoryOptions(newUser._id);
    createAccountOptions(newUser._id);

    if (newUser) {
      const token = generateToken(newUser._id);
      const refreshToken = generateRefreshToken(newUser._id);

      await storeRefreshToken(newUser._id, refreshToken);

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: "/",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (_error) {
    res.status(500).json({ message: "Server Error" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await storeRefreshToken(user._id, refreshToken);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } else {
    throw new CustomError("Invalid credentials", 400);
  }
});

const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const generateToken = (id: Types.ObjectId) => {
  const token = jwt.sign({ id: id.toString() }, env.JWT_SECRET, {
    expiresIn: "15m",
  });
  return token;
};

const generateRefreshToken = (id: Types.ObjectId) => {
  const refreshToken = jwt.sign({ id: id.toString() }, env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return refreshToken;
};

const storeRefreshToken = async (userId: Types.ObjectId, token: string) => {
  await User.updateOne({ _id: userId }, { refreshToken: token });
};

const refreshToken = asyncHandler(async (req, res) => {
  const refreshTokenValue = req.cookies?.refreshToken;

  if (!refreshTokenValue) {
    res.status(401).json({ message: "No refresh token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(
      refreshTokenValue,
      env.REFRESH_SECRET,
    ) as DecodedJwtPayload;

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshTokenValue) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    await storeRefreshToken(user._id, newRefreshToken);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: "/",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 1000, // 7 days
      path: "/",
    });

    res.json({
      message: "Tokens refreshed successfully",
      token: newAccessToken,
    });
  } catch (err) {
    if (
      err instanceof jwt.TokenExpiredError &&
      err.name === "TokenExpiredError"
    ) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(401).json({ message: "Refresh token expired" });
      return;
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new CustomError("Token expired or invalid", 403);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  await User.updateOne({ _id: userId }, { refreshToken: null });

  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });

  res.status(204).send();
});

export { registerUser, loginUser, getUser, refreshToken, logoutUser };
