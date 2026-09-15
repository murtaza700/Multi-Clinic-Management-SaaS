import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import connectDB from "@/lib/db";

import Clinic from "@/models/Clinic";
import User from "@/models/User";

export async function POST(request) {
  try {
    // Check logged-in user
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      );
    }

    // Only Super Admin can create Clinic Admin
    if (session.user.role !== "super-admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only super admin can create a clinic admin.",
        },
        { status: 403 },
      );
    }

    await connectDB();

    const body = await request.json();

    const { clinicId, name, email, password } = body;

    // Required fields
    if (!clinicId || !name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Clinic, name, email and password are required.",
        },
        { status: 400 },
      );
    }

    // Check clinic exists
    const clinic = await Clinic.findById(clinicId);

    if (!clinic) {
      return NextResponse.json(
        {
          success: false,
          message: "Clinic not found.",
        },
        { status: 404 },
      );
    }

    // Normalize email
    const lowerCaseEmail = email.toLowerCase().trim();

    // Check email already exists
    const existingUser = await User.findOne({
      email: lowerCaseEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists.",
        },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Clinic Admin
    const admin = await User.create({
      name: name.trim(),
      email: lowerCaseEmail,
      password: hashedPassword,
      role: "clinic-admin",
      clinicId: clinic._id,
      provider: "credentials",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Clinic admin created successfully.",
        data: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          clinicId: admin.clinicId,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE_CLINIC_ADMIN_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      { status: 500 },
    );
  }
}
