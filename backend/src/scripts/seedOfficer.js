// scripts/seedOfficer.js
import mongoose from "mongoose";
import Officer from "../models/officer.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const seedOfficer = async () => {
    
  try {
 
    await mongoose.connect(process.env.MONGODB_URI);

    const hashedPassword = await bcrypt.hash("officer1lankagov", 10);

    const officer = await Officer.create({
      name: "Officer1",
      email: "officer1@gov.lk",
      password: hashedPassword,
    });

    console.log("Officer created:", officer.email);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedOfficer();
