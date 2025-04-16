import TeacherRepository from "../repositories/teacherRepository";
import { Request, Response } from "express";

class TeacherController {
    private teacherRepository: TeacherRepository;

    constructor() {
        this.teacherRepository = new TeacherRepository();
    }

    async getAllTeachers(req: Request, res: Response) {
        try {
            const teachers = await this.teacherRepository.getAllTeachers();
            res.status(200).json(teachers);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving teachers" });
        }
    }
    async getTeacherById(req: Request, res: Response) {
        const teacherId = Number(req.params.id);
        try {
            const teacher = await this.teacherRepository.getTeacherById(teacherId);
            if (teacher) {
                res.status(200).json(teacher);
            } else {
                res.status(404).json({ message: "Teacher not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error retrieving teacher" });
        }
    }

    async createTeacher(req: Request, res: Response) {
        const teacherData = req.body;
        try {
            const newTeacher = await this.teacherRepository.createTeacher(teacherData);
            res.status(201).json(newTeacher);
        } catch (error) {
            res.status(500).json({ message: "Error creating teacher" });
        }
    }
    async updateTeacher(req: Request, res: Response) {
        const teacherId = Number(req.params.id);
        const teacherData = req.body;
        try {
            const updatedTeacher = await this.teacherRepository.updateTeacher(teacherId, teacherData);
            if (updatedTeacher) {
                res.status(200).json(updatedTeacher);
            } else {
                res.status(404).json({ message: "Teacher not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error updating teacher" });
        }
    }

    async deleteTeacher(req: Request, res: Response) {
        const teacherId = Number(req.params.id);
        try {
            const deleted = await this.teacherRepository.deleteTeacher(teacherId);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: "Teacher not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error deleting teacher" });
        }
    }

}