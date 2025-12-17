import mongoose from "mongoose";
import { validatePassword } from "../utils/passwordValidation.js";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a username"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email address"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      validate: {
        validator: function (password: string) {
          const validation = validatePassword(password);
          if (!validation.isValid) {
            throw new Error(validation.errors.join(". "));
          }
          return true;
        },
        message: "Password does not meet security requirements",
      },
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", UserSchema);
