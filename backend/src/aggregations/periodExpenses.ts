import TransactionSchema from "../models/TransactionModel.js";
import { Types } from "mongoose";
import { TYPES } from "../libs/constants.js";

export const getPeriodExpenses = async (
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
        type: TYPES.EXPENSE,
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
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return result.length > 0 ? result[0].total : 0;
};
