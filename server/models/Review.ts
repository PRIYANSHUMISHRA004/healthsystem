import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const reviewSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ doctor: 1, createdAt: -1 });

export type Review = InferSchemaType<typeof reviewSchema>;
type ReviewModel = Model<Review>;

export const ReviewModel =
  (models.Review as ReviewModel | undefined) ??
  model<Review, ReviewModel>("Review", reviewSchema);
