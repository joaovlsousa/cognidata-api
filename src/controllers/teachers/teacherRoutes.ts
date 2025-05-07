import { validateTeacher } from "../middlewares/validateTeacherRegister";
import { Router } from "express";
import { getAllTeacherController } from "../teachers/getTeacherController";
import { registerTeacherController } from "./registerTeacherController";
import { updateTeacherController } from "./updateTeacherController";
import { deleteTeacherController } from "./deleteTeacherController";

const teacherRouter = Router();

teacherRouter.get("/teachers", getAllTeacherController);
teacherRouter.post("/teachers", validateTeacher, registerTeacherController);
teacherRouter.put("/teachers/:id", updateTeacherController);
teacherRouter.delete("/teachers/:id", deleteTeacherController);

export default teacherRouter;