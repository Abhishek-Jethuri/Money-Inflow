import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
} from "../controllers/account.js";

const router = Router();

router.post("/add-account", protect, addAccount);

router.get("/get-accounts", protect, getAccounts);

router.put("/update-account/:id", protect, updateAccount);

router.delete("/delete-account/:id", protect, deleteAccount);

export default router;
