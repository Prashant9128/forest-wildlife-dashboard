import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });


export const register = async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  await User.create({ ...req.body, password: hashed });
  res.json({ message: "Registered successfully" });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json("User not found");

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(401).json("Wrong password");

  const token = createToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000 // 1 Day
  });

  res.json({ user });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

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
      // Create new user if not exists
      user = await User.create({
        username: name,
        email,
        role: "user", // Default role
        // No password needed
      });
    }

    const jwtToken = createToken(user);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 Day
    });

    res.json({ user });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
};
