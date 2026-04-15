import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const chatRoomSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        required: true
      }
    ],
    type: {
      type: String,
      enum: ["user-hospital", "hospital-hospital"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

export type ChatRoom = InferSchemaType<typeof chatRoomSchema>;
type ChatRoomModel = Model<ChatRoom>;

export const ChatRoomModel =
  (models.ChatRoom as ChatRoomModel | undefined) ??
  model<ChatRoom, ChatRoomModel>("ChatRoom", chatRoomSchema);
