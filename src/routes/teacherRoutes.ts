import TeacherController from "../controllers/teacherController";
import { validateTeacher } from "../middlewares/validateTeacher";
import { Router } from "express";

const teacherRoutes = Router();

const teacherController = new TeacherController();

teacherRoutes.get("/teachers", teacherController.getAllTeachers);
teacherRoutes.get("/teachers/:id", teacherController.getTeacherById);
teacherRoutes.post("/teachers", validateTeacher, teacherController.createTeacher);
teacherRoutes.put("/teachers/:id", teacherController.updateTeacher);
teacherRoutes.delete("/teachers/:id", teacherController.deleteTeacher);


export default teacherRoutes;