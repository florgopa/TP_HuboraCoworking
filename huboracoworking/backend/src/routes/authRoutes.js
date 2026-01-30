// se definen las urls
import { Router } from "express";
import { login, register } from "../controllers/authController.js";

const router = Router();

//post /api/register
router.post("/register", register);

//post /api/login
router.post("/login", login);

export default router;