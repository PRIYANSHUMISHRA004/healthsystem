import { Socket } from "socket.io";
import { AppointmentModel, ChatRoomModel, MessageModel } from "../models/index.js";

interface JoinRoomPayload {
  chatRoomId: string;
  userId: string;
  userType: "user" | "hospital";
}

interface SendMessagePayload {
  chatRoomId: string;
  senderId: string;
  message: string;
}

export const registerChatHandlers = (socket: Socket): void => {
  socket.on("joinRoom", async (payload: JoinRoomPayload, callback) => {
    try {
      const { chatRoomId, userId, userType } = payload;
      
      const chatRoom = await ChatRoomModel.findById(chatRoomId);
      if (!chatRoom) {
        return callback?.({ error: "Chat room not found." });
      }

      // Check if user is theoretically a participant
      const isParticipant = chatRoom.participants.some(p => p.toString() === userId);
      if (!isParticipant) {
        return callback?.({ error: "You are not a participant in this chat room." });
      }

      // Validate user-hospital restriction rule
      if (chatRoom.type === "user-hospital") {
        const otherParticipants = chatRoom.participants.filter(p => p.toString() !== userId);
        if (otherParticipants.length === 0) {
           return callback?.({ error: "Invalid room participants." });
        }
        
        let appointmentExists = false;
        
        if (userType === "user") {
          const appointment = await AppointmentModel.findOne({
            patientId: userId,
            hospitalId: { $in: otherParticipants }
          });
          if (appointment) appointmentExists = true;
        } else if (userType === "hospital") {
          const appointment = await AppointmentModel.findOne({
            hospitalId: userId,
            patientId: { $in: otherParticipants }
          });
          if (appointment) appointmentExists = true;
        }

        if (!appointmentExists) {
          return callback?.({ error: "Cannot join chat. No appointment exists between user and hospital." });
        }
      }

      // Join socket room
      void socket.join(chatRoomId);
      console.log(`User/Hospital ${userId} joined room ${chatRoomId}`);
      
      // fetch previous messages
      const messages = await MessageModel.find({ chatRoomId }).sort({ createdAt: 1 });
      
      callback?.({ success: true, messages });

    } catch (error) {
      console.error("Error joining chat room:", error);
      callback?.({ error: "Internal server error." });
    }
  });

  socket.on("sendMessage", async (payload: SendMessagePayload, callback) => {
    try {
      const { chatRoomId, senderId, message } = payload;
      
      const newMessage = await MessageModel.create({
        chatRoomId,
        senderId,
        message
      });

      // Broadcast to room (meaning, to everyone in room EXCEPT sender)
      socket.to(chatRoomId).emit("receiveMessage", newMessage);
      
      callback?.({ success: true, message: newMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      callback?.({ error: "Failed to send message." });
    }
  });
};
