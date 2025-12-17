import { Router } from "express";
import { getDashboardData } from "../controllers/dashboard.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/get-dashboard", protect, getDashboardData);

export default router;
