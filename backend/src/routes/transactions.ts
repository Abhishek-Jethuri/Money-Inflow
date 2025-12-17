import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addTransaction,
  updateTransaction,
  getTransactions,
  deleteTransactionsSelected,
  deleteSingleTransaction,
  deleteMultipleTransactions,
} from "../controllers/transactions.js";
import {
  addIncome,
  getIncomes,
  deleteIncome,
  updateIncome,
  deleteIncomeSelected,
} from "../controllers/income.js";

const router = Router();

router.post("/add-income", protect, addIncome);

router.get("/get-incomes", protect, getIncomes);

router.put("/update-income/:id", protect, updateIncome);

router.delete("/delete-income/:id", protect, deleteIncome);

router.delete("/delete-incomes/:id", protect, deleteIncomeSelected);

router.post("/add-expense", protect, addTransaction);

router.get("/get-expenses", protect, getTransactions);

router.put("/update-expense/:id", protect, updateTransaction);

router.delete("/delete-expense/:id", protect, deleteSingleTransaction);

router.delete("/delete-expenses/:id", protect, deleteMultipleTransactions);

router.post("/add-transaction", protect, addTransaction);

router.get("/get-transactions", protect, getTransactions);

router.put("/update-transaction/:id", protect, updateTransaction);

router.delete("/delete-transaction/:id", protect, deleteSingleTransaction);

router.post(
  "/delete-multiple-transactions",
  protect,
  deleteMultipleTransactions,
);

router.delete("/delete-transactions/:id", protect, deleteTransactionsSelected);

export default router;
