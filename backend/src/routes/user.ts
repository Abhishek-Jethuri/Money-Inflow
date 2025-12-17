import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  refreshToken,
  logoutUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.get("/get-user", protect, getUser);
router.post("/refresh-token", refreshToken);
router.post("/logout-user", logoutUser);

export default router;
