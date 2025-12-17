import TransactionSchema from "../models/TransactionModel.js";

export const getRecentTransactions = async (userId: string, limit: number) => {
  return await TransactionSchema.find({
    user: userId,
  })
    .populate("category")
    .sort({ date: -1 })
    .limit(limit);
};
