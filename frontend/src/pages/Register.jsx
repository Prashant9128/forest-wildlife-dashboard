import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaLeaf,
  FaUserPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";


export default function Register() {
  const [formData, setFormData] = useState({
    name: "", // Frontend field name remains 'name' for UI clarity
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (password.length < 10) return { strength: 2, label: "Medium", color: "bg-yellow-500" };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, label: "Strong", color: "bg-green-500" };
    }
    return { strength: 2, label: "Medium", color: "bg-yellow-500" };
  };

  const passwordMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }
    if (!passwordMatch) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        // 👇 FIX: Backend ko 'username' chahiye, isliye hum 'name' ko 'username' key se bhejenge.
        username: formData.name,
        email: formData.email,
        password: formData.password
      });

      // Success message dikhake login page par bhej rahe hain
      alert("Registration successful! Please login.");
      navigate("/login");

    } catch (err) {
      console.error("Registration Error:", err);
      // Backend se detailed error message show karein
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMessage);

      if (errorMessage === "An account with this email already exists.") {
        setTimeout(() => {
          navigate("/login");
        }, 1500); // 1.5 second delay taaki user message padh sake
      }
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
      console.error(err);
      setError("Google Login Failed");
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 animate-fade-in">
        <div className="w-full max-w-md">
          {/* Register Card */}
          <div className="glass-card">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-forest-500 to-forest-700 rounded-2xl shadow-lg mb-4">
                <FaLeaf className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Join WildGuard</h2>
              <p className="text-white/60">Create your account to start protecting wildlife</p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-100 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-white/80">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Your Name"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Your Password"
                    className="input-field pl-12 pr-12"
                    required
                  />
                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.strength ? passwordStrength.color : "bg-white/10"
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-white/60">
                      Password strength: <span className="font-medium">{passwordStrength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-white/80">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    <FaLock />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pl-12 pr-24"
                    required
                  />

                  {/* Validation Icon (Check/Times) */}
                  {formData.confirmPassword && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                      {passwordMatch ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                    </div>
                  )}

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formData.confirmPassword && !passwordMatch && (
                  <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-forest-600 focus:ring-2 focus:ring-forest-500/50"
                    required
                  />
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                    I agree to the{" "}
                    <Link to="/terms" className="text-forest-400 hover:text-forest-300 underline">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-forest-400 hover:text-forest-300 underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    Create Account
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
                <span className="px-4 bg-[#0F172A] text-white/50">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link
                to="/login"
                className="btn-secondary w-full inline-block text-center"
              >
                Sign In Instead
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