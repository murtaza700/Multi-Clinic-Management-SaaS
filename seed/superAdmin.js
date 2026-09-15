import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../src/models/User.js";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env");
}

async function seedSuperAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected.");

    const email = "gm0120871@gmail.com";
    const password = "admin@12345";
    const name = "Ghulam Murtaza";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Super Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "super-admin",
      clinicId: null,
      provider: "credentials",
    });

    console.log("Super Admin created successfully.");
    console.log("Email:", superAdmin.email);
    console.log("Password:", password);
  } catch (error) {
    console.error("SEED_ERROR:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

seedSuperAdmin();
