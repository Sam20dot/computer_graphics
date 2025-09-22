import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Users } from "../model/users.model.js";

// -------------------- 1️⃣ Admin creates the user first --------------------
export async function createUser(name, cardId, balance = 0) {
  const user = new Users({ name, cardId, balance });
  return await user.save();
}

// -------------------- 2️⃣ User completes registration on the web --------------------
export async function createUserByWeb(name, cardId, email, password) {
  const user = await Users.findOne({  cardId });
  if (!user) throw new Error("First register at our branch before using the web portal");

  const existingEmail = await Users.findOne({ email });
  if (existingEmail) throw new Error("Email is already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  return await Users.findByIdAndUpdate(
    user._id,
    { email, password: hashedPassword },
    { new: true }
  );
}

// -------------------- 3️⃣ Login user --------------------
export async function loginUser(email, password) {
  const user = await Users.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    id: user._id,
    name: user.name,
    balance: user.balance
  };
}

// -------------------- 4️⃣ List users --------------------
async function listUser(query = {}, options = {}) {
  const { sortBy = "createdAt", sortOrder = -1 } = options;
  return await Users.find(query).sort({ [sortBy]: sortOrder });
}

export async function listUserByName(name, options) {
  return await listUser({ name }, options);
}

export async function listUserByBalance(balance, options) {
  return await listUser({ balance }, options);
}

export async function listAllUsers(options = {}) {
  return await listUser({}, options);
}

// -------------------- 5️⃣ Get one user --------------------
export async function getUser(userId) {
  return await Users.findById(userId);
}

// -------------------- 6️⃣ Update user --------------------

// User self-update (cannot update password or cardId)
export async function updateUserProfile(userId, updateData = {}) {
  const allowedFields = ["name", "email", "balance"]; // balance ignored for self-update
  const dataToUpdate = {};

  for (const key of allowedFields) {
    if (updateData[key] !== undefined && key !== "balance") dataToUpdate[key] = updateData[key];
  }

  return await Users.findByIdAndUpdate(userId, { $set: dataToUpdate }, { new: true });
}

// User updates password
export async function updateUserPassword(userId, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await Users.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
}

// Admin update (can update everything including balance)
export async function adminUpdateUser(userId, updateData = {}) {
  const dataToUpdate = { ...updateData };
  if (updateData.password) {
    dataToUpdate.password = await bcrypt.hash(updateData.password, 10);
  }
  return await Users.findByIdAndUpdate(userId, { $set: dataToUpdate }, { new: true });
}

// -------------------- 7️⃣ Delete user --------------------
export async function deleteUser(userId) {
  return await Users.findByIdAndDelete(userId);
}
