import {
  createUser,
  createUserByWeb,
  loginUser,
  listAllUsers,
  getUser,
  updateUserProfile,
  updateUserPassword,
  adminUpdateUser,
  deleteUser
} from "../service/user.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

export const userRouter = (app) => {
  // -------------------- CREATE USER (RECHARGE admin) --------------------
  app.post("/user/create", authMiddleware, authorizeRoles("RECHARGE"), async (req, res) => {
    try {
      const { name, cardId, balance } = req.body;
      const user = await createUser(name, cardId, balance);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------- REGISTER USER (WEB) --------------------
  app.post("/user/register", async (req, res) => {
    try {
      const { name, cardId, email, password } = req.body;
      const user = await createUserByWeb( name, cardId, email, password);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------- LOGIN USER --------------------
  app.post("/user/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await loginUser(email, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  });

  // -------------------- GET ALL USERS (RECHARGE admin) --------------------
  app.get("/user/all", authMiddleware, authorizeRoles("RECHARGE"), async (req, res) => {
    try {
      const users = await listAllUsers();
      res.json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------- GET SINGLE USER --------------------
  app.get("/user/:id", authMiddleware, async (req, res) => {
    try {
      const user = await getUser(req.params.id);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------- UPDATE PROFILE (SELF, EXCEPT BALANCE) --------------------
  app.put("/user/:id/profile", authMiddleware, async (req, res) => {
    try {
      if (req.user.id !== req.params.id) {
        return res.status(403).json({ error: "You can only update your own profile" });
      }
      const updatedUser = await updateUserProfile(req.params.id, req.body);
      res.json({ message: "Profile updated", user: updatedUser });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------- UPDATE PASSWORD (SELF) --------------------
  app.put("/user/:id/password", authMiddleware, async (req, res) => {
    try {
      if (req.user.id !== req.params.id) {
        return res.status(403).json({ error: "You can only update your own password" });
      }
      const { newPassword } = req.body;
      const updatedUser = await updateUserPassword(req.params.id, newPassword);
      res.json({ message: "Password updated", user: updatedUser });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------- ADMIN UPDATE USER --------------------
  app.put("/user/:id/admin-update", authMiddleware, authorizeRoles("RECHARGE"), async (req, res) => {
    try {
      const updatedUser = await adminUpdateUser(req.params.id, req.body);
      res.json({ message: "User updated by admin", user: updatedUser });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------- DELETE USER --------------------
  app.delete("/user/:id", authMiddleware, authorizeRoles("RECHARGE"), async (req, res) => {
    try {
      const deletedUser = await deleteUser(req.params.id);
      res.json({ message: "User deleted", user: deletedUser });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
};
