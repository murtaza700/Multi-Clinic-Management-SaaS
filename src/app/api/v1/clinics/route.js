import { NextResponse } from "next/server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";

import Clinic from "@/models/Clinic";

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
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      );
    }

    if (session.user.role !== "super-admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only super admin can create a clinic.",
        },
        { status: 403 },
      );
    }

    await connectDB();

    const body = await request.json();

    const { name, email, phone, address, description } = body;

    if (!name || !email || !phone || !address) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields.",
        },
        { status: 400 },
      );
    }

    const clinicEmail = email.toLowerCase().trim();

    const emailExists = await Clinic.findOne({
      email: clinicEmail,
    });

    if (emailExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Clinic email already exists.",
        },
        { status: 409 },
      );
    }

    let slug = createSlug(name);

    const slugExists = await Clinic.findOne({ slug });

    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const clinic = await Clinic.create({
      name: name.trim(),
      email: clinicEmail,
      phone: phone.trim(),
      address: address.trim(),
      description: description?.trim() || "",
      slug,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Clinic created successfully.",
        data: {
          clinic: {
            id: clinic._id,
            name: clinic.name,
            email: clinic.email,
            phone: clinic.phone,
            address: clinic.address,
            description: clinic.description,
            slug: clinic.slug,
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("CREATE_CLINIC_ERROR:", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      { status: 500 },
    );
  }
}

export async function GET(request) {
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
        { success: false, message: "Only super admin can view clinics." },
        { status: 403 },
      );
    }

    await connectDB();

    const clinics = await Clinic.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      {
        success: true,
        message: "Clinics fetched successfully.",
        count: clinics.length,
        data: clinics,
      },
      { status: 200 },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("GET ALL CLINICS ERROR:", error);
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 },
    );
  }
}
