import asyncHandler from "express-async-handler";
import IncomeSchema from "../models/IncomeModel.js";
import CategorySchema from "../models/CatagoriesModel.js";
import CustomError from "../utils/CustomError.js";

export const addIncome = asyncHandler(async (req, res) => {
  const { title, amount, account, category, description, date, isIncome } =
    req.body;

  const income = new IncomeSchema({
    user: req.user.id,
    title,
    amount,
    account,
    category,
    description,
    date,
    isIncome,
  });

  const _categoryInfo = await CategorySchema.findById(income.category);

  if (!title || !amount || !account || !category || !description || !date) {
    throw new CustomError("Please fill all fields", 400);
  }
  if (amount < 0 || typeof amount !== "string") {
    throw new CustomError("Amount must be a positive number!", 400);
  }

  const _newIncome = await income.save();
  res
    .status(200)
    .json({ data: income, message: "New income added successfully" });
});

export const getIncomes = asyncHandler(async (req, res) => {
  const incomes = await IncomeSchema.find({ user: req.user.id })
    .populate("category account")
    .sort({
      createdAt: -1,
    })
    .exec();
  res
    .status(200)
    .json({ data: incomes, message: "Income loaded successfully" });
});

export const updateIncome = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, amount, account, category, description, date } = req.body;

  if (!title || !amount || !account || !category || !description || !date) {
    throw new CustomError("Please fill all fields", 400);
  }
  if (amount < 0 || typeof amount !== "number") {
    throw new CustomError("Amount must be a positive number!", 400);
  }

  const income = await IncomeSchema.findById(id);

  if (!income) {
    throw new CustomError("Income not found", 400);
  }

  if (!req.user) {
    throw new CustomError("User not found", 401);
  }

  if (income.user.toString() !== req.user.id) {
    throw new CustomError("Unauthorized", 401);
  }
  const updatedIncome = await IncomeSchema.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("category account")
    .sort({
      createdAt: -1,
    })
    .exec();
  res
    .status(200)
    .json({ data: updatedIncome, message: "Income updated successfully" });
});

export const deleteIncome = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const income = await IncomeSchema.findById(id);

  if (!income) {
    throw new CustomError("Income not found", 400);
  }

  if (!req.user) {
    throw new CustomError("User not found", 401);
  }

  if (income.user.toString() !== req.user.id) {
    throw new CustomError("User not authorized", 401);
  }

  IncomeSchema.findByIdAndDelete(id)
    .then((_income) => {
      res.status(200).json({ id: id, message: "Income deleted successfully" });
    })
    .catch((_err) => {
      res.status(500).json({ message: "Server Error" });
    });
});

export const deleteIncomeSelected = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const arr = id?.split("&");
  const data = await IncomeSchema.find({
    _id: {
      $in: arr,
    },
  });

  if (!data) {
    throw new CustomError("Invalid data", 400);
  }

  if (!req.user) {
    throw new CustomError("User not found", 401);
  }

  if (data[0]?.user.toString() !== req.user.id) {
    throw new CustomError("User not authorized", 401);
  }

  IncomeSchema.deleteMany({
    _id: arr,
  })
    .then((_income) => {
      res
        .status(200)
        .json({ ids: arr, message: "Incomes deleted successfully" });
    })
    .catch((_err) => {
      res.status(500).json({ message: "Server Error" });
    });
});
