import asyncHandler from "express-async-handler";
import ExpenseCategorySchema from "../models/ExpenseCategoryModel.js";
import CustomError from "../utils/CustomError.js";

export const addExpenseCategory = asyncHandler(async (req, res) => {
  const { title, icon, color, isIncome } = req.body;

  const expenseCategory = new ExpenseCategorySchema({
    user: req.user.id,
    title,
    icon,
    color,
    isIncome,
  });

  if (!title || !icon || !color) {
    throw new CustomError("Please fill all fields", 400);
  }

  const _newExpense = await expenseCategory.save();
  res.status(200).json({ message: "New expense category added successfully" });
});

export const getExpenseCategories = asyncHandler(async (req, res) => {
  const expenses = await ExpenseCategorySchema.find({ user: req.user.id }).sort(
    {
      createdAt: -1,
    },
  );
  res
    .status(200)
    .json({ data: expenses, message: "Expense category loaded successfully" });
});

export const updateExpenseCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, icon, color } = req.body;

  if (!title || !icon || !color) {
    throw new CustomError("Please fill all fields", 400);
  }

  const expenseCategory = await ExpenseCategorySchema.findById(id);

  if (!expenseCategory) {
    throw new CustomError("Expense category not found", 400);
  }

  if (!req.user) {
    throw new CustomError("User not found", 401);
  }

  if (expenseCategory.user.toString() !== req.user.id) {
    throw new CustomError("Unauthorized", 401);
  }
  const updatedExpenseCategory = await ExpenseCategorySchema.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    data: updatedExpenseCategory,
    message: "Expense category updated successfully",
  });
});

export const deleteExpenseCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expenseCategory = await ExpenseCategorySchema.findById(id);

  if (!expenseCategory) {
    throw new CustomError("Expense category not found", 400);
  }

  if (!req.user) {
    throw new CustomError("User not found", 401);
  }

  if (expenseCategory.user.toString() !== req.user.id) {
    throw new CustomError("User not authorized", 401);
  }

  ExpenseCategorySchema.findByIdAndDelete(id)
    .then((_category) => {
      res
        .status(200)
        .json({ id: id, message: "Expense category deleted successfully" });
    })
    .catch((_err) => {
      res.status(500).json({ message: "Server Error" });
    });
});
