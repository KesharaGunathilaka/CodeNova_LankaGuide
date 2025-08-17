import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    dateTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    reminderSent24h: { type: Boolean, default: false },
    notes: String,
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", BookingSchema);
