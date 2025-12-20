import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

/* =======================
   REGISTER
======================= */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists first to fail fast (optional but good practice)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   LOGIN
======================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      })
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   GOOGLE LOGIN
======================= */
router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: name,
        email,
        role: "user",
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res
      .cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      })
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
});

/* =======================
   LOGOUT
======================= */
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

/* =======================
   🔥 TOTAL RANGERS (REAL DATA)
   Admin only
======================= */
router.get("/count", auth, admin, async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =======================
   RECOVER PASSWORD (DEMO ONLY)
   In production, send email with token.
   Here, we allow direct reset for demonstration.
======================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
