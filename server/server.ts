import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { connectDB } from "./config/db.js";
import aiRoutes from "./routes/aiRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import { initSocketServer, registerSocketHandlers } from "./sockets/index.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", equipmentRoutes);
app.use("/api", aiRoutes);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    initSocketServer(httpServer);
    registerSocketHandlers();

    httpServer.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

void startServer();
