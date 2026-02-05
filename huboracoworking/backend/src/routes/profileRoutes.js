console.log("PROFILE ROUTES CARGADO");

import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";


const router = Router();

router.get("/profile/:email", getProfile);
router.put("/profile/:email", updateProfile);
router.put("/:email", profileController.updateProfile);


export default router;
