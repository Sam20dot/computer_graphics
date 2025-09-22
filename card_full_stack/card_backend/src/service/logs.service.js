// service/logsMonitor.service.js
import { LogsMonitor } from "../model/logsMonitor.model.js";

// CREATE LOG
export async function createLog({ action, userId = null, adminId = null, source = "WEB", details = "", status = "SUCCESS" }) {
    const log = new LogsMonitor({ action, userId, adminId, source, details, status });
    return await log.save();
}

// LIST LOGS with filters
export async function listLogs(query = {}, options = {}) {
    const { sortBy = "createdAt", sortOrder = -1 } = options;
    return await LogsMonitor.find(query).sort({ [sortBy]: sortOrder });
}

// FILTER LOGS
export async function listLogsByUser(userId, options = {}) {
    return await listLogs({ userId }, options);
}
//list all logs 
export async function listAllLogs(options) {
    return await listLogs({},options)
}

export async function listLogsByAdmin(adminId, options = {}) {
    return await listLogs({ adminId }, options);
}

export async function listLogsByAction(action, options = {}) {
    return await listLogs({ action }, options);
}

export async function listLogsByStatus(status, options = {}) {
    return await listLogs({ status }, options);
}

// GET SINGLE LOG
export async function getLog(logId) {
    return await LogsMonitor.findById(logId);
}

// UPDATE LOG
export async function updateLog(logId, updateData) {
    const allowedFields = ["action", "details", "status", "source"];
    const filteredData = {};
    for (const key of allowedFields) {
        if (updateData[key] !== undefined) filteredData[key] = updateData[key];
    }
    return await LogsMonitor.findByIdAndUpdate(logId, { $set: filteredData }, { new: true });
}

// DELETE LOG
export async function deleteLog(logId) {
    return await LogsMonitor.findByIdAndDelete(logId);
}
