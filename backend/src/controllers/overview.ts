import asyncHandler from "express-async-handler";
import TransactionSchema from "../models/TransactionModel.js";
import { TYPES } from "../libs/constants.js";
import mongoose from "mongoose";

export const getOverviewData = asyncHandler(async (req, res) => {
  try {
    const currentDate = new Date();
    const _startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const _endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    const { startDate, endDate, id } = req.query;

    if (typeof id !== "string")
      throw new Error("Category ID is required and must be a string");

    const startDateObject =
      typeof startDate == "string" ? new Date(startDate) : null;
    const endDateObject = typeof endDate == "string" ? new Date(endDate) : null;
    endDateObject?.setHours(23, 59, 59, 999);

    const categoriesExpenseData = await TransactionSchema.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          type: "Expense",
          $expr: {
            $or: [
              {
                $and: [{ $eq: [startDate, null] }, { $eq: [endDate, null] }],
              },
              {
                $and: [
                  { $gte: ["$date", startDateObject] },
                  { $lt: ["$date", endDateObject] },
                ],
              },
            ],
          },
          category: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            category: "$category",
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          category: "$categoryDetails",
          totalAmount: 1,
        },
      },
    ]);
    const categoriesIncomeData = await TransactionSchema.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          type: "Income",
          $expr: {
            $or: [
              {
                $and: [{ $eq: [startDate, null] }, { $eq: [endDate, null] }],
              },

              {
                $and: [
                  { $gte: ["$date", startDateObject] },
                  {
                    $lt: ["$date", endDateObject],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $match: {
          type: TYPES.INCOME,
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          transactions: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
      },
      {
        $project: {
          title: "$categoryData.title",
          color: "$categoryData.color",
          icon: "$categoryData.icon",
          totalAmount: "$totalAmount",
          transactions: "$transactions",
        },
      },
      {
        $sort: {
          totalAmount: -1,
        },
      },
    ]);

    const response = {
      categoriesExpenseData,
      categoriesIncomeData,
    };

    res
      .status(200)
      .json({ data: response, message: "Overview loaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
