import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: [true, "Clinic ID id required."],
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Service name is required."],
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Service price is required."],
      min: 0,
    },
    duration: {
      type: Number,
      required: [true, "Please provide service duration."],
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
