import Profile from "../models/ProfileModel.js";
import CustomError from "../utils/CustomError.js";
import asyncHandler from "express-async-handler";

const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    throw new CustomError("Profile not found", 404);
  }

  res.status(200).json(profile);
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!profile) {
    throw new CustomError("Profile not found", 404);
  }

  await profile.save();

  res.status(200).json(profile);
});

export { getProfile, updateProfile };
