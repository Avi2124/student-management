import express from "express";
import { login, logout } from "../controllers/authController.js";

const authRouter = express.Router();
authRouter.get("/login", (req, res) => {
    res.render("login");
});
authRouter.post("/login", login);
authRouter.get("/logout", logout);
export default authRouter;
