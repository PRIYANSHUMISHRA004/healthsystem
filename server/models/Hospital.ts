import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const hospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

hospitalSchema.index({ name: 1, location: 1 });

export type Hospital = InferSchemaType<typeof hospitalSchema>;
type HospitalModel = Model<Hospital>;

export const HospitalModel =
  (models.Hospital as HospitalModel | undefined) ??
  model<Hospital, HospitalModel>("Hospital", hospitalSchema);
