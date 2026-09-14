import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required."],
      unique: [true, "This is email is already registered."],
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "credentials";
      },
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: [
        "super-admin",
        "clinic-admin",
        "doctor",
        "receptionist",
        "patient",
      ],
      default: "patient",
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
