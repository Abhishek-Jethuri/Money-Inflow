import mongoose from "mongoose";

const ExpenseCategorySchema = new mongoose.Schema(
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
      maxLength: [10, "Title must be below 10 characters"],
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isIncome: {
      type: Boolean,
    },
  },
  { timestamps: true, strict: false },
);

export default mongoose.model("ExpenseCategory", ExpenseCategorySchema);
