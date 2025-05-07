import { Request, Response } from "express";
import { UUID } from "node:crypto";
import PrismaTeacherRepository from "../../repositories/prisma/prismaTeacherRepository";
import { DeleteTeacherService } from "../../services/deleteTeacherService";
import { TeacherNotFoundError } from "../../services/errors/teacherNotFoundError";

export async function deleteTeacherController(req: Request, res: Response) {
	const id = req.params.id as UUID;

    try {
        const usersRepository = new PrismaTeacherRepository();
        const deleteService = new DeleteTeacherService(usersRepository);

        await deleteService.execute({ id });
    } catch (error) {
        if (error instanceof TeacherNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}