import express from "express";
import cors from "cors";
import { pool } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import spaceAdminRoutes from "./routes/spaceAdminRoutes.js";
import spaceRoutes from "./routes/spaceRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", reservationRoutes);
app.use("/api", adminRoutes);
app.use("/api", spaceAdminRoutes);
app.use("/api", spaceRoutes);
app.use("/api", reportsRoutes);

app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "API running" });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 as test");
    res.json({ ok: true, db: rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default app;