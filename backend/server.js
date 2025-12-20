import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import observationRoutes from "./routes/observationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

/* =======================
   Middleware
======================= */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// Body size increased (image upload support)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

/* =======================
   Database
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

/* =======================
   Routes
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/observations", observationRoutes);
app.use("/api/messages", messageRoutes);

/* =======================
   HTTP Server + Socket.io
======================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  },
});

/* 🔥 MOST IMPORTANT LINE */
app.set("io", io);

/* =======================
   Socket events
======================= */
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

/* =======================
   Start Server
======================= */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
