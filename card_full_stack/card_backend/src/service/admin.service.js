import { Admins } from "../model/admins.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Create Admin
export async function createAdmin(name, email, password, role) {
    const hashedP = await bcrypt.hash(password, 10);
    const admin = new Admins({ name, email, password: hashedP, role });
    return await admin.save();
}

// Login Admin
export async function loginAdmin(email, password) {
    try {
        const admin = await Admins.findOne({ email });
        if (!admin) throw new Error("Invalid credentials");

        const compareP = await bcrypt.compare(password, admin.password);
        if (!compareP) throw new Error("Invalid credentials");

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return {
            token,
            adminId: admin._id,
            name: admin.name,
            role: admin.role,
        };
    } catch (error) {
        console.log("Login error:", error.message);
        throw error;
    }
}

// List Admins
async function listAdmin(query = {}, options = {}) {
    const { sortBy = "createdAt", sortOrder = -1 } = options;
    return await Admins.find(query).sort({ [sortBy]: sortOrder });
}
export async function listAdminByName(name, options) {
    return await listAdmin({ name }, options);
}
export async function listAdminByRole(role, options) {
    return await listAdmin({ role }, options);
}
export async function listAllAdmin(options = {}) {
    return await listAdmin({}, options);
}

// Get Admin by ID
export async function getAdminById(adminId) {
    return await Admins.findById(adminId);
}

// Update Admin
export async function updateAdmins(adminId, name, email, password, role) {
    const updateData = { name, email, role };
    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }
    return await Admins.findByIdAndUpdate(
        adminId,
        { $set: updateData },
        { new: true }
    );
}

// Delete Admin
export async function deleteAdmin(adminId) {
    return await Admins.findByIdAndDelete(adminId);
}
