import { Router } from "express";
import { register, login } from "../controllers/authController";

const route: Router = Router();

route.post("/register", register);
route.post("/login", login);

export default route;
