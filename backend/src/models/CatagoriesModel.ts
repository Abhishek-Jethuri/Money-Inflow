import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
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
    icon: {
      type: String,
    },
    color: {
      type: String,
      required: true,
    },
    background: {
      type: String,
    },
    isIncome: {
      type: Boolean,
    },
  },
  { timestamps: true, strict: false },
);

const Category = mongoose.model("Category", CategorySchema);
export default Category;
