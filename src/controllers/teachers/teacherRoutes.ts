import { validateTeacher } from "../middlewares/validateTeacherRegister";
import { Router } from "express";
import { getAllTeacherController } from "../teachers/getTeacherController";
import { registerTeacherController } from "./registerTeacherController";
import { updateTeacherController } from "./updateTeacherController";
import { deleteTeacherController } from "./deleteTeacherController";
import { validateTeacherUpdate } from "../middlewares/validateTeacherUpdate";
import { validateTeacherAuthenticate } from "../middlewares/validateTeacherAuthenticate";
import { authenticateController } from "./authenticateController";
import { validateJWT } from "../middlewares/validateJWT";

const teacherRouter = Router();

//Routes for unauthenticated users
teacherRouter.post("/teachers", validateTeacher, registerTeacherController);
teacherRouter.post("/teachers/login", validateTeacherAuthenticate, authenticateController);

//Routes for authenticated users
teacherRouter.get("/teachers", validateJWT(), getAllTeacherController);
teacherRouter.put("/teachers/:id", validateJWT(), validateTeacherUpdate, updateTeacherController);
teacherRouter.delete("/teachers/:id", validateJWT(), deleteTeacherController);

export default teacherRouter;