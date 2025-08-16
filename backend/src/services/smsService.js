import twilio from "twilio";
import { config } from "../config/env.js";
import { log, error } from "../utils/logger.js";

let client;

function getTwilioClient() {
  if (client) return client;
  client = twilio(config.twilioAccountSid, config.twilioAuthToken);
  return client;
}

export async function sendSMS({ to, body }) {
  try {
    const tw = getTwilioClient();
    const msg = await tw.messages.create({
      body,
      from: config.twilioFromNumber,
      to,
    });
    log("📱 SMS sent:", msg.sid);
    return msg;
  } catch (err) {
    error("SMS failed:", err.message);
    throw err;
  }
}
