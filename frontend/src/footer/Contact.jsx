import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import api from "../api/axios";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post("/messages", formData);
            setSubmitted(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white px-6 py-24">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Have questions about wildlife tracking or experiencing issues with the dashboard?
                        Our support team is here to assist you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="glass p-8 rounded-2xl">
                            <h3 className="text-xl font-bold mb-6 text-white">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
                                        <FaEnvelope size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Email Us</h4>
                                        <p className="text-sm text-slate-400 mt-1">prashant.kumar.9417@gmail.com</p>
                                        <p className="text-sm text-slate-400">partnerships@wildguard.org</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
                                        <FaPhone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Call Us</h4>
                                        <p className="text-sm text-slate-400 mt-1">+91 91287 21721</p>
                                        <p className="text-sm text-slate-400">Mon-Fri, 9am - 6pm IST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-purple-500/10 p-3 rounded-lg text-purple-400">
                                        <FaMapMarkerAlt size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Headquarters</h4>
                                        <p className="text-sm text-slate-400 mt-1">123 Conservation Way,</p>
                                        <p className="text-sm text-slate-400">Wildlife Park, New Delhi 110001</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="glass p-8 rounded-2xl">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <FaPaperPlane className="text-white text-2xl" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-slate-400">
                                    Thank you for reaching out. We'll get back to you shortly.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 text-emerald-400 hover:text-emerald-300 text-sm font-semibold"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        placeholder="Enter Your Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        placeholder="Enter Your Email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="report">Report an Issue</option>
                                        <option value="partnership">Partnership Inquiry</option>
                                        <option value="general">General Question</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                                        placeholder="Enter Your Message"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Sending..." : "Send Message"} <FaPaperPlane className="text-sm" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
