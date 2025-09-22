// src/middleware/role.middleware.js
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const { role } = req.user; // req.user comes from authMiddleware (JWT payload)
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
    next();
  };
}
