import { Router } from "express";
import {
  createBooking,
  getBookings,
  updateStatus,
  sendCustomNotification,
} from "../controllers/bookingController.js";

const router = Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.patch("/:id/status", updateStatus);
router.post("/:id/notify", sendCustomNotification);

export default router;
