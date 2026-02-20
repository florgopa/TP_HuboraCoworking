export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({
      ok: false,
      message: "No autorizado"
    });
  }
  next();
};