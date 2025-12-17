import asyncHandler from "express-async-handler";
import { getAccountBalance } from "../aggregations/accountBalance.js";
import { getTotalSpendThisMonth } from "../aggregations/totalSpendThisMonth.js";
import { getTotalBalance } from "../aggregations/totalBalance.js";
import { getPeriodEarnings } from "../aggregations/periodEarnings.js";
import { getRecentTransactions } from "../aggregations/recentTransactions.js";
import { getChangesData } from "../aggregations/changesData.js";
import { getAccountDetails } from "../aggregations/accountDetails.js";
import { getCategoriesData } from "../aggregations/categoriesData.js";
import { getPeriodExpenses } from "../aggregations/periodExpenses.js";
import {
  getTotalTransactionsCount,
  getCategoryWithMostSpent,
  getSavingsRate,
  getFinancialPersona,
} from "../aggregations/profileInfo.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const startDateObject =
      typeof startDate == "string" ? new Date(startDate) : null;
    const endDateObject = typeof endDate == "string" ? new Date(endDate) : null;

    if (!startDateObject || !endDateObject)
      throw new Error("Start date and end date are required");

    const _totalSpendThisMonth = await getTotalSpendThisMonth(userId);
    const totalBalance = await getTotalBalance(userId);
    const periodEarnings = await getPeriodEarnings(
      userId,
      startDateObject,
      endDateObject,
    );
    const periodExpenses = await getPeriodExpenses(
      userId,
      startDateObject,
      endDateObject,
    );
    const recentTransactions = await getRecentTransactions(userId, Infinity);
    const changesData = await getChangesData(
      userId,
      startDateObject,
      endDateObject,
    );
    const accountDetails = await getAccountDetails(userId);
    const accountBalance = await getAccountBalance(userId);
    const categoriesData = await getCategoriesData(
      userId,
      startDateObject,
      endDateObject,
    );
    const totalTransactionsCount = await getTotalTransactionsCount(userId);
    const categoryWithMostSpent = await getCategoryWithMostSpent(userId);
    const savingsRate = await getSavingsRate(userId);
    const userPersona = getFinancialPersona(parseFloat(savingsRate));

    const response = {
      periodChange: periodEarnings - periodExpenses,
      totalBalance,
      periodEarnings,
      periodExpenses,
      recentTransactions,
      changesData,
      accountDetails,
      accountBalance,
      categoriesData,
      totalTransactionsCount,
      categoryWithMostSpent,
      savingsRate,
      userPersona,
      startDate: startDateObject
        ? new Date(startDateObject)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: endDateObject
        ? new Date(endDateObject)
        : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    };

    res
      .status(200)
      .json({ data: response, message: "Dashboard loaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
