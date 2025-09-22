// src/router/admin.router.js
import { 
  createAdmin, 
  loginAdmin, 
  listAllAdmin,
  listAdminByName,
  listAdminByRole, 
  updateAdmins, 
  deleteAdmin 
} from "../service/admin.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js"
import { authorizeRoles } from "../middleware/role.middleware.js";

export const adminRouter = (app) => {
  // Create a super admin (no auth check for the very first one)
  app.post("/admin/create", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const admin = await createAdmin(name, email, password, role);
      res.status(201).json(admin);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Create a recharge admin - only an ADMIN can do this
  app.post("/admin/create_recharger", authMiddleware,authorizeRoles("ADMIN"), async (req, res) => {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Only ADMIN can create recharger admins" });
      }

      const { name, email, password } = req.body;
      const role = "RECHARGE"; // Force the role to RECHARGE

      const admin = await createAdmin(name, email, password, role);
      return res.status(201).json(admin);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Login route
  app.post("/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await loginAdmin(email, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  });

  // Get all admins (with filters)
  app.get("/admin/all", authMiddleware,authorizeRoles("ADMIN"), async (req, res) => {
    try {
      const { name, role, sortBy, sortOrder } = req.query;
      const options = { sortBy, sortOrder };

      if (name) {
        const adminByName = await listAdminByName(name, options);
        return res.status(200).json(adminByName);
      } else if (role) {
        const adminByRole = await listAdminByRole(role, options);
        return res.json(adminByRole);
      } else {
        return res.json(await listAllAdmin(options));
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Update admin
  app.patch("/admin/:id", authMiddleware,authorizeRoles("ADMIN"), async (req, res) => {
    try {
      const adminId = req.params.id;
      const { name, email, password, role } = req.body;
      const adminUpdate = await updateAdmins(adminId, name, email, password, role);

      return res.status(200).json(adminUpdate);
    } catch (error) {
      res.status(500).json({ error: "Error updating admin: " + error.message });
    }
  });

  // Delete admin
  app.delete("/admin/:id", authMiddleware,authorizeRoles("ADMIN"), async (req, res) => {
    try {
      const adminId = req.params.id;
      const deleted = await deleteAdmin(adminId);
      return res.json({ message: `Admin deleted successfully`, deleted });
    } catch (error) {
      res.status(500).json({ error: "Error deleting admin: " + error.message });
    }
  });
};
