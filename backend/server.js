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
   ALLOWED ORIGINS
======================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://forest-wildlife-dashboard-claozgprk-prashant9128s-projects.vercel.app"
];

/* =======================
   CORS (VERY IMPORTANT)
======================= */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

/* =======================
   DATABASE
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });

/* =======================
   ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/observations", observationRoutes);
app.use("/api/messages", messageRoutes);

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("🚀 WildGuard Backend is Running");
});

/* =======================
   HTTP + SOCKET.IO
======================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.set("io", io);

/* =======================
   SOCKET EVENTS
======================= */
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
