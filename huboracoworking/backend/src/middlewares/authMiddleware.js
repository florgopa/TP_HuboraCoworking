import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization; // "Bearer token"

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      message: "Token requerido"
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return res.status(403).json({
      ok: false,
      message: "Token inválido o expirado"
    });
  }
};