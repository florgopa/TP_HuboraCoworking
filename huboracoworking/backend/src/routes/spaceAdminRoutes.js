import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { adminRequired } from "../middlewares/adminRequired.js";

import {
  adminGetSpaces,
  adminCreateSpace,
  adminUpdateSpace,
} from "../controllers/spaceAdminController.js";

const router = Router();

router.get("/admin/spaces", authRequired, adminRequired, adminGetSpaces);
router.post("/admin/spaces", authRequired, adminRequired, adminCreateSpace);
router.patch("/admin/spaces/:id", authRequired, adminRequired, adminUpdateSpace);

export default router;