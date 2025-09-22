// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { adminRouter } from "./src/router/admin.router.js";
import { userRouter } from "./src/router/user.router.js";
import { transactionRouter } from "./src/router/transaction.router.js";
import { logsRouter } from "./src/router/logs.router.js";
import { initDatabase } from "./src/model/init.model.js";

dotenv.config();
await initDatabase()

const app = express();
app.use(cors({ origin: "http://localhost:5173", // Vite frontend
  credentials: true,}
   
));
app.use(express.json());

// Initialize routers
adminRouter(app);
userRouter(app);
transactionRouter(app);
logsRouter(app);

export default app;
