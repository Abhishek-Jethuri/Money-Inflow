import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getOverviewData } from "../controllers/overview.js";

const router = Router();

router.get("/get-overview", protect, getOverviewData);

export default router;
