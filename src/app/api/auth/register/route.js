import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 401 },
      );
    }

    await connectDB();

    const lowerCaseEmail = email.toLowerCase().trim();
    const isUserAlreadyExists = await User.findOne({ email: lowerCaseEmail });

    if (isUserAlreadyExists) {
      return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 409 },
      );
    }

    const passHashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: lowerCaseEmail,
      password: passHashed,
      role: "patient",
      provider: "credentials",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Patient account registered successfully.",
        data: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("PATIENT REGISTER ERROR:", error);
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 },
    );
  }
}
