import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { auth } from "@/auth";
import connectDB from "@/lib/db";

import Clinic from "@/models/Clinic";
import User from "@/models/User";

function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 },
      );
    }

    if (session.user.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Only super admin can create a clinic." },
        { status: 403 },
      );
    }

    await connectDB();

    const body = await request.json();

    const { clinic: clinicData, admin: adminData } = body;

    if (!clinicData || !adminData) {
      return NextResponse.json(
        {
          success: false,
          message: "Clinic and admin information are required.",
        },
        { status: 400 },
      );
    }

    const {
      name: clinicName,
      email: clinicEmail,
      phone,
      address,
      description,
    } = clinicData;

    const { name: adminName, email: adminEmail, password } = adminData;

    if (
      !clinicName ||
      !clinicEmail ||
      !phone ||
      !address ||
      !adminName ||
      !adminEmail ||
      !password
    ) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields." },
        { status: 400 },
      );
    }

    const lowerCaseAdminEmail = adminEmail.toLowerCase().trim();
    const lowerCaseClinicEmail = clinicEmail.toLowerCase().trim();

    const isAdminEmailExists = await User.findOne({
      email: lowerCaseAdminEmail,
    });

    if (isAdminEmailExists) {
      return NextResponse.json(
        { success: false, message: "Admin email already exists." },
        { status: 409 },
      );
    }

    const isClinicEmailExists = await Clinic.findOne({
      email: lowerCaseClinicEmail,
    });

    if (isClinicEmailExists) {
      return NextResponse.json(
        { success: false, message: "Clinic email already exists." },
        { status: 409 },
      );
    }

    let slug = createSlug(clinicName);

    const slugExist = await Clinic.findOne({ slug });
    if (slugExist) {
      slug = `${slug}-${Date.now()}`;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const sessionDb = await mongoose.startSession();

    try {
      sessionDb.startTransaction();

      const clinic = await Clinic.create(
        [
          {
            name: clinicName,
            email: lowerCaseClinicEmail,
            phone,
            address,
            description,
            slug,
          },
        ],
        { session: sessionDb },
      );

      const createdClinic = clinic[0];

      const user = await User.create(
        [
          {
            name: adminName,
            email: lowerCaseAdminEmail,
            password: hashPassword,
            role: "clinic-admin",
            clinicId: createdClinic._id,
            provider: "credentials",
          },
        ],
        { session: sessionDb },
      );

      const createdAdmin = user[0];

      await sessionDb.commitTransaction();

      return NextResponse.json(
        {
          success: true,
          message: "Clinic and clinic admin created successfully.",
          data: {
            clinic: {
              id: createdClinic._id,
              name: createdClinic.name,
              email: createdClinic.email,
              slug: createdClinic.slug,
            },
            admin: {
              id: createdAdmin._id,
              name: createdAdmin.name,
              email: createdAdmin.email,
              role: createdAdmin.role,
            },
          },
        },
        { status: 201 },
      );
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.log(error);

      await sessionDb.abortTransaction();
      throw error;
    } finally {
      sessionDb.endSession();
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("CREATE_CLINIC_ERROR:", error);
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 },
    );
  }
}
