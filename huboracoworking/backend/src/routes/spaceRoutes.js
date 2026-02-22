import { Router } from "express";
import { getPublicSpaces } from "../controllers/spaceController.js";

const router = Router();

router.get("/spaces", getPublicSpaces);

export default router;