import express from "express";
import { loginOfficer, logoutOfficer } from "../controllers/officerAuth.controller.js";
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Officer login
router.post("/login", loginOfficer);

// Officer logout (protected, requires valid access token)
router.post("/logout", requireAuth, logoutOfficer);

export default router;
