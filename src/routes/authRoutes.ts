import express from "express";
import {
    authLogin,
    authSignUp,
    authRefresh,
    authLogout,
} from "../controllers/authController";

const router = express.Router();

router.post("/sign-in", authLogin);
router.post("/sign-up", authSignUp);
router.get("/refresh", authRefresh);
router.post("/logout", authLogout);

export default router;
