import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.cookies.token;
  console.log("Auth Middleware - Token:", token ? "Found" : "Missing"); // Log token status

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Auth Middleware - Invalid Token:", err.message); // Log verify error
      return res.status(403).json("Invalid token");
    }
    req.user = user;
    console.log("Auth Middleware - User:", user); // Log user info
    next();
  });
}
