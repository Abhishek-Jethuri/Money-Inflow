import asyncHandler from "express-async-handler";
import TransactionSchema from "../models/TransactionModel.js";
import CategorySchema from "../models/CatagoriesModel.js";
import AccountSchema from "../models/AccountModel.js";
import CustomError from "../utils/CustomError.js";
import { Types, type FilterQuery } from "mongoose";
import type { Request, Response } from "express";

const handleSingleDeletion = async (id: Types.ObjectId, req: Request) => {
  const transaction = await TransactionSchema.findById(id);
  if (!transaction) {
    throw new CustomError("Transaction not found", 404);
  }

  if (!req.user) {
    throw new CustomError("User not found", 401);
  }

  if (transaction.user.toString() !== req.user.id) {
    throw new CustomError("User not authorized", 401);
  }

  await updateAccountAmount(id);

  const deletedTransaction = await TransactionSchema.findByIdAndDelete(id);
  if (!deletedTransaction) {
    throw new CustomError("Transaction not found", 404);
  }
};

const handleMultipleDeletions = async (ids: Types.ObjectId[]) => {
  try {
    const deletedTransactions = await TransactionSchema.find({
      _id: { $in: ids },
    });
    const deletedTransactionIds = deletedTransactions.map(
      (transaction) => transaction._id,
    );

    if (deletedTransactionIds.length > 0) {
      for (const transactionId of deletedTransactionIds) {
        await updateAccountAmount(transactionId);
      }

      await TransactionSchema.deleteMany({
        _id: { $in: deletedTransactionIds },
      });
    }
  } catch (_error) {
    throw new CustomError("Error deleting transactions", 500);
  }
};

const updateAccountAmount = async (deletedTransaction: Types.ObjectId) => {
  const transaction = await TransactionSchema.findById(deletedTransaction);
  if (!transaction) return;

  const accountId = transaction.account;
  const accountInfo = await AccountSchema.findById(accountId);

  if (!accountInfo) {
    throw new CustomError("Account not found", 404);
  }

  const transactionAmount = transaction.amount;
  const accountAmount = accountInfo.amount;

  const updatedAmount = accountAmount - transactionAmount;

  await AccountSchema.findByIdAndUpdate(accountId, {
    $set: { amount: updatedAmount },
  });
};

export const addTransaction = asyncHandler(async (req, res) => {
  const {
    title,
    amount,
    account,
    category,
    description,
    date,
    isIncome,
    type,
  } = req.body;

  const transaction = new TransactionSchema({
    user: req.user.id,
    title,
    amount,
    account,
    category,
    description,
    date,
    isIncome,
    type,
  });

  if (!title || !amount || !account || !category || !description || !date) {
    throw new CustomError("Please fill all fields", 400);
  }
  if (typeof amount !== "string") {
    throw new CustomError("Amount must be a number!", 400);
  }

  const _categoryInfo = await CategorySchema.findById(transaction.category);

  const accountInfo = await AccountSchema.findById(transaction.account);

  if (!accountInfo) return;

  accountInfo.amount = parseFloat(amount) + accountInfo.amount;
  const _periodBalance = accountInfo.amount;

  accountInfo.numberOfTransactions = accountInfo.numberOfTransactions + 1;
  await accountInfo.save();

  const _newTransaction = await transaction.save();
  res
    .status(200)
    .json({ data: transaction, message: "New transaction added successfully" });
});

