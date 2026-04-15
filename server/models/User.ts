import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export type User = InferSchemaType<typeof userSchema>;
type UserModel = Model<User>;

export const UserModel =
  (models.User as UserModel | undefined) ??
  model<User, UserModel>("User", userSchema);
