import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  currency: { type: String, default: "INR" },
  language: { type: String, default: "en" },
  theme: { type: String, enum: ["light", "dark"], default: "light" },
  timezone: { type: String },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: false },
  },
});

export default mongoose.model("Profile", ProfileSchema);
