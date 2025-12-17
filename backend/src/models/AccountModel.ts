import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: [50, "Title must be below 10 characters"],
    },
    initialAmount: {
      type: Number,
      min: [-9999999, "Please enter a greater amount"],
      max: [9999999, "Please enter a lesser amount"],
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [-9999999, "Please enter a greater amount"],
      max: [9999999, "Please enter a lesser amount"],
      trim: true,
    },
    numberOfTransactions: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
    },
  },
  { timestamps: true, strict: false },
);

export default mongoose.model("Account", AccountSchema);
