import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "Users", required: true }, // sender
    recipientId: { type: mongoose.Types.ObjectId, ref: "Users", required: false }, // optional for payments
    nature: { type: String, enum: ["RECHARGE", "PAYMENT", "WITHDRAWAL"], required: true },
    adminId: { type: mongoose.Types.ObjectId, ref: "Admins", required: false }, // only for RECHARGE
    amount: { type: Number, default: 0 },
    status1: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
}, { timestamps: true });

export const Transaction = mongoose.model("Transaction", transactionSchema);
