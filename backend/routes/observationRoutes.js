import express from "express";
import Observation from "../models/Observation.js";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

/* =========================
   1️⃣ Create Observation
   User → status = pending
========================= */
router.post("/", auth, async (req, res) => {
  try {
    const obs = await Observation.create({
      ...req.body,
      createdBy: req.user.id,
      status: "pending", // ✅ CORRECT FIELD
    });

    // 🔥 SOCKET EMIT
    const io = req.app.get("io");
    io.emit("new-report", obs);

    res.status(201).json(obs);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create observation",
      error: error.message,
    });
  }
});

/* =========================
   2️⃣ Public – Approved only
========================= */
router.get("/", async (req, res) => {
  try {
    const data = await Observation.find({ status: "approved" })
      .populate("createdBy", "username") // Populate username
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch observations",
      error: error.message,
    });
  }
});

/* =========================
   3️⃣ Admin – Get all
========================= */
router.get("/all", auth, admin, async (req, res) => {
  try {
    const data = await Observation.find()
      .populate("createdBy", "username") // Populate username
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   4️⃣ Admin – Pending list
========================= */
router.get("/pending", auth, admin, async (req, res) => {
  try {
    const data = await Observation.find({ status: "pending" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   5️⃣ Admin – Approve / Reject
========================= */
router.put("/:id/status", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Observation.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );

    // 🔥 REALTIME ADMIN EVENT
    const io = req.app.get("io");
    if (status === "approved") {
      io.emit("admin-approved", updated);
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   6️⃣ General Update (Edit)
   Admin only (or Owner if implemented)
========================= */
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Observation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   7️⃣ Admin – Delete
========================= */
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const deleted = await Observation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Observation not found" });
    }

    res.json({ message: "Observation deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
});

export default router;
