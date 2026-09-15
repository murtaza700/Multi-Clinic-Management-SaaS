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
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    openingHours: {
      type: [
        {
          day: {
            type: String,
            enum: [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ],
          },
          isOpen: {
            type: Boolean,
            default: true,
          },
          open: {
            type: String,
            trim: true,
          },
          close: {
            type: String,
            trim: true,
          },
        },
      ],
      default: [],
    },
    logo: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Clinic = mongoose.models.Clinic || mongoose.model("Clinic", clinicSchema);

export default Clinic;
