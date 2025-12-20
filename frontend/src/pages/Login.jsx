import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaLeaf, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        rememberMe
      });

      // 1. Get user data from response
      const userData = response.data.user;

      // 2. Save to LocalStorage (Crucial for AdminRoute protection)
      localStorage.setItem("user", JSON.stringify(userData));

      // 3. Update Context
      setUser(userData);

      // 4. Role-Based Navigation
      if (userData.role === "admin") {
        navigate("/admin"); // Redirect Admins to Dashboard
      } else {
        navigate("/"); // Redirect Users to Home
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential
      });
      const userData = res.data.user;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      if (userData.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      console.error("Google Login Error:", err);
      setError(err.response?.data?.message || "Google Login Failed");
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 animate-fade-in">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="glass-card">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-forest-500 to-forest-700 rounded-2xl shadow-lg mb-4">
                <FaLeaf className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-white/60">Sign in to continue to WildGuard</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-100 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-white/80">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-white/80">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    <FaLock />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-12 pr-12"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-forest-600 focus:ring-2 focus:ring-forest-500/50"
                  />
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-forest-400 hover:text-forest-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Sign In
                  </>
                )}
              </button>


              <div className="flex items-center gap-4 my-4">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-white/40 text-sm">OR</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Login Failed")}
                  theme="filled_black"
                  shape="pill"
                  width="300"
                />
              </div>

            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#0F172A] text-white/50"> {/* Fixed bg color to match theme */}
                  New to WildGuard?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link
                to="/register"
                className="btn-secondary w-full inline-block text-center"
              >
                Create an Account
              </Link>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-white/40 text-sm mt-6">
            Protected by WildGuard • Wildlife Conservation Platform
          </p>
        </div>
      </div>
    </div>
  );
}