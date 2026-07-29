import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";

const ADMIN_EMAIL = "admin@edumate.com";
const ADMIN_PASSWORD = "Admin@12345";
const ADMIN_NAME = "Super Admin";

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      existing.status = "active";
      if (!existing.emailVerified) existing.emailVerified = true;
      await existing.save();
      console.log(`✅ Promoted existing user to admin: ${ADMIN_EMAIL}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${ADMIN_EMAIL}`);
    }
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      status: "active",
      emailVerified: true,
    });
    console.log(`✅ Created admin user: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
