// model/logsMonitor.model.js
import mongoose from "mongoose";

const logsMonitorSchema = new mongoose.Schema({
    action: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "Users", default: null },
    adminId: { type: mongoose.Types.ObjectId, ref: "Admins", default: null },
    source: { type: String, enum: ["WEB", "MACHINE", "API"], default: "WEB" },
    details: { type: String, default: "" },
    
    status: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS" },
}, { timestamps: true });

export const LogsMonitor = mongoose.model("LogsMonitor", logsMonitorSchema);
