import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,

  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioFromNumber: process.env.TWILIO_FROM_NUMBER,
};
