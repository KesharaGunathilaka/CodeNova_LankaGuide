import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    userId: String,
    userPhone: String,
    message: String,
    status: { type: String, enum: ["sent", "failed"], default: "sent" },
    error: String,
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", NotificationSchema);
