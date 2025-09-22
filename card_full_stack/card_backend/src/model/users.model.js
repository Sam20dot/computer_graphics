// users.model.js
import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // sparse allows nulls
    cardId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    password: { type: String, required: false }
}, { timestamps: true });

export const Users = mongoose.model("Users", usersSchema);
