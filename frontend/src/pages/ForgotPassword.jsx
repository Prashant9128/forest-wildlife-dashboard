import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaKey, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }

        setIsLoading(true);
        setMessage({ type: "", text: "" });

        try {
            await api.post("/auth/reset-password", {
                email,
                newPassword
            });

            setMessage({ type: "success", text: "Password reset successfully! Redirecting..." });
            setTimeout(() => navigate("/login"), 2000);

        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to reset password" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 py-12 animate-fade-in">
                <div className="w-full max-w-md">
                    <div className="glass-card">

                        <Link to="/login" className="text-white/50 hover:text-white flex items-center gap-2 mb-6 transition-colors">
                            <FaArrowLeft className="text-xs" /> Back to Login
                        </Link>

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg mb-4">
                                <FaKey className="text-3xl text-white" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
                            <p className="text-white/60">Enter your email and new password</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {message.text && (
                                <div className={`px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-100' : 'bg-green-500/10 border border-green-500/20 text-green-100'}`}>
                                    {message.text}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-white/80">Email Address</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                        <FaEnvelope />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your registered email"
                                        className="input-field pl-12"
                                        required
                                    />
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-white/80">New Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                        <FaLock />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="input-field pl-12 pr-12"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-white/80">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                        <FaLock />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="input-field pl-12"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
