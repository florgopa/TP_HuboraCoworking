import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api", adminRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "backend is working!" });
});

export default app;