import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const appointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled"
    }
  },
  {
    timestamps: true
  }
);

appointmentSchema.index({ patientId: 1, hospitalId: 1 });

export type Appointment = InferSchemaType<typeof appointmentSchema>;
type AppointmentModel = Model<Appointment>;

export const AppointmentModel =
  (models.Appointment as AppointmentModel | undefined) ??
  model<Appointment, AppointmentModel>("Appointment", appointmentSchema);
