import { Request, Response } from "express";
import { UpdateTeacherService } from "../../services/updateTeacherService";
import PrismaTeacherRepository from "../../repositories/prisma/prismaTeacherRepository";
import { TeacherNotFoundError } from "../../services/errors/teacherNotFoundError";
import { UUID } from "node:crypto";
import { TeacherAlreadyExistsError } from "../../services/errors/teacherAlreadyExistsError";

export async function updateTeacherController(req: Request, res: Response) {

	const id = req.params.id as UUID;
    const { name, email, password, schoolId } = req.body;

    try {
        const usersRepository = new PrismaTeacherRepository();
        const updateService = new UpdateTeacherService(usersRepository);

        await updateService.execute({
            id,
            name,
            email,
            password,
            schoolId,
        });
    } catch (error) {
        if (error instanceof TeacherAlreadyExistsError) {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json({ message: "User updated successfully" });
}