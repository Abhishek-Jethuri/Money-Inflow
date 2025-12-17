import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/get-profile", protect, getProfile);
router.put("/update-profile", protect, updateProfile);

export default router;
