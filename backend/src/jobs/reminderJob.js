import cron from "node-cron";
import { Booking } from "../models/Booking.js";
import { notifyReminder } from "../services/notificationService.js";
import { log } from "../utils/logger.js";

export function startReminderJob() {
  cron.schedule("0 * * * *", async () => {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const bookings = await Booking.find({
      status: "accepted",
      reminderSent24h: false,
      dateTime: { $gte: in24h, $lt: in25h },
    });

    if (bookings.length) log(`⏰ Sending ${bookings.length} reminders`);

    for (const booking of bookings) {
      await notifyReminder({ booking });
      booking.reminderSent24h = true;
      await booking.save();
    }
  });

  log("🕒 Reminder job scheduled (hourly)");
}
