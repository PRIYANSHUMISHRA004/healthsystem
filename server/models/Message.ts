import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

messageSchema.index({ chatRoomId: 1, createdAt: 1 });

export type Message = InferSchemaType<typeof messageSchema>;
type MessageModel = Model<Message>;

export const MessageModel =
  (models.Message as MessageModel | undefined) ??
  model<Message, MessageModel>("Message", messageSchema);
