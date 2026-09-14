import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide User ID."],
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: [true, "Clinic ID is required."],
    },
    specialization: {
      type: String,
      trim: true,
      required: [true, "Please provide specialization"],
    },
    qualification: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number,
      min: 0,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    // availability: {
    //   type: Date,
    // },
  },
  { timestamps: true },
);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;
