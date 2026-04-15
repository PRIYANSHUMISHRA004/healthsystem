import { InferSchemaType, Model, Schema, model, models } from "mongoose";

export const EQUIPMENT_STATUS = [
  "available",
  "in-use",
  "maintenance"
] as const;

export type EquipmentStatus = (typeof EQUIPMENT_STATUS)[number];

const equipmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    status: {
      type: String,
      enum: EQUIPMENT_STATUS,
      required: true,
      default: "available",
      index: true
    },
    hospitalSection: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    embedding: {
      type: [Number],
      required: true,
      default: []
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
      index: true
    },
    lastUsedBy: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
);

equipmentSchema.index({ hospitalSection: 1, status: 1 });

export type Equipment = InferSchemaType<typeof equipmentSchema>;
type EquipmentModel = Model<Equipment>;

export const EquipmentModel =
  (models.Equipment as EquipmentModel | undefined) ??
  model<Equipment, EquipmentModel>("Equipment", equipmentSchema);
