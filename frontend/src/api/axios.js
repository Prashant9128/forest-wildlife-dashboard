import axios from "axios";

// Agar Vercel pe hai toh Render wala URL, agar Local hai toh localhost
const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api"
  : "https://forest-wildlife-dashboard.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;