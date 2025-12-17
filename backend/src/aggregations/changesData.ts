import TransactionSchema from "../models/TransactionModel.js";
import { Types } from "mongoose";
import { TYPES, MONTH_NAMES } from "../libs/constants.js";

export const getChangesData = async (
  userId: string,
  startDate: Date,
  endDate: Date,
) => {
  const endDateObject = endDate instanceof Date ? endDate : new Date(endDate);
  endDateObject.setHours(23, 59, 59, 999);
  const result = await TransactionSchema.aggregate([
    {
      $match: {
        user: new Types.ObjectId(userId),
        date: { $exists: true },
        $expr: {
          $or: [
            {
              $and: [{ $eq: [startDate, null] }, { $eq: [endDate, null] }],
            },
            {
              $and: [
                { $gte: ["$date", new Date(startDate)] },
                { $lte: ["$date", endDateObject] },
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          year: { $year: "$date" },
        },
        expenses: {
          $sum: {
            $cond: [{ $eq: ["$type", TYPES.EXPENSE] }, "$amount", 0],
          },
        },
        incomes: {
          $sum: {
            $cond: [{ $eq: ["$type", TYPES.INCOME] }, "$amount", 0],
          },
        },
      },
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
        month: {
          $concat: [
            {
              $switch: {
                branches: MONTH_NAMES,
                default: "Invalid Month",
              },
            },
          ],
        },
        year: {
          $toString: "$_id.year",
        },
        expenses: 1,
        incomes: 1,
      },
    },
  ]);

  return result;
};
