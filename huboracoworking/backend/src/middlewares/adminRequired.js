export const adminRequired = (req, res, next) => {
  if (!req.user?.role) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }
  next();
};