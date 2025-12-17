import { Types } from "mongoose";
import AccountSchema from "../models/AccountModel.js";

export const getTotalBalance = async (userId: string) => {
  const result = await AccountSchema.aggregate([
    {
      $match: { user: new Types.ObjectId(userId) },
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
