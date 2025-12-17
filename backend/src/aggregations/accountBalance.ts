import TransactionModel from "../models/TransactionModel.js";
import { Types } from "mongoose";

export const getAccountBalance = async (userId: string) => {
  const result = await TransactionModel.aggregate([
    {
      $match: { user: new Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "accounts",
        localField: "account",
        foreignField: "_id",
        as: "accountInfo",
      },
    },
    {
      $unwind: "$accountInfo",
    },
    {
      $sort: { date: -1 },
    },
    {
      $project: {
        _id: 1,
        date: "$date",
        amount: 1,
        isIncome: 1,
        accountTitle: "$accountInfo.title",
        initialAmount: "$accountInfo.initialAmount",
        accountAmount: "$accountInfo.amount",
      },
    },
    {
      $group: {
        _id: "$accountTitle",
        transactions: { $push: "$$ROOT" },
      },
    },
    {
      $set: {
        transactions: {
          $map: {
            input: "$transactions",
            in: {
              $mergeObjects: [
                "$$this",
                {
                  cumulative: {
                    $reduce: {
                      input: {
                        $slice: [
                          "$transactions",
                          {
                            $indexOfArray: ["$transactions._id", "$$this._id"],
                          },
                        ],
                      },
                      initialValue: 0,
                      in: {
                        $sum: [
                          "$$value",
                          {
                            $cond: {
                              if: {
                                $eq: [
                                  { $isoWeek: "$$this.date" },
                                  { $isoWeek: "$$value.date" },
                                ],
                              },
                              then: {
                                $sum: ["$$this.amount", "$$value.date"],
                              },
                              else: 0,
                            },
                          },
                        ],
                      },
                    },
                  },
                  totalBalance: {
                    $subtract: [
                      "$$this.accountAmount",
                      {
                        $reduce: {
                          input: {
                            $slice: [
                              "$transactions",
                              {
                                $indexOfArray: [
                                  "$transactions._id",
                                  "$$this._id",
                                ],
                              },
                            ],
                          },
                          initialValue: 0,
                          in: {
                            $sum: ["$$value", "$$this.amount"],
                          },
                        },
                      },
                    ],
                  },
                  formattedDate: {
                    $dateToString: {
                      date: "$$this.date",
                      format: "%m %Y",
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
    {
      $unwind: "$transactions",
    },
    {
      $set: {
        month: { $month: "$transactions.date" },
        year: { $year: "$transactions.date" },
        week: {
          $isoWeek: {
            $dateFromString: {
              dateString: {
                $dateToString: {
                  date: "$transactions.date",
                  format: "%Y-%m-%d",
                },
              },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: {
          accountId: "$_id",
          accountTitle: "$transactions.accountTitle",
        },
        accountTitle: { $first: "$transactions.accountTitle" },
        transactions: { $push: "$$ROOT" },
      },
    },
  ]);

  return result;
};