export const getTransactions = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const start = typeof startDate === "string" ? new Date(startDate) : null;
  const end = typeof endDate === "string" ? new Date(endDate) : null;
  if (end) {
    end.setHours(23, 59, 59, 999);
  }

  const query: FilterQuery<typeof TransactionSchema> = { user: req.user.id };

  if (start || end) {
    query.date = {};
    if (start) query.date.$gte = start;
    if (end) query.date.$lte = end;
  }

  const transactions = await TransactionSchema.find(query)
    .populate("category account")
    .sort({
      createdAt: -1,
    })
    .exec();
  res.status(200).json({
    data: transactions,
    message: "Transactions loaded successfully",
  });
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, amount, account, category, description, date } = req.body;

  if (!title || !amount || !account || !category || !description || !date) {
    throw new CustomError("Please fill all fields", 400);
  }
  if (typeof amount !== "string") {
    throw new CustomError("Amount must be a number!", 400);
  }

  const transaction = await TransactionSchema.findById(id);

  if (!transaction) {
    throw new CustomError("Transaction not found", 401);
  }

  if (!req.user) {
    throw new CustomError("User not found", 400);
  }

  if (transaction.user.toString() !== req.user.id) {
    throw new CustomError("Unauthorized", 401);
  }

  const newAccountId = account;
  const oldAccountId = transaction.account;
  const newAccountInfo = await AccountSchema.findById(newAccountId);
  const oldAccountInfo = await AccountSchema.findById(oldAccountId);

  if (!newAccountInfo || !oldAccountInfo) {
    throw new CustomError("Account not found", 404);
  }

  try {
    if (oldAccountId.toString() !== newAccountId.toString()) {
      const oldAccountUpdatedAmount =
        oldAccountInfo.amount - transaction.amount;
      await AccountSchema.findByIdAndUpdate(oldAccountId, {
        $set: { amount: oldAccountUpdatedAmount },
      });

      const newAccountUpdatedAmount =
        newAccountInfo.amount + parseFloat(amount);
      await AccountSchema.findByIdAndUpdate(newAccountId, {
        $set: { amount: newAccountUpdatedAmount },
      });
    } else {
      const updatedAmount =
        newAccountInfo.amount + (parseFloat(amount) - transaction.amount);
      await AccountSchema.findByIdAndUpdate(newAccountId, {
        $set: { amount: updatedAmount },
      });
    }

    const updatedTransaction = await TransactionSchema.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("category account")
      .sort({
        createdAt: -1,
      })
      .exec();

    if (updatedTransaction) {
      res.status(200).json({
        data: updatedTransaction,
        message: "Transaction updated successfully",
      });
    } else {
      res.status(404).json({
        message: "Transaction not found",
      });
    }
  } catch (_error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

export const deleteSingleTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await handleSingleDeletion(new Types.ObjectId(id), req);

    res
      .status(200)
      .json({ id: id, message: "Transaction deleted successfully" });
  } catch (error) {
    if (error instanceof CustomError && error.statusCode && error.message) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server Error" });
    }
  }
});

export const deleteMultipleTransactions = async (
  req: Request,
  res: Response,
) => {
  const { ids } = req.body;

  if (!req.user) {
    throw new CustomError("User not found", 401);
  }

  const checkAuthorization = async (
    userId: Types.ObjectId,
    transactionIds: Types.ObjectId[],
  ) => {
    try {
      const unauthorizedTransactions = await TransactionSchema.find({
        _id: { $in: transactionIds },
        user: { $ne: userId },
      });

      const unauthorizedIds = unauthorizedTransactions.map((transaction) =>
        transaction._id.toString(),
      );

      return unauthorizedIds;
    } catch (_error) {
      throw new CustomError("Error checking authorization", 500);
    }
  };

  const unauthorizedIds = await checkAuthorization(
    new Types.ObjectId(req.user.id),
    ids,
  );

  if (unauthorizedIds.length > 0) {
    return res.status(403).json({
      message:
        "Forbidden: User does not have permission to delete certain transactions",
      unauthorizedIds: unauthorizedIds,
    });
  }

  try {
    await handleMultipleDeletions(ids);

    res
      .status(200)
      .json({ ids: ids, message: "Transactions deleted successfully" });
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ message: "Server Error" });
  }
};

export const deleteTransactionsSelected = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const arr = id?.split("&");
  const data = await TransactionSchema.find({
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

  TransactionSchema.deleteMany({
    _id: arr,
  })
    .then((_transaction) => {
      res
        .status(200)
        .json({ ids: arr, message: "Transactions deleted successfully" });
    })
    .catch((_err) => {
      res.status(500).json({ message: "Server Error" });
    });
});
