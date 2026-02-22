import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { getMyProfile, upsertMyProfile } from "../controllers/profileController.js";

const router = Router();

router.get("/profile/me", authRequired, getMyProfile);
router.put("/profile/me", authRequired, upsertMyProfile);

export default router;