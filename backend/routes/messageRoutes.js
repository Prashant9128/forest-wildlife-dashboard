import express from "express";
import Message from "../models/Message.js";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

// 1. POST /api/messages (Public - Submit Form)
router.post("/", async (req, res) => {
    try {
        const newMessage = await Message.create(req.body);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ message: "Failed to send message", error: error.message });
    }
});

// 2. GET /api/messages (Admin Only - View All)
router.get("/", auth, admin, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
});

// 3. DELETE /api/messages/:id (Admin Only)
router.delete("/:id", auth, admin, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete" });
    }
});

export default router;
