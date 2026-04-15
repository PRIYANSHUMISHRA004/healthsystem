import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    specialization: {
      type: String,
      required: true,
      trim: true
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

doctorSchema.index({ hospital: 1, specialization: 1 });

export type Doctor = InferSchemaType<typeof doctorSchema>;
type DoctorModel = Model<Doctor>;

export const DoctorModel =
  (models.Doctor as DoctorModel | undefined) ??
  model<Doctor, DoctorModel>("Doctor", doctorSchema);
