// src/router/logs.router.js
import { listAllLogs, getLog, deleteLog } from "../service/logs.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

export const logsRouter = (app) => {
  app.get("/logs/all", authMiddleware,authorizeRoles("ADMIN"), async (req, res) => {
    try {
      const logs = await listAllLogs();
      res.json(logs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/logs/:id", authMiddleware, authorizeRoles("ADMIN"),async (req, res) => {
    try {
      const log = await getLog(req.params.id);
      res.json(log);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/logs/:id", authMiddleware,authorizeRoles("ADMIN"), async (req, res) => {
    try {
      const log = await deleteLog(req.params.id);
      res.json(log);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
};
