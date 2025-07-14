import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";

const router = Router()
router.post("/register", validateRequest(createUserZodSchema),UserController.createUser)
router.get("/all-users", UserController.getAllUsers)

export const UserRoutes = router