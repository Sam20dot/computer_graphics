import mongoose from "mongoose";

const adminsSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["ADMIN", "RECHARGE"], required: true },
    password: { type: String },
  },
  { timestamps: true }
);

export const Admins = mongoose.model("Admins", adminsSchema);
