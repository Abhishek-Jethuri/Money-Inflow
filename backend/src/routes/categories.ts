import { Router } from "express";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/add-category", protect, addCategory);

router.get("/get-categories", protect, getCategories);

router.put("/update-category/:id", protect, updateCategory);

router.delete("/delete-category/:id", protect, deleteCategory);

export default router;
