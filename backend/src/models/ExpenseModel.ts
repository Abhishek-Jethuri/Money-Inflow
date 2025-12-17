import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be above 0"],
      max: [9999999, "Please enter a lesser amount"],
      trim: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Account",
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isIncome: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Expense", ExpenseSchema);
