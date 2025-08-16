import { sendSMS } from "./smsService.js";
import { Notification } from "../models/Notification.js";

const CHECKLIST = [
  "Bring your ID card",
  "Booking confirmation slip",
  "Arrive 10 minutes early",
].join("\n- ");

export async function notifyStatus({ booking }) {
  const msg =
    booking.status === "accepted"
      ? `Hi ${booking.userName}, your booking on ${booking.dateTime.toLocaleString()} has been ACCEPTED.`
      : `Hi ${booking.userName}, your booking on ${booking.dateTime.toLocaleString()} has been DECLINED.`;

  try {
    await sendSMS({ to: booking.userPhone, body: msg });
    await Notification.create({ bookingId: booking._id, userId: booking.userId, userPhone: booking.userPhone, message: msg });
  } catch (err) {
    await Notification.create({ bookingId: booking._id, userId: booking.userId, userPhone: booking.userPhone, message: msg, status: "failed", error: err.message });
  }
}

export async function notifyReminder({ booking }) {
  const msg = `Hi ${booking.userName}, reminder: your booking on ${booking.dateTime.toLocaleString()} is in 24 hours.\n\nWhat to bring:\n- ${CHECKLIST}`;
  try {
    await sendSMS({ to: booking.userPhone, body: msg });
    await Notification.create({ bookingId: booking._id, userId: booking.userId, userPhone: booking.userPhone, message: msg });
  } catch (err) {
    await Notification.create({ bookingId: booking._id, userId: booking.userId, userPhone: booking.userPhone, message: msg, status: "failed", error: err.message });
  }
}

export async function notifyCustom({ booking, message }) {
  const msg = `Hi ${booking.userName},\n\n${message}`;
  try {
    await sendSMS({ to: booking.userPhone, body: msg });
    await Notification.create({ bookingId: booking._id, userId: booking.userId, userPhone: booking.userPhone, message: msg });
  } catch (err) {
    await Notification.create({ bookingId: booking._id, userId: booking.userId, userPhone: booking.userPhone, message: msg, status: "failed", error: err.message });
  }
}
