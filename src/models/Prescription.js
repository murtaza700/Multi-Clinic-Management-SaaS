import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required."],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor ID is required."],
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: [true, "Clinic ID is required."],
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment ID is required."],
    },
    diagnosis: {
      type: String,
      trim: true,
      required: [true, "Diagnosis field is required."],
    },
    medicines: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
        },
        dosage: {
          type: String,
          trim: true,
        },
        frequency: {
          type: String,
          trim: true,
        },
        duration: {
          type: String,
          trim: true,
        },
      },
    ],
    instructions: {
      type: String,
      trim: true,
    },
    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Prescription =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
