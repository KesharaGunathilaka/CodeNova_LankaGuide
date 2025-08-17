import { Booking } from "../models/Booking.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notifyStatus, notifyCustom } from "../services/notificationService.js";

// Create booking
export const createBooking = asyncHandler(async (req, res) => {
  const { userId, userName, userPhone, dateTime, notes } = req.body;

  if (!userId || !userName || !userPhone || !dateTime) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const booking = await Booking.create({
    userId,
    userName,
    userPhone,
    dateTime,
    notes,
  });

  res.status(201).json({ booking });
});

// Get bookings
export const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json({ bookings });
});

// Update booking status
export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "declined"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const booking = await Booking.findById(id);
  if (!booking) return res.status(404).json({ message: "Not found" });

  booking.status = status;
  await booking.save();

  await notifyStatus({ booking });

  res.json({ booking });
});

// Send custom message
export const sendCustomNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message) return res.status(400).json({ message: "Message required" });

  const booking = await Booking.findById(id);
  if (!booking) return res.status(404).json({ message: "Not found" });

  await notifyCustom({ booking, message });

  res.json({ success: true });
});
