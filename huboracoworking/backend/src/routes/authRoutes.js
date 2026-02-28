import { Router } from "express";
import { registerUser, loginUser, updateUserPlan } from "../controllers/authController.js";
import { authRequired } from "../middlewares/auth.js"; // ← Verificá que esta línea sea exactamente así


const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/user/update-plan", authRequired, updateUserPlan);


export default router;