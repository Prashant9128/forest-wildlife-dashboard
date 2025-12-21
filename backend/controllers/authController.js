import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

/* ======================
   REGISTER
====================== */
export const register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await User.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registered successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================
   LOGIN
====================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // Render + Vercel
      sameSite: "none",    // MUST for cross-site
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/* ======================
   LOGOUT
====================== */
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({
    success: true,
    message: "Logged out",
  });
};

/* ======================
   GOOGLE LOGIN
====================== */
export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        role: "user",
        avatar: picture,
      });
    }

    const jwtToken = createToken(user);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid Google Token",
    });
  }
};
