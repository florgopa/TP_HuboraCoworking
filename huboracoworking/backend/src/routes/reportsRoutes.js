import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { adminRequired } from "../middlewares/adminRequired.js";

import {
  getPlansEstimate,
  getKpis,
  getReservationsByMonth,
  getTopSpaces,
} from "../controllers/reportsController.js";

const router = Router();

// Reportes admin
router.get("/admin/reports/plans-estimate", authRequired, adminRequired, getPlansEstimate);
router.get("/admin/reports/kpis", authRequired, adminRequired, getKpis);
router.get("/admin/reports/reservations-by-month", authRequired, adminRequired, getReservationsByMonth);
router.get("/admin/reports/top-spaces", authRequired, adminRequired, getTopSpaces);

export default router;