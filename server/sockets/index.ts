import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { registerChatHandlers } from "./chatHandlers.js";

let io: SocketIOServer | null = null;

export const initSocketServer = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
      methods: ["GET", "POST", "PATCH", "DELETE"]
    }
  });

  return io;
};

export const getSocketServer = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket server has not been initialized.");
  }

  return io;
};

export const registerSocketHandlers = (): void => {
  const socketServer = getSocketServer();

  socketServer.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    registerChatHandlers(socket);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export const emitEquipmentUpdated = (equipment: unknown): void => {
  getSocketServer().emit("equipmentUpdated", equipment);
};
