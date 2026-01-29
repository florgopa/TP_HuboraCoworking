// se definen las urls
import { Router } from "express";
import { login } from "../controllers/authController.js";

const router = Router();

//post /api/login
router.post("/register", register)

//post /api/login
router.post("/login", login);

export default router;