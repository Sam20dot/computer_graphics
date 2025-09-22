import dotenv from "dotenv";
dotenv.config({ path: '../../.env' }); // ensure path points to your .env

import mongoose from "mongoose";

export async function initDatabase() {
  const database_url = process.env.DATABASE_URL;
  console.log("DB URL:", database_url);

  if (!database_url) throw new Error("DATABASE_URL is not defined");

  mongoose.connection.on("open", () => console.log("✅ DB connected"));
  mongoose.connection.on("disconnected", () => console.log("⚠️ DB disconnected"));
  mongoose.connection.on("error", (err) => console.error("❌ DB error:", err));

  await mongoose.connect(database_url);
}

// Run test

