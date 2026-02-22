import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { adminRequired } from "../middlewares/adminRequired.js";
import { adminGetUsers, adminUpdateUser } from "../controllers/adminUsersController.js";

const router = Router();

router.get("/admin/users", authRequired, adminRequired, adminGetUsers);
router.patch("/admin/users/:id", authRequired, adminRequired, adminUpdateUser);

export default router;