import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide clinic name."],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please provide clinic email."],
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Please provide clinic phone."],
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Please provide clinic address."],
    },
    logo: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const Clinic = mongoose.models.Clinic || mongoose.model("Clinic", clinicSchema);

export default Clinic;
