import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false }, // For admin to mark as read
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
